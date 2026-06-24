import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, map } from 'rxjs';
import { EstudioData, EstudioExportado, BaldaModulo, crearEstudioVacio, aEstudioExportado, deEstudioExportado } from '../models/estudio.model';
import { environment } from '../../environments/environment';

interface DimensionesEstructuraResponse {
  anchura_estructura: number;
  altura_estructura: number;
  profundidad_estructura: number;
}

export interface OpcionModulo {
  modulos: number;
  puertas: number;
  anchura_puerta: number;
  modulo_grande_izquierda: boolean;
}

interface OpcionesModulosResponse {
  opciones: OpcionModulo[];
}

interface ModulosVerticalesResponse {
  sugerencia: number;
  opciones: number[];
}

export interface ModuloDefinido {
  nombre: string;
  anchura: number;
  altura: number;
  profundidad: number;
}

interface ModulosDefinidosResponse {
  modulos: ModuloDefinido[];
}

export interface PiezaDespiece {
  pieza: string;
  unidades: number;
  largo: number;
  alto: number;
  grosor: number;
  modulo: string;
  calculo: string;
}

interface DespieceResponse {
  piezas: PiezaDespiece[];
}

@Injectable({
  providedIn: 'root',
})
export class EstudioService {
  private readonly apiUrl = environment.apiUrl;
  private estudio: EstudioData = crearEstudioVacio();

  constructor(private http: HttpClient) {}

  nuevoEstudio(): void {
    this.estudio = crearEstudioVacio();
  }

  invalidarModulosDefinidos(): void {
    this.estudio.definicionModulos.modulos = [];
  }

  cargarEstudio(json: string): void {
    const data: EstudioExportado = JSON.parse(json);
    this.estudio = deEstudioExportado(data);
  }

  obtenerEstudio(): EstudioData {
    return this.estudio;
  }

  exportarEstudio(): string {
    return JSON.stringify(aEstudioExportado(this.estudio), null, 2);
  }

  calcularDimensionesEstructura(): Observable<DimensionesEstructuraResponse> {
    const body = {
      anchura_espacio: this.estudio.dimensiones.anchura,
      altura_espacio: this.estudio.dimensiones.altura,
      profundidad_espacio: this.estudio.dimensiones.profundidad,
      distancia_techo: this.estudio.constantes.distanciaTecho,
      distancia_fondo: this.estudio.constantes.distanciaFondo,
      distancia_esquina_con_pared: this.estudio.constantes.distanciaEsquinaConPared,
      distancia_esquina_sin_pared: this.estudio.constantes.distanciaEsquinaSinPared,
      grosor_puerta: this.estudio.constantes.grosorPuerta,
      pared_izquierda: this.estudio.caracteristicas.paredEsquinaIzquierda,
      pared_derecha: this.estudio.caracteristicas.paredEsquinaDerecha,
    };

    return this.http
      .post<DimensionesEstructuraResponse>(
        `${this.apiUrl}/calcular-dimensiones-estructura`,
        body
      )
      .pipe(
        tap((res) => {
          this.estudio.dimensiones.anchura_estructura = res.anchura_estructura;
          this.estudio.dimensiones.altura_estructura = res.altura_estructura;
          this.estudio.dimensiones.profundidad_estructura = res.profundidad_estructura;
        })
      );
  }

  calcularOpcionesModulos(): Observable<OpcionModulo[]> {
    const body = {
      anchura_estructura: this.estudio.dimensiones.anchura_estructura,
      holgura_puerta_esquina: this.estudio.constantes.holguraPuertaEsquina,
      holgura_puerta_contigua: this.estudio.constantes.holguraPuertaContigua,
      anchura_minima_puerta: this.estudio.constantes.anchuraMinimaPuerta,
      anchura_maxima_puerta: this.estudio.constantes.anchuraMaximaPuerta,
    };

    return this.http
      .post<OpcionesModulosResponse>(
        `${this.apiUrl}/calcular-opciones-modulos`,
        body
      )
      .pipe(
        tap((res) => res.opciones),
        // Extraer solo el array de opciones
        map((res) => res.opciones)
      );
  }

  sugerirModulosVerticales(): Observable<ModulosVerticalesResponse> {
    return this.http.post<ModulosVerticalesResponse>(
      `${this.apiUrl}/sugerir-modulos-verticales`,
      { altura_estructura: this.estudio.dimensiones.altura_estructura }
    );
  }

  calcularModulosDefinidos(
    opcion: OpcionModulo,
    modulosVerticales: number,
    alturaModulo1?: number,
  ): Observable<ModuloDefinido[]> {
    const body: Record<string, unknown> = {
      modulos_horizontales: opcion.modulos,
      puertas: opcion.puertas,
      modulos_verticales: modulosVerticales,
      anchura_estructura: this.estudio.dimensiones.anchura_estructura,
      altura_estructura: this.estudio.dimensiones.altura_estructura,
      profundidad_estructura: this.estudio.dimensiones.profundidad_estructura,
      anchura_puerta: opcion.anchura_puerta,
      holgura_puerta_esquina: this.estudio.constantes.holguraPuertaEsquina,
      holgura_puerta_contigua: this.estudio.constantes.holguraPuertaContigua,
      modulo_grande_izquierda: opcion.modulo_grande_izquierda,
    };
    if (modulosVerticales === 2 && alturaModulo1 != null) {
      body['altura_modulo1'] = alturaModulo1;
    }

    return this.http
      .post<ModulosDefinidosResponse>(
        `${this.apiUrl}/calcular-modulos-definidos`,
        body
      )
      .pipe(map((res) => res.modulos));
  }

  calcularDespiece(): Observable<PiezaDespiece[]> {
    const body = {
      modulos: this.estudio.definicionModulos.modulos.map(m => ({
        nombre: m.nombre,
        anchura: m.anchura,
        altura: m.altura,
        profundidad: m.profundidad,
      })),
      baldas: this.estudio.definicionBaldas.map(b => ({
        nombreModulo: b.nombreModulo,
        baldasVerticales: b.baldasVerticales,
        posicionesVerticales: b.posicionesVerticales,
        submodulos: b.submodulos.map(s => ({
          baldasHorizontales: s.baldasHorizontales,
        })),
      })),
      grosor_tabla: this.estudio.constantes.grosorTabla,
      grosor_tabla_trasera: this.estudio.constantes.grosorTablaTrasera,
      diferencia_profundidad_balda_modulo: this.estudio.constantes.diferenciaProfundidadBaldaModulo,
      diferencia_profundidad_balda_vertical_horizontal: this.estudio.constantes.diferenciaProfundidadBaldaVerticalHorizontal,
      puertas: this.estudio.definicionModulos.puertas,
      anchura_puerta: this.estudio.definicionModulos.anchuraPuerta,
      altura_estructura: this.estudio.dimensiones.altura_estructura,
    };

    return this.http
      .post<DespieceResponse>(
        `${this.apiUrl}/calcular-despiece`,
        body
      )
      .pipe(map((res) => res.piezas));
  }
}

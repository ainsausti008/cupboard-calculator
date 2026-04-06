import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, map } from 'rxjs';
import { EstudioData, crearEstudioVacio } from '../models/estudio.model';

interface DimensionesEstructuraResponse {
  anchura_estructura: number;
  altura_estructura: number;
  profundidad_estructura: number;
}

export interface OpcionModulo {
  modulos: number;
  puertas: number;
  anchura_puerta: number;
}

interface OpcionesModulosResponse {
  opciones: OpcionModulo[];
}

@Injectable({
  providedIn: 'root',
})
export class EstudioService {
  private readonly apiUrl = 'http://localhost:8000/api';
  private estudio: EstudioData = crearEstudioVacio();

  constructor(private http: HttpClient) {}

  nuevoEstudio(): void {
    this.estudio = crearEstudioVacio();
  }

  cargarEstudio(json: string): void {
    const data: EstudioData = JSON.parse(json);
    this.estudio = data;
  }

  obtenerEstudio(): EstudioData {
    return this.estudio;
  }

  exportarEstudio(): string {
    return JSON.stringify(this.estudio, null, 2);
  }

  calcularDimensionesEstructura(): Observable<DimensionesEstructuraResponse> {
    const body = {
      anchura_espacio: this.estudio.dimensiones.anchura,
      altura_espacio: this.estudio.dimensiones.altura,
      profundidad_espacio: this.estudio.dimensiones.profundidad,
      distancia_techo: this.estudio.constantes.distanciaTecho,
      distancia_suelo: this.estudio.constantes.distanciaSuelo,
      distancia_fondo: this.estudio.constantes.distanciaFondo,
      distancia_esquina: this.estudio.constantes.distanciaEsquina,
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
}

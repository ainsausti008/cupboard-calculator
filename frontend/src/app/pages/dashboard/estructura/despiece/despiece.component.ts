import { Component, OnInit } from '@angular/core';
import { EstudioData, BaldaModulo, ModuloEstudio } from '../../../../models/estudio.model';
import { EstudioService, PiezaDespiece } from '../../../../services/estudio.service';
import * as XLSX from 'xlsx';

export interface PiezaDespieceAgregada {
  pieza: string;
  unidades: number;
  largo: number;
  alto: number;
  grosor: number;
}

@Component({
  selector: 'app-despiece',
  templateUrl: './despiece.component.html',
  styleUrls: ['./despiece.component.scss'],
})
export class DespieceComponent implements OnInit {
  estudio!: EstudioData;

  /** Indica si hay datos suficientes para mostrar el resumen */
  datosCompletos = false;

  /** Resultado del despiece */
  piezas: PiezaDespiece[] = [];
  piezasAgregadas: PiezaDespieceAgregada[] = [];
  cargandoDespiece = false;
  errorDespiece: string | null = null;

  constructor(private estudioService: EstudioService) {}

  ngOnInit(): void {
    this.estudio = this.estudioService.obtenerEstudio();
    this.datosCompletos = this.estudio.definicionModulos.modulos.length > 0;
  }

  /** Devuelve las dimensiones de un módulo por nombre */
  dimensionesModulo(nombreModulo: string): ModuloEstudio | null {
    return this.estudio.definicionModulos.modulos.find(m => m.nombre === nombreModulo) || null;
  }

  /** Devuelve la balda asociada a un módulo */
  baldaDeModulo(nombreModulo: string): BaldaModulo | null {
    return this.estudio.definicionBaldas.find(b => b.nombreModulo === nombreModulo) || null;
  }

  /** Nombre de submódulo (a, b, c…) */
  nombreSubmodulo(baldaModulo: BaldaModulo, index: number): string {
    if (baldaModulo.baldasVerticales === 0) {
      return baldaModulo.nombreModulo;
    }
    const letra = String.fromCharCode(97 + index);
    return `${baldaModulo.nombreModulo}-${letra}`;
  }

  /** Texto descriptivo de paredes en esquinas */
  textoParedes(): string {
    const izq = this.estudio.caracteristicas.paredEsquinaIzquierda;
    const der = this.estudio.caracteristicas.paredEsquinaDerecha;
    if (izq && der) return 'Ambos lados';
    if (izq) return 'Solo esquina izquierda';
    if (der) return 'Solo esquina derecha';
    return 'Ninguna';
  }

  /** Formatea las dimensiones de una pieza como texto */
  formatoDimensiones(pieza: PiezaDespiece): string {
    return `${pieza.largo} × ${pieza.alto} × ${pieza.grosor} mm`;
  }

  /** Lanza el cálculo del despiece contra el backend */
  calcularDespiece(): void {
    this.cargandoDespiece = true;
    this.errorDespiece = null;
    this.piezas = [];

    this.estudioService.calcularDespiece().subscribe({
      next: (piezas) => {
        this.piezas = piezas;
        this.piezasAgregadas = this.agregarPiezas(piezas);
        this.cargandoDespiece = false;
      },
      error: (err) => {
        this.cargandoDespiece = false;
        this.errorDespiece = 'Error al calcular el despiece. Revisa que el backend esté en marcha.';
        console.error(err);
      },
    });
  }

  /**
   * Agrupa las piezas por dimensiones (largo × alto × grosor).
   * Las piezas con las mismas dimensiones se fusionan en una sola fila,
   * sumando las unidades y concatenando los nombres con su módulo.
   */
  private agregarPiezas(piezas: PiezaDespiece[]): PiezaDespieceAgregada[] {
    const mapa = new Map<string, PiezaDespieceAgregada>();

    for (const p of piezas) {
      const clave = `${p.largo}|${p.alto}|${p.grosor}`;
      const nombreCompleto = p.modulo && p.modulo !== '—'
        ? `${p.pieza} (${p.modulo})`
        : p.pieza;

      const existente = mapa.get(clave);
      if (existente) {
        existente.pieza += `, ${nombreCompleto}`;
        existente.unidades += p.unidades;
      } else {
        mapa.set(clave, {
          pieza: nombreCompleto,
          unidades: p.unidades,
          largo: p.largo,
          alto: p.alto,
          grosor: p.grosor,
        });
      }
    }

    return Array.from(mapa.values());
  }

  /** Formatea las dimensiones de una pieza agregada */
  formatoDimensionesAgregada(pieza: PiezaDespieceAgregada): string {
    return `${pieza.largo} × ${pieza.alto} × ${pieza.grosor} mm`;
  }

  /** Descarga la tabla agregada como fichero Excel (.xlsx) */
  descargarExcel(): void {
    const datos = this.piezasAgregadas.map(p => ({
      Pieza: p.pieza,
      Unidades: p.unidades,
      'Largo (mm)': p.largo,
      'Alto (mm)': p.alto,
      'Grosor (mm)': p.grosor,
    }));

    const ws = XLSX.utils.json_to_sheet(datos);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Despiece agregado');
    XLSX.writeFile(wb, 'despiece_agregado.xlsx');
  }
}

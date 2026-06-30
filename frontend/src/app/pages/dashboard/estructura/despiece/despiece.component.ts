import { Component, OnInit } from '@angular/core';
import { EstudioData, BaldaModulo, ModuloEstudio } from '../../../../models/estudio.model';
import { EstudioService, PiezaDespiece } from '../../../../services/estudio.service';
import type * as ExcelJS from 'exceljs';

export interface PiezaDespieceAgregada {
  pieza: string;
  unidades: number;
  largo: number;
  alto: number;
  grosor: number;
  canteado: string[];
}

/** Una dimensión individual de una pieza, con indicación de si lleva canto */
export interface ParteDimension {
  valor: number | string;
  /** Lleva canto en al menos un borde */
  canteado: boolean;
  /** Lleva canto en los dos bordes (subrayado doble, e.g. puerta) */
  doble: boolean;
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

  /** Devuelve las tres dimensiones de una pieza con su marca de canteado.
   * Cuando tanto largo como alto llevan canto (p. ej. puerta), ambos se
   * marcan como dobles (subrayado doble).
   */
  partesDimensiones(pieza: PiezaDespiece | PiezaDespieceAgregada): ParteDimension[] {
    const esDoble = pieza.canteado.includes('largo') && pieza.canteado.includes('alto');
    return [
      { valor: pieza.largo,  canteado: pieza.canteado.includes('largo'),  doble: esDoble },
      { valor: pieza.alto,   canteado: pieza.canteado.includes('alto'),   doble: esDoble },
      { valor: pieza.grosor, canteado: pieza.canteado.includes('grosor'), doble: false },
    ];
  }

  /** Dimensiones redondeadas (mm enteros) de una pieza agregada con su marca de canteado. */
  partesDimensionesRedondeadas(pieza: PiezaDespieceAgregada): ParteDimension[] {
    const esDoble = pieza.canteado.includes('largo') && pieza.canteado.includes('alto');
    return [
      { valor: Math.round(pieza.largo),  canteado: pieza.canteado.includes('largo'),  doble: esDoble },
      { valor: Math.round(pieza.alto),   canteado: pieza.canteado.includes('alto'),   doble: esDoble },
      { valor: Math.round(pieza.grosor), canteado: pieza.canteado.includes('grosor'), doble: false },
    ];
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
      const clave = `${p.largo}|${p.alto}|${p.grosor}|${[...p.canteado].sort().join(',')}`;
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
          canteado: [...p.canteado],
        });
      }
    }

    return Array.from(mapa.values());
  }

  /** Descarga la tabla agregada como fichero Excel (.xlsx) con subrayado de canteado */
  async descargarExcel(): Promise<void> {
    // Carga diferida de exceljs: solo se descarga al pulsar el botón,
    // evitando que entre en el bundle inicial.
    const ExcelJSModule = await import('exceljs');
    const ExcelJSLib = (ExcelJSModule as unknown as { default?: typeof ExcelJS }).default ?? ExcelJSModule;

    const workbook = new ExcelJSLib.Workbook();
    const sheet = workbook.addWorksheet('Despiece agregado');

    sheet.columns = [
      { header: 'Pieza',                   key: 'pieza',   width: 42 },
      { header: 'Unidades',                key: 'uds',     width: 10 },
      { header: 'Dimensiones',             key: 'dims',    width: 26 },
      { header: 'Dimensiones redondeadas', key: 'dimsRed', width: 26 },
    ];

    // Cabecera en negrita
    const headerRow = sheet.getRow(1);
    headerRow.font = { bold: true };
    headerRow.alignment = { vertical: 'middle' };

    for (const p of this.piezasAgregadas) {
      const esPuerta = p.pieza.startsWith('Puerta');
      const partes     = this.partesDimensiones(p);
      const partesRed  = this.partesDimensionesRedondeadas(p);

      const row = sheet.addRow({ pieza: p.pieza, uds: p.unidades });

      const buildRichText = (ps: ParteDimension[]): ExcelJS.CellRichTextValue => ({
        richText: ps.flatMap((parte, i) => {
          const underline: ExcelJS.Font['underline'] =
            parte.doble ? 'double' : parte.canteado ? true : false;
          const segmento: ExcelJS.RichText = {
            text: String(parte.valor),
            font: underline ? { underline } : {},
          };
          return i < 2 ? [segmento, { text: ' × ' }] : [segmento];
        }).concat({ text: ' mm' }),
      });

      row.getCell('dims').value = buildRichText(partes);
      row.getCell('dimsRed').value = esPuerta
        ? { richText: [{ text: '—' }] }
        : buildRichText(partesRed);
    }

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob(
      [buffer],
      { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'despiece_agregado.xlsx';
    a.click();
    URL.revokeObjectURL(url);
  }
}

import { Component, OnInit } from '@angular/core';
import { EstudioData, BaldaModulo, ModuloEstudio } from '../../../../models/estudio.model';
import { EstudioService, PiezaDespiece } from '../../../../services/estudio.service';

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
        this.cargandoDespiece = false;
      },
      error: (err) => {
        this.cargandoDespiece = false;
        this.errorDespiece = 'Error al calcular el despiece. Revisa que el backend esté en marcha.';
        console.error(err);
      },
    });
  }
}

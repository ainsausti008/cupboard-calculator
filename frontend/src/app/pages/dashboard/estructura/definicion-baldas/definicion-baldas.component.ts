import { Component, OnInit } from '@angular/core';
import { EstudioData, BaldaModulo } from '../../../../models/estudio.model';
import { EstudioService } from '../../../../services/estudio.service';

@Component({
  selector: 'app-definicion-baldas',
  templateUrl: './definicion-baldas.component.html',
  styleUrls: ['./definicion-baldas.component.scss'],
})
export class DefinicionBaldasComponent implements OnInit {
  estudio!: EstudioData;

  /** Opciones disponibles para el desplegable de baldas verticales */
  opcionesBaldasVerticales = [0, 1];

  /** Opciones disponibles para el desplegable de baldas horizontales */
  opcionesBaldasHorizontales = [0, 1, 2, 3, 4];

  constructor(private estudioService: EstudioService) {}

  ngOnInit(): void {
    this.estudio = this.estudioService.obtenerEstudio();
    this.inicializarBaldas();
  }

  /** Inicializa la estructura de baldas a partir de los módulos definidos */
  private inicializarBaldas(): void {
    const modulosDefinidos = this.estudio.definicionModulos.modulos;
    const baldasExistentes = this.estudio.definicionBaldas;

    this.estudio.definicionBaldas = modulosDefinidos.map((modulo) => {
      const existente = baldasExistentes.find(
        (b) => b.nombreModulo === modulo.nombre
      );
      if (existente) {
        return existente;
      }
      return {
        nombreModulo: modulo.nombre,
        baldasVerticales: 0,
        posicionesVerticales: [],
        submodulos: [{ baldasHorizontales: 0 }],
      };
    });
  }

  /** Al cambiar el número de baldas verticales de un módulo, regenerar submódulos y posiciones */
  onCambioBaldasVerticales(baldaModulo: BaldaModulo): void {
    const numBaldas = baldaModulo.baldasVerticales;
    const dims = this.dimensionesModulo(baldaModulo.nombreModulo);
    const anchuraModulo = dims?.anchura ?? 0;

    if (numBaldas === 0) {
      baldaModulo.posicionesVerticales = [];
      baldaModulo.submodulos = [{ baldasHorizontales: 0 }];
      return;
    }

    // Generar posiciones equidistantes por defecto
    const antiguasPosiciones = baldaModulo.posicionesVerticales;
    baldaModulo.posicionesVerticales = [];
    for (let i = 0; i < numBaldas; i++) {
      if (i < antiguasPosiciones.length) {
        baldaModulo.posicionesVerticales.push(antiguasPosiciones[i]);
      } else {
        const posicion = Math.round(
          ((i + 1) * anchuraModulo) / (numBaldas + 1)
        );
        baldaModulo.posicionesVerticales.push(posicion);
      }
    }

    // Regenerar submódulos
    const numSubmodulos = numBaldas + 1;
    const antiguos = baldaModulo.submodulos;
    baldaModulo.submodulos = [];
    for (let i = 0; i < numSubmodulos; i++) {
      baldaModulo.submodulos.push({
        baldasHorizontales:
          i < antiguos.length ? antiguos[i].baldasHorizontales : 0,
      });
    }
  }

  trackByIndex(index: number): number {
    return index;
  }

  /** Genera el nombre del submódulo (letras a, b, c…) */
  nombreSubmodulo(baldaModulo: BaldaModulo, index: number): string {
    if (baldaModulo.baldasVerticales === 0) {
      return baldaModulo.nombreModulo;
    }
    const letra = String.fromCharCode(97 + index); // a, b, c...
    return `${baldaModulo.nombreModulo}-${letra}`;
  }

  /** Devuelve las dimensiones del módulo original */
  dimensionesModulo(
    nombreModulo: string
  ): { anchura: number; altura: number; profundidad: number } | null {
    const modulo = this.estudio.definicionModulos.modulos.find(
      (m) => m.nombre === nombreModulo
    );
    return modulo || null;
  }
}

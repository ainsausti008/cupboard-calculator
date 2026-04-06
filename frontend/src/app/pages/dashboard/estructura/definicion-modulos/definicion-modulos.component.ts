import { Component, OnInit } from '@angular/core';
import { EstudioData } from '../../../../models/estudio.model';
import { EstudioService, OpcionModulo, ModuloDefinido } from '../../../../services/estudio.service';

@Component({
  selector: 'app-definicion-modulos',
  templateUrl: './definicion-modulos.component.html',
  styleUrls: ['./definicion-modulos.component.scss'],
})
export class DefinicionModulosComponent implements OnInit {
  estudio!: EstudioData;
  cargando = false;
  error: string | null = null;

  opcionesModulos: OpcionModulo[] = [];
  opcionSeleccionada: OpcionModulo | null = null;
  cargandoOpciones = false;

  modulosVerticales: number[] = [1, 2];
  modulosVerticalesSeleccionados = 1;
  cargandoVerticales = false;
  alturaModulo1: number | null = null;

  modulosDefinidos: ModuloDefinido[] = [];
  cargandoResumen = false;

  constructor(private estudioService: EstudioService) {}

  ngOnInit(): void {
    this.estudio = this.estudioService.obtenerEstudio();
    this.calcularDimensiones();
  }

  calcularDimensiones(): void {
    this.cargando = true;
    this.error = null;

    this.estudioService.calcularDimensionesEstructura().subscribe({
      next: () => {
        this.cargando = false;
        this.calcularOpcionesModulos();
      },
      error: (err) => {
        this.cargando = false;
        this.error = 'Error al calcular las dimensiones de la estructura.';
        console.error(err);
      },
    });
  }

  calcularOpcionesModulos(): void {
    this.cargandoOpciones = true;

    this.estudioService.calcularOpcionesModulos().subscribe({
      next: (opciones) => {
        this.opcionesModulos = opciones;
        this.cargandoOpciones = false;
        this.cargarModulosVerticales();
      },
      error: (err) => {
        this.cargandoOpciones = false;
        this.error = 'Error al calcular las opciones de módulos.';
        console.error(err);
      },
    });
  }

  cargarModulosVerticales(): void {
    this.cargandoVerticales = true;

    this.estudioService.sugerirModulosVerticales().subscribe({
      next: (res) => {
        this.modulosVerticales = res.opciones;
        this.modulosVerticalesSeleccionados = res.sugerencia;
        this.alturaModulo1 = Math.round(this.estudio.dimensiones.altura_estructura / 2);
        this.cargandoVerticales = false;
      },
      error: (err) => {
        this.cargandoVerticales = false;
        this.error = 'Error al calcular los módulos verticales.';
        console.error(err);
      },
    });
  }

  invalidarResumen(): void {
    this.modulosDefinidos = [];
  }

  seleccionarOpcion(index: number): void {
    this.opcionSeleccionada = index >= 0 ? this.opcionesModulos[index] : null;
    this.invalidarResumen();
  }

  onCambioVertical(): void {
    this.invalidarResumen();
  }

  onCambioAlturaModulo1(): void {
    this.invalidarResumen();
  }

  calcularResumen(): void {
    if (!this.opcionSeleccionada) {
      return;
    }

    this.cargandoResumen = true;
    this.error = null;

    this.estudioService
      .calcularModulosDefinidos(
        this.opcionSeleccionada,
        +this.modulosVerticalesSeleccionados,
        +this.modulosVerticalesSeleccionados === 2 ? (this.alturaModulo1 ?? undefined) : undefined
      )
      .subscribe({
        next: (modulos) => {
          this.modulosDefinidos = modulos;
          this.cargandoResumen = false;
        },
        error: (err) => {
          this.cargandoResumen = false;
          this.error = 'Error al calcular los módulos definidos.';
          console.error(err);
        },
      });
  }
}

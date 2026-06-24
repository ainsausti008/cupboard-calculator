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
        this.restaurarDesdeEstudio();
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
    this.estudio.definicionModulos.modulos = [];
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
          this.guardarEnEstudio();
        },
        error: (err) => {
          this.cargandoResumen = false;
          this.error = 'Error al calcular los módulos definidos.';
          console.error(err);
        },
      });
  }

  /** Persiste las selecciones y los módulos calculados en el modelo del estudio */
  private guardarEnEstudio(): void {
    const def = this.estudio.definicionModulos;
    def.opcionHorizontalIndex = this.opcionSeleccionada
      ? this.opcionesModulos.indexOf(this.opcionSeleccionada)
      : -1;
    def.modulosVerticales = +this.modulosVerticalesSeleccionados;
    def.alturaModulo1 = +this.modulosVerticalesSeleccionados === 2
      ? this.alturaModulo1
      : null;
    def.puertas = this.opcionSeleccionada ? this.opcionSeleccionada.puertas : 0;
    def.anchuraPuerta = this.opcionSeleccionada ? this.opcionSeleccionada.anchura_puerta : 0;
    def.anchuraEstructura = this.estudio.dimensiones.anchura_estructura;
    def.alturaEstructura = this.estudio.dimensiones.altura_estructura;
    def.profundidadEstructura = this.estudio.dimensiones.profundidad_estructura;
    def.modulos = this.modulosDefinidos.map((m) => ({
      nombre: m.nombre,
      anchura: m.anchura,
      altura: m.altura,
      profundidad: m.profundidad,
    }));
  }

  /** Restaura el estado del componente a partir de datos guardados en el estudio */
  private restaurarDesdeEstudio(): void {
    const def = this.estudio.definicionModulos;
    if (def.modulos.length === 0 || def.opcionHorizontalIndex < 0) {
      return; // No hay datos guardados, flujo normal
    }

    // Restaurar selección horizontal
    if (def.opcionHorizontalIndex < this.opcionesModulos.length) {
      this.opcionSeleccionada = this.opcionesModulos[def.opcionHorizontalIndex];
    }

    // Restaurar selección vertical
    this.modulosVerticalesSeleccionados = def.modulosVerticales;
    this.alturaModulo1 = def.alturaModulo1;

    // Restaurar módulos calculados
    this.modulosDefinidos = def.modulos;
  }

  /** Devuelve el nombre completo legible de un módulo (p. ej. "Izquierda Inferior (1I)") */
  nombreModuloCompleto(nombre: string): string {
    const map: Record<string, string> = {
      '1I': 'Izquierda Inferior',
      '2I': 'Derecha Inferior',
      '1S': 'Izquierda Superior',
      '2S': 'Derecha Superior',
    };
    const texto = map[nombre] ?? nombre;
    return `${texto} (${nombre})`;
  }
}

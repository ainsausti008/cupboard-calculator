import { Component, OnInit } from '@angular/core';
import { EstudioData } from '../../../../models/estudio.model';
import { EstudioService, OpcionModulo } from '../../../../services/estudio.service';

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
      },
      error: (err) => {
        this.cargandoOpciones = false;
        this.error = 'Error al calcular las opciones de módulos.';
        console.error(err);
      },
    });
  }

  seleccionarOpcion(index: number): void {
    this.opcionSeleccionada = index >= 0 ? this.opcionesModulos[index] : null;
  }
}

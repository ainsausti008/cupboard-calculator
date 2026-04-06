import { Component, OnInit } from '@angular/core';
import { EstudioData } from '../../../../models/estudio.model';
import { EstudioService } from '../../../../services/estudio.service';

@Component({
  selector: 'app-definicion-modulos',
  templateUrl: './definicion-modulos.component.html',
  styleUrls: ['./definicion-modulos.component.scss'],
})
export class DefinicionModulosComponent implements OnInit {
  estudio!: EstudioData;
  cargando = false;
  error: string | null = null;

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
      },
      error: (err) => {
        this.cargando = false;
        this.error = 'Error al calcular las dimensiones de la estructura.';
        console.error(err);
      },
    });
  }
}

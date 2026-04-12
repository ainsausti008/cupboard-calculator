import { Component, OnInit } from '@angular/core';
import { EstudioService } from '../../../../services/estudio.service';
import { EstudioData } from '../../../../models/estudio.model';

@Component({
  selector: 'app-definicion-estudio',
  templateUrl: './definicion-estudio.component.html',
  styleUrls: ['./definicion-estudio.component.scss'],
})
export class DefinicionEstudioComponent implements OnInit {
  estudio!: EstudioData;

  constructor(private estudioService: EstudioService) {}

  ngOnInit(): void {
    this.estudio = this.estudioService.obtenerEstudio();
  }

  get formularioCompleto(): boolean {
    return (
      !!this.estudio.titulo?.trim() &&
      this.estudio.dimensiones.altura > 0 &&
      this.estudio.dimensiones.anchura > 0 &&
      this.estudio.dimensiones.profundidad > 0
    );
  }
}

import { Component, OnInit } from '@angular/core';
import { EstudioService } from '../../../services/estudio.service';
import { EstudioData } from '../../../models/estudio.model';

@Component({
  selector: 'app-constantes',
  templateUrl: './constantes.component.html',
  styleUrls: ['./constantes.component.scss'],
})
export class ConstantesComponent implements OnInit {
  estudio!: EstudioData;

  constructor(private estudioService: EstudioService) {}

  ngOnInit(): void {
    this.estudio = this.estudioService.obtenerEstudio();
  }
}

import { Component, OnInit } from '@angular/core';
import { EstudioService } from '../../../services/estudio.service';
import { EstudioData } from '../../../models/estudio.model';

@Component({
  selector: 'app-parametros-globales',
  templateUrl: './parametros-globales.component.html',
  styleUrls: ['./parametros-globales.component.scss'],
})
export class ParametrosGlobalesComponent implements OnInit {
  estudio!: EstudioData;

  constructor(private estudioService: EstudioService) {}

  ngOnInit(): void {
    this.estudio = this.estudioService.obtenerEstudio();
  }
}

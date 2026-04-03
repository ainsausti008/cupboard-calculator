import { Injectable } from '@angular/core';
import { EstudioData, crearEstudioVacio } from '../models/estudio.model';

@Injectable({
  providedIn: 'root',
})
export class EstudioService {
  private estudio: EstudioData = crearEstudioVacio();

  nuevoEstudio(): void {
    this.estudio = crearEstudioVacio();
  }

  cargarEstudio(json: string): void {
    const data: EstudioData = JSON.parse(json);
    this.estudio = data;
  }

  obtenerEstudio(): EstudioData {
    return this.estudio;
  }

  exportarEstudio(): string {
    return JSON.stringify(this.estudio, null, 2);
  }
}

import { Component } from '@angular/core';
import { EstudioService } from '../../../services/estudio.service';

@Component({
  selector: 'app-exportar-estudio',
  templateUrl: './exportar-estudio.component.html',
  styleUrls: ['./exportar-estudio.component.scss'],
})
export class ExportarEstudioComponent {
  exportado = false;

  constructor(private estudioService: EstudioService) {}

  exportar(): void {
    const json = this.estudioService.exportarEstudio();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const estudio = this.estudioService.obtenerEstudio();
    const nombreArchivo = estudio.titulo
      ? `${estudio.titulo.replace(/\s+/g, '_')}.json`
      : 'estudio.json';

    const a = document.createElement('a');
    a.href = url;
    a.download = nombreArchivo;
    a.click();
    URL.revokeObjectURL(url);

    this.exportado = true;
    setTimeout(() => (this.exportado = false), 3000);
  }
}

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EstudioService } from '../../services/estudio.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss'],
})
export class InicioComponent {
  constructor(
    private estudioService: EstudioService,
    private router: Router
  ) {}

  nuevoEstudio(): void {
    this.estudioService.nuevoEstudio();
    this.router.navigate(['/estudio', 'parametros']);
  }

  cargarEstudio(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (event: Event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        const contenido = reader.result as string;
        this.estudioService.cargarEstudio(contenido);
        this.router.navigate(['/estudio', 'parametros']);
      };
      reader.readAsText(file);
    };
    input.click();
  }
}

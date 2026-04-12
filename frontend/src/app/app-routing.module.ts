import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ConstantesComponent } from './pages/dashboard/constantes/constantes.component';
import { EstructuraComponent } from './pages/dashboard/estructura/estructura.component';
import { DefinicionModulosComponent } from './pages/dashboard/estructura/definicion-modulos/definicion-modulos.component';
import { DefinicionBaldasComponent } from './pages/dashboard/estructura/definicion-baldas/definicion-baldas.component';
import { DespieceComponent } from './pages/dashboard/estructura/despiece/despiece.component';
import { DefinicionEstudioComponent } from './pages/dashboard/estructura/definicion-estudio/definicion-estudio.component';
import { ExportarEstudioComponent } from './pages/dashboard/exportar-estudio/exportar-estudio.component';

const routes: Routes = [
  { path: '', component: InicioComponent },
  {
    path: 'estudio',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'estructura', pathMatch: 'full' },
      {
        path: 'estructura',
        component: EstructuraComponent,
        children: [
          { path: '', redirectTo: 'definicion', pathMatch: 'full' },
          { path: 'definicion', component: DefinicionEstudioComponent },
          { path: 'modulos', component: DefinicionModulosComponent },
          { path: 'baldas', component: DefinicionBaldasComponent },
          { path: 'despiece', component: DespieceComponent },
        ],
      },
      { path: 'parametros', component: ConstantesComponent },
      { path: 'exportar', component: ExportarEstudioComponent },
    ],
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

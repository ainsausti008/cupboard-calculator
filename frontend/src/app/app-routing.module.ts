import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ParametrosGlobalesComponent } from './pages/dashboard/parametros-globales/parametros-globales.component';
import { EstructuraComponent } from './pages/dashboard/estructura/estructura.component';
import { DefinicionModulosComponent } from './pages/dashboard/estructura/definicion-modulos/definicion-modulos.component';
import { DefinicionBaldasComponent } from './pages/dashboard/estructura/definicion-baldas/definicion-baldas.component';
import { DespieceComponent } from './pages/dashboard/estructura/despiece/despiece.component';
import { ExportarEstudioComponent } from './pages/dashboard/exportar-estudio/exportar-estudio.component';

const routes: Routes = [
  { path: '', component: InicioComponent },
  {
    path: 'estudio',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'parametros', pathMatch: 'full' },
      { path: 'parametros', component: ParametrosGlobalesComponent },
      {
        path: 'estructura',
        component: EstructuraComponent,
        children: [
          { path: '', redirectTo: 'modulos', pathMatch: 'full' },
          { path: 'modulos', component: DefinicionModulosComponent },
          { path: 'baldas', component: DefinicionBaldasComponent },
          { path: 'despiece', component: DespieceComponent },
        ],
      },
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

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ConstantesComponent } from './pages/dashboard/constantes/constantes.component';
import { EstructuraComponent } from './pages/dashboard/estructura/estructura.component';
import { DefinicionModulosComponent } from './pages/dashboard/estructura/definicion-modulos/definicion-modulos.component';
import { DefinicionBaldasComponent } from './pages/dashboard/estructura/definicion-baldas/definicion-baldas.component';
import { DespieceComponent } from './pages/dashboard/estructura/despiece/despiece.component';
import { DefinicionEstudioComponent } from './pages/dashboard/estructura/definicion-estudio/definicion-estudio.component';
import { ExportarEstudioComponent } from './pages/dashboard/exportar-estudio/exportar-estudio.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    InicioComponent,
    DashboardComponent,
    ConstantesComponent,
    EstructuraComponent,
    DefinicionEstudioComponent,
    DefinicionModulosComponent,
    DefinicionBaldasComponent,
    DespieceComponent,
    ExportarEstudioComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

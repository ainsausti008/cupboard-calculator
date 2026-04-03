import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ParametrosGlobalesComponent } from './pages/dashboard/parametros-globales/parametros-globales.component';
import { EstructuraComponent } from './pages/dashboard/estructura/estructura.component';
import { ExportarEstudioComponent } from './pages/dashboard/exportar-estudio/exportar-estudio.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    InicioComponent,
    DashboardComponent,
    ParametrosGlobalesComponent,
    EstructuraComponent,
    ExportarEstudioComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

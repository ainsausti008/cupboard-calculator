export interface EstudioData {
  titulo: string;
  descripcion: string;
  dimensiones: {
    altura: number;
    anchura: number;
    profundidad: number;
  };
  caracteristicas: {
    paredEsquinaIzquierda: boolean;
    paredEsquinaDerecha: boolean;
  };
  constantes: {
    distanciaTecho: number;
    distanciaSuelo: number;
    distanciaFondo: number;
    distanciaEsquina: number;
    grosorTabla: number;
    grosorTablaTrasera: number;
    holguraPuertaEsquina: number;
    holguraPuertaModulo: number;
    anchuraMaximaPuerta: number;
    anchuraMinimaPuerta: number;
  };
}

export function crearEstudioVacio(): EstudioData {
  return {
    titulo: '',
    descripcion: '',
    dimensiones: {
      altura: 0,
      anchura: 0,
      profundidad: 0,
    },
    caracteristicas: {
      paredEsquinaIzquierda: false,
      paredEsquinaDerecha: false,
    },
    constantes: {
      distanciaTecho: 50,
      distanciaSuelo: 64,
      distanciaFondo: 70,
      distanciaEsquina: 40,
      grosorTabla: 19,
      grosorTablaTrasera: 10,
      holguraPuertaEsquina: 3,
      holguraPuertaModulo: 3,
      anchuraMaximaPuerta: 530,
      anchuraMinimaPuerta: 265,
    },
  };
}

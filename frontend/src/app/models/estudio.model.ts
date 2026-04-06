export interface ModuloEstudio {
  nombre: string;
  anchura: number;
  altura: number;
  profundidad: number;
}

export interface EstudioData {
  titulo: string;
  descripcion: string;
  dimensiones: {
    altura: number;
    anchura: number;
    profundidad: number;
    anchura_estructura: number;
    altura_estructura: number;
    profundidad_estructura: number;
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
    holguraPuertaContigua: number;
    anchuraMaximaPuerta: number;
    anchuraMinimaPuerta: number;
  };
  definicionModulos: {
    /** Índice de la opción horizontal seleccionada (-1 = sin selección) */
    opcionHorizontalIndex: number;
    /** Número de módulos verticales seleccionados */
    modulosVerticales: number;
    /** Altura personalizada del módulo 1 (solo cuando hay 2 módulos verticales) */
    alturaModulo1: number | null;
    /** Dimensiones de la estructura usadas en el cálculo */
    anchuraEstructura: number;
    alturaEstructura: number;
    profundidadEstructura: number;
    /** Módulos definidos con sus dimensiones */
    modulos: ModuloEstudio[];
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
      anchura_estructura: 0,
      altura_estructura: 0,
      profundidad_estructura: 0,
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
      holguraPuertaContigua: 3,
      anchuraMaximaPuerta: 530,
      anchuraMinimaPuerta: 265,
    },
    definicionModulos: {
      opcionHorizontalIndex: -1,
      modulosVerticales: 1,
      alturaModulo1: null,
      anchuraEstructura: 0,
      alturaEstructura: 0,
      profundidadEstructura: 0,
      modulos: [],
    },
  };
}

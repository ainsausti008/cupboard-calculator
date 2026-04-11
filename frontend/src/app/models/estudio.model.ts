export interface ModuloEstudio {
  nombre: string;
  anchura: number;
  altura: number;
  profundidad: number;
}

export interface SubmoduloBalda {
  /** Número de baldas horizontales en este submódulo */
  baldasHorizontales: number;
}

export interface BaldaModulo {
  /** Nombre del módulo tal como fue definido (e.g. "1I", "2D") */
  nombreModulo: string;
  /** Número de baldas verticales (0 = sin divisiones verticales) */
  baldasVerticales: number;
  /** Submódulos creados por las baldas verticales (longitud = baldasVerticales + 1 si > 0, o 1 si = 0) */
  submodulos: SubmoduloBalda[];
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
  definicionBaldas: BaldaModulo[];
}

/** Estructura del JSON exportado/importado */
export interface EstudioExportado {
  estudio: {
    titulo: string;
    descripcion: string;
    espacio: {
      altura: number;
      anchura: number;
      profundidad: number;
      paredEsquinaIzquierda: boolean;
      paredEsquinaDerecha: boolean;
    };
  };
  constantes: EstudioData['constantes'];
  definicionModulos: EstudioData['definicionModulos'];
  definicionBaldas: BaldaModulo[];
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
    definicionBaldas: [],
  };
}

/** Convierte el modelo interno a la estructura del JSON exportado */
export function aEstudioExportado(data: EstudioData): EstudioExportado {
  return {
    estudio: {
      titulo: data.titulo,
      descripcion: data.descripcion,
      espacio: {
        altura: data.dimensiones.altura,
        anchura: data.dimensiones.anchura,
        profundidad: data.dimensiones.profundidad,
        paredEsquinaIzquierda: data.caracteristicas.paredEsquinaIzquierda,
        paredEsquinaDerecha: data.caracteristicas.paredEsquinaDerecha,
      },
    },
    constantes: { ...data.constantes },
    definicionModulos: { ...data.definicionModulos },
    definicionBaldas: data.definicionBaldas.map(b => ({ ...b, submodulos: b.submodulos.map(s => ({ ...s })) })),
  };
}

/** Convierte el JSON importado al modelo interno */
export function deEstudioExportado(json: EstudioExportado): EstudioData {
  const base = crearEstudioVacio();
  return {
    titulo: json.estudio.titulo,
    descripcion: json.estudio.descripcion,
    dimensiones: {
      altura: json.estudio.espacio.altura,
      anchura: json.estudio.espacio.anchura,
      profundidad: json.estudio.espacio.profundidad,
      anchura_estructura: base.dimensiones.anchura_estructura,
      altura_estructura: base.dimensiones.altura_estructura,
      profundidad_estructura: base.dimensiones.profundidad_estructura,
    },
    caracteristicas: {
      paredEsquinaIzquierda: json.estudio.espacio.paredEsquinaIzquierda,
      paredEsquinaDerecha: json.estudio.espacio.paredEsquinaDerecha,
    },
    constantes: { ...json.constantes },
    definicionModulos: { ...json.definicionModulos },
    definicionBaldas: (json.definicionBaldas || []).map(b => ({ ...b, submodulos: b.submodulos.map(s => ({ ...s })) })),
  };
}

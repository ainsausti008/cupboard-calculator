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
  /** Nombre del módulo tal como fue definido (e.g. "1I", "2S") */
  nombreModulo: string;
  /** Número de baldas verticales (0 = sin divisiones verticales) */
  baldasVerticales: number;
  /** Posiciones de las baldas verticales en mm desde el borde izquierdo del módulo */
  posicionesVerticales: number[];
  /** Submódulos creados por las baldas verticales (longitud = baldasVerticales + 1 si > 0, o 1 si = 0) */
  submodulos: SubmoduloBalda[];
}

export interface OpcionesDespiece {
  /** Aplicar canteado a los bordes expuestos de las piezas */
  canteado: boolean;
  /** Añadir remates al despiece */
  remates: boolean;
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
    distanciaEsquinaConPared: number;
    distanciaEsquinaSinPared: number;
    grosorTabla: number;
    grosorTablaTrasera: number;
    holguraPuertaEsquina: number;
    holguraPuertaContigua: number;
    anchuraMaximaPuerta: number;
    anchuraMinimaPuerta: number;
    grosorPuerta: number;
    diferenciaProfundidadBaldaModulo: number;
    diferenciaProfundidadBaldaVerticalHorizontal: number;
  };
  definicionModulos: {
    /** Índice de la opción horizontal seleccionada (-1 = sin selección) */
    opcionHorizontalIndex: number;
    /** Número de módulos verticales seleccionados */
    modulosVerticales: number;
    /** Altura personalizada del módulo 1 (solo cuando hay 2 módulos verticales) */
    alturaModulo1: number | null;
    /** Número de puertas de la opción seleccionada */
    puertas: number;
    /** Anchura de cada puerta (mm) */
    anchuraPuerta: number;
    /** Dimensiones de la estructura usadas en el cálculo */
    anchuraEstructura: number;
    alturaEstructura: number;
    profundidadEstructura: number;
    /** Módulos definidos con sus dimensiones */
    modulos: ModuloEstudio[];
  };
  definicionBaldas: BaldaModulo[];
  /** Opciones de configuración del despiece */
  opcionesDespiece: OpcionesDespiece;
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
  opcionesDespiece?: OpcionesDespiece;
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
      distanciaEsquinaConPared: 40,
      distanciaEsquinaSinPared: 19,
      grosorTabla: 19,
      grosorTablaTrasera: 10,
      holguraPuertaEsquina: 3,
      holguraPuertaContigua: 3,
      anchuraMaximaPuerta: 530,
      anchuraMinimaPuerta: 265,
      grosorPuerta: 19,
      diferenciaProfundidadBaldaModulo: 1,
      diferenciaProfundidadBaldaVerticalHorizontal: 1,
    },
    definicionModulos: {
      opcionHorizontalIndex: -1,
      modulosVerticales: 1,
      alturaModulo1: null,
      puertas: 0,
      anchuraPuerta: 0,
      anchuraEstructura: 0,
      alturaEstructura: 0,
      profundidadEstructura: 0,
      modulos: [],
    },
    definicionBaldas: [],
    opcionesDespiece: {
      canteado: true,
      remates: true,
    },
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
    opcionesDespiece: { ...data.opcionesDespiece },
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
    opcionesDespiece: { ...base.opcionesDespiece, ...(json.opcionesDespiece || {}) },
  };
}

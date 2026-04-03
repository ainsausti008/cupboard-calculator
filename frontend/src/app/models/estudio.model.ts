export interface EstudioData {
  titulo: string;
  dimensiones: {
    altura: number;
    anchura: number;
    profundidad: number;
  };
}

export function crearEstudioVacio(): EstudioData {
  return {
    titulo: '',
    dimensiones: {
      altura: 0,
      anchura: 0,
      profundidad: 0,
    },
  };
}

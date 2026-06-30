"""Esquemas Pydantic para los endpoints de cálculo."""

from pydantic import BaseModel


class DimensionesEstructuraRequest(BaseModel):
    """Datos de entrada para calcular las dimensiones de la estructura."""

    anchura_espacio: float
    altura_espacio: float
    profundidad_espacio: float
    distancia_techo: float
    distancia_fondo: float
    distancia_esquina_con_pared: float
    distancia_esquina_sin_pared: float
    pared_izquierda: bool
    pared_derecha: bool
    grosor_puerta: float


class DimensionesEstructuraResponse(BaseModel):
    """Resultado del cálculo de dimensiones de la estructura."""

    anchura_estructura: float
    altura_estructura: float
    profundidad_estructura: float


# ---------------------------------------------------------------------------
# Opciones de módulos horizontales
# ---------------------------------------------------------------------------


class OpcionesModulosRequest(BaseModel):
    """Datos de entrada para calcular las opciones de módulos horizontales."""

    anchura_estructura: float
    holgura_puerta_esquina: float
    holgura_puerta_contigua: float
    anchura_minima_puerta: float
    anchura_maxima_puerta: float


class OpcionModulo(BaseModel):
    """Una opción válida de configuración de módulos."""

    modulos: int
    puertas: int
    anchura_puerta: float
    modulo_grande_izquierda: bool = False


class OpcionesModulosResponse(BaseModel):
    """Resultado del cálculo de opciones de módulos horizontales."""

    opciones: list[OpcionModulo]


# ---------------------------------------------------------------------------
# Módulos verticales
# ---------------------------------------------------------------------------


class ModulosVerticalesRequest(BaseModel):
    """Datos de entrada para sugerir los módulos en vertical."""

    altura_estructura: float


class ModulosVerticalesResponse(BaseModel):
    """Resultado de la sugerencia de módulos en vertical."""

    sugerencia: int
    opciones: list[int]


# ---------------------------------------------------------------------------
# Módulos definidos (resumen)
# ---------------------------------------------------------------------------


class ModulosDefinidosRequest(BaseModel):
    """Datos de entrada para calcular los módulos definidos."""

    modulos_horizontales: int
    puertas: int
    modulos_verticales: int
    anchura_estructura: float
    altura_estructura: float
    profundidad_estructura: float
    anchura_puerta: float
    holgura_puerta_esquina: float
    holgura_puerta_contigua: float
    altura_modulo1: float | None = None
    modulo_grande_izquierda: bool = False


class ModuloDefinido(BaseModel):
    """Dimensiones de un módulo individual."""

    nombre: str
    anchura: float
    altura: float
    profundidad: float


class ModulosDefinidosResponse(BaseModel):
    """Lista de módulos con sus dimensiones."""

    modulos: list[ModuloDefinido]


# ---------------------------------------------------------------------------
# Despiece
# ---------------------------------------------------------------------------


class SubmoduloBaldaInput(BaseModel):
    """Información de baldas horizontales de un submódulo."""

    baldasHorizontales: int


class BaldaModuloInput(BaseModel):
    """Configuración de baldas de un módulo."""

    nombreModulo: str
    baldasVerticales: int
    posicionesVerticales: list[float]
    submodulos: list[SubmoduloBaldaInput]


class ModuloInput(BaseModel):
    """Dimensiones de un módulo individual (entrada para despiece)."""

    nombre: str
    anchura: float
    altura: float
    profundidad: float


class DespieceRequest(BaseModel):
    """Datos de entrada para calcular el despiece completo del armario."""

    modulos: list[ModuloInput]
    baldas: list[BaldaModuloInput]
    grosor_tabla: float
    grosor_tabla_trasera: float
    diferencia_profundidad_balda_modulo: float
    diferencia_profundidad_balda_vertical_horizontal: float
    puertas: int
    anchura_puerta: float
    altura_estructura: float
    canteado: bool = True
    remates: bool = True


class PiezaDespiece(BaseModel):
    """Una pieza individual del despiece."""

    pieza: str
    unidades: int
    largo: float
    alto: float
    grosor: float
    modulo: str
    calculo: str
    canteado: list[str] = []


class DespieceResponse(BaseModel):
    """Resultado del cálculo de despiece."""

    piezas: list[PiezaDespiece]

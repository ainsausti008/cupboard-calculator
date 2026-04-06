"""Esquemas Pydantic para los endpoints de cálculo."""

from pydantic import BaseModel


class DimensionesEstructuraRequest(BaseModel):
    """Datos de entrada para calcular las dimensiones de la estructura."""

    anchura_espacio: float
    altura_espacio: float
    profundidad_espacio: float
    distancia_techo: float
    distancia_suelo: float
    distancia_fondo: float
    distancia_esquina: float
    pared_izquierda: bool
    pared_derecha: bool


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


class ModuloDefinido(BaseModel):
    """Dimensiones de un módulo individual."""

    nombre: str
    anchura: float
    altura: float
    profundidad: float


class ModulosDefinidosResponse(BaseModel):
    """Lista de módulos con sus dimensiones."""

    modulos: list[ModuloDefinido]

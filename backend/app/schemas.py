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

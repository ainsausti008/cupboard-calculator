"""
Módulo de fórmulas para el cálculo de dimensiones del armario.

Contiene las funciones puras de cálculo que se reutilizan
en distintas partes de la aplicación.
"""


def calcular_anchura_estructura(
    anchura_espacio: float,
    distancia_esquina: float,
    pared_izquierda: bool,
    pared_derecha: bool,
) -> float:
    """Calcula la anchura de la estructura del armario.

    - Con ambas paredes: se descuentan dos distancias de esquina.
    - Con una sola pared: se descuenta una distancia de esquina.
    - Sin paredes: la anchura coincide con la del espacio.
    """
    paredes = int(pared_izquierda) + int(pared_derecha)
    return anchura_espacio - paredes * distancia_esquina


def calcular_altura_estructura(
    altura_espacio: float,
    distancia_techo: float,
    distancia_suelo: float,
) -> float:
    """Calcula la altura de la estructura del armario.

    Se descuentan las distancias al techo y al suelo.
    """
    return altura_espacio - distancia_techo - distancia_suelo


def calcular_profundidad_estructura(
    profundidad_espacio: float,
    distancia_fondo: float,
) -> float:
    """Calcula la profundidad de la estructura del armario.

    Se descuenta la distancia al fondo.
    """
    return profundidad_espacio - distancia_fondo

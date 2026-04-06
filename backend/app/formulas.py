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


# ---------------------------------------------------------------------------
# Módulos horizontales
# ---------------------------------------------------------------------------


def calcular_anchura_puerta(
    anchura_estructura: float,
    holgura_puerta_esquina: float,
    holgura_puerta_contigua: float,
    cantidad_puertas: int,
) -> float:
    """Calcula la anchura de cada puerta (todas iguales).

    anchura_puerta = (anchura_estructura
                      - 2 * holgura_puerta_esquina
                      - (cantidad_puertas - 1) * holgura_puerta_contigua)
                     / cantidad_puertas
    """
    espacio_util = (
        anchura_estructura
        - 2 * holgura_puerta_esquina
        - (cantidad_puertas - 1) * holgura_puerta_contigua
    )
    return espacio_util / cantidad_puertas


# Catálogo fijo de opciones: (módulos, puertas)
OPCIONES_MODULOS = [
    (1, 2),
    (2, 3),
    (2, 4),
]


def calcular_opciones_modulos(
    anchura_estructura: float,
    holgura_puerta_esquina: float,
    holgura_puerta_contigua: float,
    anchura_minima_puerta: float,
    anchura_maxima_puerta: float,
) -> list[dict]:
    """Devuelve las opciones de módulos horizontales cuya anchura de puerta
    está dentro de los límites permitidos."""
    opciones: list[dict] = []

    for modulos, puertas in OPCIONES_MODULOS:
        anchura = calcular_anchura_puerta(
            anchura_estructura=anchura_estructura,
            holgura_puerta_esquina=holgura_puerta_esquina,
            holgura_puerta_contigua=holgura_puerta_contigua,
            cantidad_puertas=puertas,
        )
        if anchura_minima_puerta <= anchura <= anchura_maxima_puerta:
            opciones.append(
                {
                    "modulos": modulos,
                    "puertas": puertas,
                    "anchura_puerta": round(anchura, 2),
                }
            )

    return opciones


# ---------------------------------------------------------------------------
# Módulos verticales
# ---------------------------------------------------------------------------

ALTURA_UMBRAL_DOS_MODULOS = 2000  # mm


def sugerir_modulos_verticales(altura_estructura: float) -> int:
    """Devuelve la cantidad sugerida de módulos en vertical.

    - 2 módulos si la altura de la estructura supera los 2000 mm.
    - 1 módulo en caso contrario.
    """
    return 2 if altura_estructura > ALTURA_UMBRAL_DOS_MODULOS else 1


# ---------------------------------------------------------------------------
# Módulos definidos (resumen)
# ---------------------------------------------------------------------------


def _anchura_modulo_2puertas(
    anchura_estructura: float,
) -> float:
    """1 módulo horizontal con 2 puertas: anchura = anchura_estructura."""
    return anchura_estructura


def _anchuras_modulos_3puertas(
    anchura_puerta: float,
    holgura_puerta_esquina: float,
    holgura_puerta_contigua: float,
) -> tuple[float, float]:
    """2 módulos horizontales con 3 puertas (I es el pequeño, D el grande).

    modulo I = anchura_puerta + holgura_esquina + holgura_contigua / 2
    modulo D = anchura_puerta × 2 + holgura_esquina + holgura_contigua + holgura_contigua / 2
    """
    anch_i = anchura_puerta + holgura_puerta_esquina + holgura_puerta_contigua / 2
    anch_d = (
        anchura_puerta * 2
        + holgura_puerta_esquina
        + holgura_puerta_contigua
        + holgura_puerta_contigua / 2
    )
    return round(anch_i, 2), round(anch_d, 2)


def _anchuras_modulos_4puertas(
    anchura_puerta: float,
    holgura_puerta_esquina: float,
    holgura_puerta_contigua: float,
) -> tuple[float, float]:
    """2 módulos horizontales con 4 puertas (mismo ancho).

    cada módulo = anchura_puerta × 2 + holgura_esquina + holgura_contigua + holgura_contigua / 2
    """
    anch = (
        anchura_puerta * 2
        + holgura_puerta_esquina
        + holgura_puerta_contigua
        + holgura_puerta_contigua / 2
    )
    return round(anch, 2), round(anch, 2)


def calcular_modulos_definidos(
    modulos_horizontales: int,
    puertas: int,
    modulos_verticales: int,
    anchura_estructura: float,
    altura_estructura: float,
    profundidad_estructura: float,
    anchura_puerta: float,
    holgura_puerta_esquina: float,
    holgura_puerta_contigua: float,
    altura_modulo1: float | None = None,
) -> list[dict]:
    """Genera la lista de módulos con nombre y dimensiones."""

    # --- Anchuras horizontales ---
    if modulos_horizontales == 1:
        anchuras_h = [_anchura_modulo_2puertas(anchura_estructura)]
    elif puertas == 3:
        anch_i, anch_d = _anchuras_modulos_3puertas(
            anchura_puerta, holgura_puerta_esquina, holgura_puerta_contigua
        )
        anchuras_h = [anch_i, anch_d]
    else:  # 4 puertas
        anch_i, anch_d = _anchuras_modulos_4puertas(
            anchura_puerta, holgura_puerta_esquina, holgura_puerta_contigua
        )
        anchuras_h = [anch_i, anch_d]

    # --- Alturas verticales ---
    if modulos_verticales == 1:
        alturas_v = [round(altura_estructura, 2)]
    else:
        alt1 = (
            round(altura_modulo1, 2)
            if altura_modulo1 is not None
            else round(altura_estructura / 2, 2)
        )
        alt2 = round(altura_estructura - alt1, 2)
        alturas_v = [alt1, alt2]

    # --- Nomenclatura y combinación ---
    etiquetas_h = [""] if modulos_horizontales == 1 else ["I", "D"]
    etiquetas_v = ["1"] if modulos_verticales == 1 else ["1", "2"]

    modulos: list[dict] = []
    for iv, etiq_v in enumerate(etiquetas_v):
        for ih, etiq_h in enumerate(etiquetas_h):
            nombre = f"{etiq_v}{etiq_h}" if etiq_h else etiq_v
            modulos.append(
                {
                    "nombre": nombre,
                    "anchura": anchuras_h[ih],
                    "altura": alturas_v[iv],
                    "profundidad": round(profundidad_estructura, 2),
                }
            )

    return modulos

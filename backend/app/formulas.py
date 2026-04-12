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


# ---------------------------------------------------------------------------
# Despiece — cálculo de piezas
# ---------------------------------------------------------------------------


def calcular_pieza_trasera(
    anchura_modulo: float,
    altura_modulo: float,
    grosor_tabla_trasera: float,
) -> dict:
    """Calcula las dimensiones de la tabla trasera de un módulo.

    La trasera se superpone a los costados y a las bases, por lo que sus
    dimensiones coinciden con las del módulo completo.

    Dimensiones:
        anchura_modulo × altura_modulo × grosor_tabla_trasera
    """
    return {
        "largo": round(anchura_modulo, 2),
        "alto": round(altura_modulo, 2),
        "grosor": round(grosor_tabla_trasera, 2),
    }


def calcular_pieza_costado(
    altura_modulo: float,
    profundidad_modulo: float,
    grosor_tabla_trasera: float,
    grosor_tabla: float,
) -> dict:
    """Calcula las dimensiones de una tabla de costado (lateral) de un módulo.

    El costado no llega hasta el fondo del módulo porque la trasera
    se apoya sobre él.

    Dimensiones:
        altura_modulo × (profundidad_modulo − grosor_tabla_trasera) × grosor_tabla
    """
    profundidad_costado = profundidad_modulo - grosor_tabla_trasera
    return {
        "largo": round(altura_modulo, 2),
        "alto": round(profundidad_costado, 2),
        "grosor": round(grosor_tabla, 2),
    }


def calcular_pieza_base(
    anchura_modulo: float,
    profundidad_modulo: float,
    grosor_tabla_trasera: float,
    grosor_tabla: float,
) -> dict:
    """Calcula las dimensiones de una tabla de base (inferior o superior).

    La base encaja entre los dos costados, por lo que se descuenta el
    grosor de ambos laterales de la anchura. La profundidad se reduce
    por la trasera.

    Dimensiones:
        (anchura_modulo − 2 × grosor_tabla) × (profundidad_modulo − grosor_tabla_trasera) × grosor_tabla
    """
    anchura_base = anchura_modulo - 2 * grosor_tabla
    profundidad_base = profundidad_modulo - grosor_tabla_trasera
    return {
        "largo": round(anchura_base, 2),
        "alto": round(profundidad_base, 2),
        "grosor": round(grosor_tabla, 2),
    }


def calcular_pieza_balda_vertical(
    altura_modulo: float,
    profundidad_modulo: float,
    grosor_tabla_trasera: float,
    grosor_tabla: float,
    diferencia_profundidad_balda_modulo: float,
) -> dict:
    """Calcula las dimensiones de una balda vertical.

    La balda vertical encaja entre la base inferior y la superior, por lo
    que se descuenta dos veces el grosor de tabla de la altura del costado.
    La profundidad se calcula a partir de la del costado menos la
    diferencia de profundidad entre balda y módulo.

    Dimensiones:
        (altura_modulo − 2 × grosor_tabla)
        × (profundidad_modulo − grosor_tabla_trasera − diferencia_profundidad_balda_modulo)
        × grosor_tabla
    """
    altura_balda = altura_modulo - 2 * grosor_tabla
    profundidad_costado = profundidad_modulo - grosor_tabla_trasera
    profundidad_balda = profundidad_costado - diferencia_profundidad_balda_modulo
    return {
        "largo": round(altura_balda, 2),
        "alto": round(profundidad_balda, 2),
        "grosor": round(grosor_tabla, 2),
    }


def calcular_pieza_balda_horizontal_sin_vertical(
    anchura_modulo: float,
    profundidad_modulo: float,
    grosor_tabla_trasera: float,
    grosor_tabla: float,
    diferencia_profundidad_balda_modulo: float,
) -> dict:
    """Calcula las dimensiones de una balda horizontal cuando NO hay baldas verticales.

    La anchura coincide con la de la tabla base (entre costados).
    La profundidad se calcula a partir de la de la base menos la
    diferencia de profundidad entre balda y módulo.

    Dimensiones:
        (anchura_modulo − 2 × grosor_tabla)
        × (profundidad_modulo − grosor_tabla_trasera − diferencia_profundidad_balda_modulo)
        × grosor_tabla
    """
    anchura_base = anchura_modulo - 2 * grosor_tabla
    profundidad_base = profundidad_modulo - grosor_tabla_trasera
    profundidad_balda = profundidad_base - diferencia_profundidad_balda_modulo
    return {
        "largo": round(anchura_base, 2),
        "alto": round(profundidad_balda, 2),
        "grosor": round(grosor_tabla, 2),
    }


def calcular_anchura_subseccion(
    indice_subseccion: int,
    total_subsecciones: int,
    anchura_modulo: float,
    posiciones_verticales: list[float],
    grosor_tabla: float,
) -> float:
    """Calcula la anchura de una subsección creada por las baldas verticales.

    Cuando hay baldas verticales, el interior del módulo queda dividido
    en subsecciones. La anchura de cada una depende de su posición:

    - Subsección izquierda (primera):
        posición_balda − grosor_tabla − grosor_tabla / 2

        Donde grosor_tabla es el costado izquierdo y grosor_tabla / 2
        es la mitad de la balda vertical.

    - Subsección derecha (última):
        anchura_modulo − posición_balda − grosor_tabla − grosor_tabla / 2

        Donde grosor_tabla es el costado derecho y grosor_tabla / 2
        es la mitad de la balda vertical.

    - Subsección intermedia (si hubiera más de 1 balda vertical):
        posición_balda[i] − posición_balda[i−1] − grosor_tabla

        Donde grosor_tabla es el grosor completo de la balda vertical
        que queda entre las dos subsecciones contiguas.
    """
    if indice_subseccion == 0:
        # Primera subsección (izquierda)
        return posiciones_verticales[0] - grosor_tabla - grosor_tabla / 2
    elif indice_subseccion == total_subsecciones - 1:
        # Última subsección (derecha)
        return (
            anchura_modulo - posiciones_verticales[-1] - grosor_tabla - grosor_tabla / 2
        )
    else:
        # Subsección intermedia
        return (
            posiciones_verticales[indice_subseccion]
            - posiciones_verticales[indice_subseccion - 1]
            - grosor_tabla
        )


def calcular_pieza_balda_horizontal_en_subseccion(
    anchura_subseccion: float,
    profundidad_modulo: float,
    grosor_tabla_trasera: float,
    grosor_tabla: float,
    diferencia_profundidad_balda_modulo: float,
    diferencia_profundidad_balda_vertical_horizontal: float,
) -> dict:
    """Calcula las dimensiones de una balda horizontal dentro de una subsección
    creada por baldas verticales.

    La anchura es la de la subsección (calculada por ``calcular_anchura_subseccion``).
    La profundidad se calcula a partir de la de la balda vertical menos la
    diferencia de profundidad entre la balda vertical y la horizontal.

    Dimensiones:
        anchura_subseccion
        × (profundidad_balda_vertical − diferencia_profundidad_balda_vertical_horizontal)
        × grosor_tabla

    Donde profundidad_balda_vertical =
        profundidad_modulo − grosor_tabla_trasera − diferencia_profundidad_balda_modulo
    """
    profundidad_balda_vertical = (
        profundidad_modulo - grosor_tabla_trasera - diferencia_profundidad_balda_modulo
    )
    profundidad_balda_h = (
        profundidad_balda_vertical - diferencia_profundidad_balda_vertical_horizontal
    )
    return {
        "largo": round(anchura_subseccion, 2),
        "alto": round(profundidad_balda_h, 2),
        "grosor": round(grosor_tabla, 2),
    }


def calcular_pieza_puerta(
    anchura_puerta: float,
    altura_modulo: float,
    grosor_tabla: float,
) -> dict:
    """Calcula las dimensiones de una puerta.

    La anchura de la puerta ya viene precalculada en la fase de definición
    de módulos. La altura coincide con la del módulo.

    Dimensiones:
        anchura_puerta × altura_modulo × grosor_tabla
    """
    return {
        "largo": round(anchura_puerta, 2),
        "alto": round(altura_modulo, 2),
        "grosor": round(grosor_tabla, 2),
    }


def calcular_despiece(
    modulos: list[dict],
    baldas: list[dict],
    grosor_tabla: float,
    grosor_tabla_trasera: float,
    diferencia_profundidad_balda_modulo: float,
    diferencia_profundidad_balda_vertical_horizontal: float,
    puertas: int,
    anchura_puerta: float,
) -> list[dict]:
    """Genera la lista completa de piezas (despiece) del armario.

    Para cada módulo se generan las 5 tablas estructurales (trasera,
    2 costados, base inferior, base superior) y las baldas verticales
    y horizontales según la configuración elegida.

    Finalmente se añaden las puertas.

    Parámetros
    ----------
    modulos : list[dict]
        Lista de módulos con nombre, anchura, altura y profundidad.
    baldas : list[dict]
        Lista con la configuración de baldas de cada módulo
        (baldasVerticales, posicionesVerticales, submodulos).
    grosor_tabla : float
        Grosor de las tablas normales (mm).
    grosor_tabla_trasera : float
        Grosor de la tabla trasera (mm).
    diferencia_profundidad_balda_modulo : float
        Diferencia de profundidad entre una balda y el módulo (mm).
    diferencia_profundidad_balda_vertical_horizontal : float
        Diferencia de profundidad entre la balda vertical y la horizontal (mm).
    puertas : int
        Número total de puertas.
    anchura_puerta : float
        Anchura de cada puerta (mm).

    Devuelve
    --------
    list[dict]
        Lista de piezas con: pieza, unidades, largo, alto, grosor, modulo.
    """
    piezas: list[dict] = []

    for modulo in modulos:
        nombre = modulo["nombre"]
        anchura = modulo["anchura"]
        altura = modulo["altura"]
        profundidad = modulo["profundidad"]

        # --- Trasera ---
        dims = calcular_pieza_trasera(anchura, altura, grosor_tabla_trasera)
        piezas.append(
            {
                "pieza": "Trasera",
                "unidades": 1,
                **dims,
                "modulo": nombre,
            }
        )

        # --- Costados (2 por módulo) ---
        dims = calcular_pieza_costado(
            altura, profundidad, grosor_tabla_trasera, grosor_tabla
        )
        piezas.append(
            {
                "pieza": "Costado",
                "unidades": 2,
                **dims,
                "modulo": nombre,
            }
        )

        # --- Base inferior ---
        dims = calcular_pieza_base(
            anchura, profundidad, grosor_tabla_trasera, grosor_tabla
        )
        piezas.append(
            {
                "pieza": "Base inferior",
                "unidades": 1,
                **dims,
                "modulo": nombre,
            }
        )

        # --- Base superior ---
        piezas.append(
            {
                "pieza": "Base superior",
                "unidades": 1,
                **dims,
                "modulo": nombre,
            }
        )

        # --- Baldas ---
        balda_modulo = next((b for b in baldas if b["nombreModulo"] == nombre), None)
        if balda_modulo is None:
            continue

        baldas_vert = balda_modulo.get("baldasVerticales", 0)

        # Baldas verticales
        if baldas_vert > 0:
            dims_bv = calcular_pieza_balda_vertical(
                altura_modulo=altura,
                profundidad_modulo=profundidad,
                grosor_tabla_trasera=grosor_tabla_trasera,
                grosor_tabla=grosor_tabla,
                diferencia_profundidad_balda_modulo=diferencia_profundidad_balda_modulo,
            )
            piezas.append(
                {
                    "pieza": "Balda vertical",
                    "unidades": baldas_vert,
                    **dims_bv,
                    "modulo": nombre,
                }
            )

        # Baldas horizontales por submódulo
        submodulos = balda_modulo.get("submodulos", [])
        posiciones = balda_modulo.get("posicionesVerticales", [])

        if baldas_vert == 0:
            # Sin baldas verticales: todas las horizontales tienen la misma anchura
            total_baldas_h = sum(s.get("baldasHorizontales", 0) for s in submodulos)
            if total_baldas_h > 0:
                dims_bh = calcular_pieza_balda_horizontal_sin_vertical(
                    anchura_modulo=anchura,
                    profundidad_modulo=profundidad,
                    grosor_tabla_trasera=grosor_tabla_trasera,
                    grosor_tabla=grosor_tabla,
                    diferencia_profundidad_balda_modulo=diferencia_profundidad_balda_modulo,
                )
                piezas.append(
                    {
                        "pieza": "Balda horizontal",
                        "unidades": total_baldas_h,
                        **dims_bh,
                        "modulo": nombre,
                    }
                )
        else:
            # Con baldas verticales: cada subsección puede tener distinta anchura
            total_subsecciones = baldas_vert + 1
            for idx_sub, sub in enumerate(submodulos):
                baldas_h = sub.get("baldasHorizontales", 0)
                if baldas_h == 0:
                    continue

                anchura_sub = calcular_anchura_subseccion(
                    indice_subseccion=idx_sub,
                    total_subsecciones=total_subsecciones,
                    anchura_modulo=anchura,
                    posiciones_verticales=posiciones,
                    grosor_tabla=grosor_tabla,
                )
                letra = chr(97 + idx_sub)  # a, b, c…
                nombre_seccion = f"{nombre}-{letra}"

                dims_bh = calcular_pieza_balda_horizontal_en_subseccion(
                    anchura_subseccion=anchura_sub,
                    profundidad_modulo=profundidad,
                    grosor_tabla_trasera=grosor_tabla_trasera,
                    grosor_tabla=grosor_tabla,
                    diferencia_profundidad_balda_modulo=diferencia_profundidad_balda_modulo,
                    diferencia_profundidad_balda_vertical_horizontal=diferencia_profundidad_balda_vertical_horizontal,
                )
                piezas.append(
                    {
                        "pieza": f"Balda horizontal (secc. {letra})",
                        "unidades": baldas_h,
                        **dims_bh,
                        "modulo": nombre_seccion,
                    }
                )

    # --- Puertas ---
    if puertas > 0:
        # La altura de las puertas coincide con la del primer módulo
        # (todos los módulos de una misma fila horizontal comparten altura)
        altura_puerta = modulos[0]["altura"] if modulos else 0
        dims_p = calcular_pieza_puerta(anchura_puerta, altura_puerta, grosor_tabla)
        piezas.append(
            {
                "pieza": "Puerta",
                "unidades": puertas,
                **dims_p,
                "modulo": "—",
            }
        )

    return piezas

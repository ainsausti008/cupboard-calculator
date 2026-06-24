import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .formulas import (
    calcular_anchura_estructura,
    calcular_altura_estructura,
    calcular_profundidad_estructura,
    calcular_opciones_modulos,
    sugerir_modulos_verticales,
    calcular_modulos_definidos,
    calcular_despiece,
)
from .schemas import (
    DimensionesEstructuraRequest,
    DimensionesEstructuraResponse,
    OpcionesModulosRequest,
    OpcionesModulosResponse,
    ModulosVerticalesRequest,
    ModulosVerticalesResponse,
    ModulosDefinidosRequest,
    ModulosDefinidosResponse,
    DespieceRequest,
    DespieceResponse,
)

app = FastAPI(title="Cupboard Calculator API", version="0.1.0")

allowed_origins = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:4200",
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
async def health_check():
    return {"status": "ok"}


@app.post(
    "/api/calcular-dimensiones-estructura",
    response_model=DimensionesEstructuraResponse,
)
async def calcular_dimensiones_estructura(
    datos: DimensionesEstructuraRequest,
) -> DimensionesEstructuraResponse:
    """Calcula las dimensiones de la estructura a partir de los parámetros globales."""
    return DimensionesEstructuraResponse(
        anchura_estructura=calcular_anchura_estructura(
            anchura_espacio=datos.anchura_espacio,
            distancia_esquina_con_pared=datos.distancia_esquina_con_pared,
            distancia_esquina_sin_pared=datos.distancia_esquina_sin_pared,
            pared_izquierda=datos.pared_izquierda,
            pared_derecha=datos.pared_derecha,
        ),
        altura_estructura=calcular_altura_estructura(
            altura_espacio=datos.altura_espacio,
            distancia_techo=datos.distancia_techo,
        ),
        profundidad_estructura=calcular_profundidad_estructura(
            profundidad_espacio=datos.profundidad_espacio,
            distancia_fondo=datos.distancia_fondo,
            grosor_puerta=datos.grosor_puerta,
        ),
    )


@app.post(
    "/api/calcular-opciones-modulos",
    response_model=OpcionesModulosResponse,
)
async def calcular_opciones_modulos_endpoint(
    datos: OpcionesModulosRequest,
) -> OpcionesModulosResponse:
    """Devuelve las opciones válidas de módulos horizontales."""
    opciones = calcular_opciones_modulos(
        anchura_estructura=datos.anchura_estructura,
        holgura_puerta_esquina=datos.holgura_puerta_esquina,
        holgura_puerta_contigua=datos.holgura_puerta_contigua,
        anchura_minima_puerta=datos.anchura_minima_puerta,
        anchura_maxima_puerta=datos.anchura_maxima_puerta,
    )
    return OpcionesModulosResponse(opciones=opciones)


@app.post(
    "/api/sugerir-modulos-verticales",
    response_model=ModulosVerticalesResponse,
)
async def sugerir_modulos_verticales_endpoint(
    datos: ModulosVerticalesRequest,
) -> ModulosVerticalesResponse:
    """Sugiere la cantidad de módulos en vertical según la altura de la estructura."""
    return ModulosVerticalesResponse(
        sugerencia=sugerir_modulos_verticales(datos.altura_estructura),
        opciones=[1, 2],
    )


@app.post(
    "/api/calcular-modulos-definidos",
    response_model=ModulosDefinidosResponse,
)
async def calcular_modulos_definidos_endpoint(
    datos: ModulosDefinidosRequest,
) -> ModulosDefinidosResponse:
    """Calcula las dimensiones de cada módulo según la selección realizada."""
    modulos = calcular_modulos_definidos(
        modulos_horizontales=datos.modulos_horizontales,
        puertas=datos.puertas,
        modulos_verticales=datos.modulos_verticales,
        anchura_estructura=datos.anchura_estructura,
        altura_estructura=datos.altura_estructura,
        profundidad_estructura=datos.profundidad_estructura,
        anchura_puerta=datos.anchura_puerta,
        holgura_puerta_esquina=datos.holgura_puerta_esquina,
        holgura_puerta_contigua=datos.holgura_puerta_contigua,
        altura_modulo1=datos.altura_modulo1,
        modulo_grande_izquierda=datos.modulo_grande_izquierda,
    )
    return ModulosDefinidosResponse(modulos=modulos)


@app.post(
    "/api/calcular-despiece",
    response_model=DespieceResponse,
)
async def calcular_despiece_endpoint(
    datos: DespieceRequest,
) -> DespieceResponse:
    """Calcula el despiece completo del armario: piezas estructurales,
    baldas y puertas con sus dimensiones."""
    piezas = calcular_despiece(
        modulos=[m.model_dump() for m in datos.modulos],
        baldas=[b.model_dump() for b in datos.baldas],
        grosor_tabla=datos.grosor_tabla,
        grosor_tabla_trasera=datos.grosor_tabla_trasera,
        diferencia_profundidad_balda_modulo=datos.diferencia_profundidad_balda_modulo,
        diferencia_profundidad_balda_vertical_horizontal=datos.diferencia_profundidad_balda_vertical_horizontal,
        puertas=datos.puertas,
        anchura_puerta=datos.anchura_puerta,
        altura_estructura=datos.altura_estructura,
    )
    return DespieceResponse(piezas=piezas)

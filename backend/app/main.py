from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .formulas import (
    calcular_anchura_estructura,
    calcular_altura_estructura,
    calcular_profundidad_estructura,
    calcular_opciones_modulos,
)
from .schemas import (
    DimensionesEstructuraRequest,
    DimensionesEstructuraResponse,
    OpcionesModulosRequest,
    OpcionesModulosResponse,
)

app = FastAPI(title="Cupboard Calculator API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
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
            distancia_esquina=datos.distancia_esquina,
            pared_izquierda=datos.pared_izquierda,
            pared_derecha=datos.pared_derecha,
        ),
        altura_estructura=calcular_altura_estructura(
            altura_espacio=datos.altura_espacio,
            distancia_techo=datos.distancia_techo,
            distancia_suelo=datos.distancia_suelo,
        ),
        profundidad_estructura=calcular_profundidad_estructura(
            profundidad_espacio=datos.profundidad_espacio,
            distancia_fondo=datos.distancia_fondo,
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

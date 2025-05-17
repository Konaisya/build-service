from fastapi import FastAPI
from fastapi.responses import FileResponse
from routers import routers
from starlette.middleware.cors import CORSMiddleware
app = FastAPI(title="Build-Service API")

app.include_router(routers)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get('/{image_name}')
async def get_image(image_name: str):
    return FileResponse(f'./images/{image_name}')
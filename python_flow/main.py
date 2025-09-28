from fastapi import FastAPI
from routes.index import router
from middlewares.authMiddleware import AuthMiddleware

app = FastAPI(title="AI Models For Training")

app.add_middleware(AuthMiddleware)

@app.on_event('startup')
def func():
    pass

@app.on_event('shutdown')
def func():
    pass

app.add_api_route("/apis/model", router)
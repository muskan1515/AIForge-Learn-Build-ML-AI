from fastapi import APIRouter
from models.index import RetrainModelParams

router = APIRouter(tags=['model apis'], prefix="/model")

@router.post("/re-train")
def func(params: RetrainModelParams):
    pass
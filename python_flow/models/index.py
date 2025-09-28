from pydantic import BaseModel

class RetrainModelParams(BaseModel):
    learning_rate: float
    dropout: float
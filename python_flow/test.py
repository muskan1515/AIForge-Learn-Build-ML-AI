from fastapi import FastAPI, BackgroundTasks
from pydantic import BaseModel
import tensorflow as tf
import numpy as np

app = FastAPI()

# Global model and params
model = None
current_params = {}

class HyperParams(BaseModel):
    learning_rate: float = 0.001
    dropout: float = 0.3
    regularization: float = 0.001

class PredictRequest(BaseModel):
    features: list

@app.on_event("startup")
def load_default_model():
    global model
    model = tf.keras.models.load_model("saved_model")

@app.post("/update-model")
def update_model(params: HyperParams, background_tasks: BackgroundTasks):
    """Rebuild or fine-tune model with new hyperparameters"""
    global model, current_params
    current_params = params.dict()

    def retrain():
        global model
        # rebuild or fine-tune
        new_model = tf.keras.Sequential([
            tf.keras.layers.Dense(64, activation='relu',
                                  kernel_regularizer=tf.keras.regularizers.l2(params.regularization)),
            tf.keras.layers.Dropout(params.dropout),
            tf.keras.layers.Dense(1)
        ])
        optimizer = tf.keras.optimizers.Adam(learning_rate=params.learning_rate)
        new_model.compile(optimizer=optimizer, loss='mse')
        # optionally fine-tune on saved data
        model = new_model
        model.save("saved_model")

    background_tasks.add_task(retrain)
    return {"message": "Model update triggered", "params": current_params}

@app.post("/predict")
def predict(req: PredictRequest):
    global model
    X = np.array(req.features).reshape(1, -1)
    preds = model.predict(X)
    return {"prediction": preds.tolist(), "params": current_params}

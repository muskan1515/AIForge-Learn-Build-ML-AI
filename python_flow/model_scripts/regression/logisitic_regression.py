import tensorflow as tf
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
import matplotlib.pyplot as plt
import os

##CONFIG DEFINATION###
config = {
    'CSV_PATH': '/content/sample_data/regression/logistic_regression/logistic_regression_500.csv',
    'SAVE_PATH': '/content/sample_data/regression/logistic_regression/',
    'TARGET_COL' : 'label'
}

df = pd.read_csv(config['CSV_PATH'])

# ====================================================
# 2️⃣ Data Cleaning & Preprocessing
# ====================================================

#drop duplicate
df = df.drop_duplicates()
print("✅ Removed duplicates")

# --- Handle missing values ---
# Fill numeric columns with mean, categorical with mode

for col in df.columns:
  if df[col].dtype in [np.float64, np.int64]:
    df[col].fillna(df[col].mean(), inplace=True)
  else:
    df[col].fillna(df[col].mode()[0], inplace=True)

X = df.drop(columns=['label'])
y = df[config['TARGET_COL']]

#feature scaling
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# ====================================================
# 3️⃣ Split Dataset
# ====================================================

X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)


# ====================================================
# 4️⃣ Build TensorFlow Linear Regression Model
# ====================================================
model = tf.keras.Sequential([
    tf.keras.layers.Input(shape=(X_train.shape[1],)),
    tf.keras.layers.Dense(64, activation='relu'),
    tf.keras.layers.Dense(32, activation='relu'),
    tf.keras.layers.Dense(1, kernel_regularizer=tf.keras.regularizers.l2(0.001), activation='sigmoid')
])

model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
    loss='binary_crossentropy',
    metrics=['accuracy']
)

# ====================================================
# 5️⃣ Train Model
# ====================================================
print("🚀 Training the model...")
earlyStopping = tf.keras.callbacks.EarlyStopping(monitor='val_loss', patience=10, restore_best_weights=True)
checkpoints = tf.keras.callbacks.ModelCheckpoint('best_logistic_model.keras', save_best_only=True)

history = model.fit(
    X_train, y_train,
    validation_data=(X_test, y_test),
    epochs=150,
    batch_size=1,
    callbacks=[earlyStopping, checkpoints],
    verbose=0
)
print("✅ Training complete.")

# ====================================================
# 6️⃣ Evaluate Model
# ====================================================
loss, accuracy = model.evaluate(X_test, y_test, verbose=0)
print(f"📊 Test Loss: {loss:.4f}, accuracy: {accuracy:.4f}")

# ====================================================
# 7️⃣ Save Artifacts
# ====================================================

os.makedirs(config['SAVE_PATH'], exist_ok=True)

model.save(os.path.join(config['SAVE_PATH'], "logistic_regression_model.keras"), save_format='keras')
np.save(os.path.join(config['SAVE_PATH'], "scaler_mean.npy"), scaler.mean_)
np.save(os.path.join(config['SAVE_PATH'], "scaler_scale.npy"), scaler.scale_)

df.to_csv(os.path.join(config['SAVE_PATH'], "cleaned_dataset.csv"), index=False)
print("💾 Model & preprocessing files saved successfully.")

# ====================================================
# 8️⃣ Optional Visualization (for single-feature case)
# ====================================================
if X.shape[1] == 1:
    plt.scatter(X.values, y, alpha=0.5, label="Data")
    plt.plot(
        X.values, model.predict(X_scaled),
        color="red", linewidth=2, label="Model Prediction"
    )
    plt.title("Logistic Regression Model Fit")
    plt.xlabel(X.columns[0])
    plt.ylabel(config['TARGET_COL'])
    plt.legend()
    plt.show()





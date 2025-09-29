import tensorflow as tf
import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
import matplotlib.pyplot as plt
import os
import joblib

## CONFIGURATION
config = {
    'CSV_PATH': '/content/sample_data/deep_learning/classification_dataset_10000_categorical.csv',
    'SAVE_PATH': '/content/sample_data/deep_learning/',
    'TARGET_COL': 'sentiment'
}

df = pd.read_csv(config['CSV_PATH'])

# ======================
# 1️⃣ Data Cleaning
# ======================
df = df.drop_duplicates()
print("✅ Removed duplicates")

for col in df.columns:
    if df[col].dtype in [np.float64, np.int64]:
        df[col].fillna(df[col].mean(), inplace=True)
    else:
        df[col].fillna(df[col].mode()[0], inplace=True)

X = df['sentiment']
y = df[config['TARGET_COL']]

# ======================
# 2️⃣ Label Encoding
# ======================
label_encoder = LabelEncoder()
y_encoded = label_encoder.fit_transform(y)
num_labels = len(np.unique(y_encoded))

# ======================
# 3️⃣ Train/Test Split
# ======================
X_train, X_test, y_train, y_test = train_test_split(X, y_encoded, test_size=0.2, random_state=42)

# ======================
# 4️⃣ Tokenization & Padding
# ======================
tokenizer = tf.keras.preprocessing.text.Tokenizer(num_words=10000)
tokenizer.fit_on_texts(X_train)

X_train_seq = tokenizer.texts_to_sequences(X_train)
X_test_seq = tokenizer.texts_to_sequences(X_test)

max_len = 100
X_train_pad = tf.keras.preprocessing.sequence.pad_sequences(X_train_seq, maxlen=max_len, padding='post', truncating='post')
X_test_pad = tf.keras.preprocessing.sequence.pad_sequences(X_test_seq, maxlen=max_len, padding='post', truncating='post')

# ======================
# 5️⃣ LSTM Model
# ======================
model = tf.keras.Sequential([
    tf.keras.layers.Embedding(input_dim=10000, output_dim=128, input_length=max_len),
    tf.keras.layers.LSTM(64, return_sequences=False),  # LSTM instead of SimpleRNN
    tf.keras.layers.Dense(64, activation='relu'),
    tf.keras.layers.Dense(num_labels, activation='softmax')
])

model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)

# ======================
# 6️⃣ Train
# ======================
earlyStopping = tf.keras.callbacks.EarlyStopping(monitor='val_loss', patience=10, restore_best_weights=True)
checkpoints = tf.keras.callbacks.ModelCheckpoint('best_LSTM_model.keras', save_best_only=True)

history = model.fit(
    X_train_pad, y_train,
    validation_data=(X_test_pad, y_test),
    epochs=50,
    batch_size=32,
    callbacks=[earlyStopping, checkpoints],
    verbose=1
)

# ======================
# 7️⃣ Evaluate
# ======================
loss, accuracy = model.evaluate(X_test_pad, y_test)
print(f"📊 Test Loss: {loss:.4f}, Accuracy: {accuracy:.4f}")

# ======================
# 8️⃣ Save Artifacts
# ======================
os.makedirs(config['SAVE_PATH'], exist_ok=True)

joblib.dump(label_encoder, os.path.join(config['SAVE_PATH'], "label_encoder.pkl"))
joblib.dump(tokenizer, os.path.join(config['SAVE_PATH'], "tokenizer.pkl"))
model.save(os.path.join(config['SAVE_PATH'], "LSTM_model.keras"), save_format='keras')

df.to_csv(os.path.join(config['SAVE_PATH'], "cleaned_dataset.csv"), index=False)
print("💾 Model & preprocessing files saved successfully.")

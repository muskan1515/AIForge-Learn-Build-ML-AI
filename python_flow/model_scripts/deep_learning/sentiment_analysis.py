import tensorflow as tf
import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
import matplotlib.pyplot as plt
import os
import joblib

##CONFIG DEFINATION###
config = {
    'CSV_PATH': '/content/sample_data/deep_learning/classification_dataset_10000_categorical.csv',
    'SAVE_PATH': '/content/sample_data/deep_learning/',
    'TARGET_COL' : 'sentiment'
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


##label encoding
label_encoder = LabelEncoder()
y_encoded = label_encoder.fit_transform(df[config['TARGET_COL']])
num_labels = len(np.unique(y_encoded))
# ====================================================
# 3️⃣ Split Dataset
# ====================================================

X_train, X_test, y_train, y_test = train_test_split(df['sentiment'], y_encoded, test_size=0.2, random_state=42)


# ====================================================
# 4️⃣.1 Vectorize the train and test data
# ====================================================
vectorizer = TfidfVectorizer()
X_train = vectorizer.fit_transform(X_train)
X_test = vectorizer.transform(X_test)

X_train = X_train.toarray()
X_test = X_test.toarray()
# ====================================================
# 4️⃣ Build TensorFlow Linear Regression Model
# ====================================================
model = tf.keras.Sequential([
    tf.keras.layers.Input(shape=(X_train.shape[1],)),
    tf.keras.layers.Dense(128, activation='relu'),
    tf.keras.layers.Dense(64, activation='relu'),
    tf.keras.layers.Dense(num_labels, kernel_regularizer=tf.keras.regularizers.l2(0.001), activation='softmax')
])

model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)

# ====================================================
# 5️⃣ Train Model
# ====================================================
print("🚀 Training the model...")
earlyStopping = tf.keras.callbacks.EarlyStopping(monitor='val_loss', patience=10, restore_best_weights=True)
checkpoints = tf.keras.callbacks.ModelCheckpoint('best_sentitment_classification_model.keras', save_best_only=True)

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

joblib.dump(label_encoder, (os.path.join(config['SAVE_PATH'], "label_encoder.pkl")))
joblib.dump(vectorizer, (os.path.join(config['SAVE_PATH'], "vectorizer.pkl")))

model.save(os.path.join(config['SAVE_PATH'], "sentiment_classification_model.keras"), save_format='keras')

df.to_csv(os.path.join(config['SAVE_PATH'], "cleaned_dataset.csv"), index=False)
print("💾 Model & preprocessing files saved successfully.")





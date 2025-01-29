import os
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, Dropout
from tensorflow.keras.optimizers import Adam

# Define paths to your dataset directories
train_dir = 'dataset/train'  # Modify with your actual train folder path
valid_dir = 'dataset/validation'  # Modify with your actual validation folder path

# Image settings
img_width, img_height = 400, 400  # Image size (400 x 400 for most models like ResNet50)
batch_size = 32
epochs = 50

# Data augmentation for training data (this is important for improving model generalization)
train_datagen = ImageDataGenerator(
    rescale=1.0/255.0,  # Normalize pixel values to [0,1]
    rotation_range=40,  # Randomly rotate images
    width_shift_range=0.2,  # Randomly shift images horizontally
    height_shift_range=0.2,  # Randomly shift images vertically
    shear_range=0.2,  # Shear images randomly
    zoom_range=0.2,  # Zoom images randomly
    horizontal_flip=True,  # Randomly flip images horizontally
    fill_mode='nearest'  # Fill empty pixels after transformation
)

# Only rescale the validation data (no augmentation)
valid_datagen = ImageDataGenerator(rescale=1.0/255.0)

# Flow from directories (for both training and validation)
train_generator = train_datagen.flow_from_directory(
    train_dir,
    target_size=(img_width, img_height),
    batch_size=batch_size,
    class_mode='categorical'  # Use categorical for multi-class classification
)

valid_generator = valid_datagen.flow_from_directory(
    valid_dir,
    target_size=(img_width, img_height),
    batch_size=batch_size,
    class_mode='categorical'
)

# Build the model (simple CNN architecture)
model = Sequential()

# First convolutional layer with 32 filters
model.add(Conv2D(32, (3, 3), activation='relu', input_shape=(img_width, img_height, 3)))
model.add(MaxPooling2D(pool_size=(2, 2)))

# Second convolutional layer with 64 filters
model.add(Conv2D(64, (3, 3), activation='relu'))
model.add(MaxPooling2D(pool_size=(2, 2)))

# Third convolutional layer with 128 filters
model.add(Conv2D(128, (3, 3), activation='relu'))
model.add(MaxPooling2D(pool_size=(2, 2)))

# Flatten layer to convert 2D outputs to 1D vector
model.add(Flatten())

# Fully connected layer with 128 neurons
model.add(Dense(128, activation='relu'))

# Dropout to prevent overfitting
model.add(Dropout(0.5))

# Output layer with softmax activation (2 classes: raspberrypi4, raspberrypi4charger)
model.add(Dense(2, activation='softmax'))

# Compile the model
model.compile(
    optimizer=Adam(learning_rate=0.0001),
    loss='categorical_crossentropy',  # For multi-class classification
    metrics=['accuracy']
)

# Train the model
history = model.fit(
    train_generator,
    steps_per_epoch=train_generator.samples // batch_size,
    epochs=epochs,
    validation_data=valid_generator,
    validation_steps=valid_generator.samples // batch_size
)

# Save the trained model
model.save('item_detection_model.h5')
print("Model saved as item_detection_model.h5")

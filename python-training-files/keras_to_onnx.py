import os
import tensorflow as tf
from tensorflow.keras.utils import register_keras_serializable # type: ignore
import tf2onnx

# Define custom function
@register_keras_serializable()
def _combine_streams(inputs):
    val, adv = inputs
    return val + (adv - tf.reduce_mean(adv, axis=1, keepdims=True))

# Paths
keras_path = "public/assets/mancala_agent_final.keras"
onnx_path = "public/assets/mancala_agent_final.onnx"

# Custom objects dictionary
custom_objects = {"_combine_streams": _combine_streams}

# Load Keras model
model = tf.keras.models.load_model(keras_path, custom_objects=custom_objects)
print("Keras model loaded")

# Convert directly to ONNX
try:
    # Convert the model
    os.makedirs(os.path.dirname(onnx_path), exist_ok=True)
    spec = (tf.TensorSpec((None, 15), tf.float32, name="input"),)
    output_path = onnx_path
    
    model_proto, _ = tf2onnx.convert.from_keras(
        model, 
        input_signature=spec,
        opset=13,
        output_path=output_path
    )
    
    print(f"ONNX model saved to {onnx_path}")
    print(f"ONNX model size: {os.path.getsize(onnx_path) / 1024 / 1024:.2f} MB")
    
except Exception as e:
    print(f"Error during conversion: {e}")
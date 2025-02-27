import tensorflow as tf
from DQNAgent import _combine_streams

# Load the .keras model with custom objects - i.e. the _combine_streams function
model = tf.keras.models.load_model(
    "./mancala_agent_final.keras",
    custom_objects={"_combine_streams": _combine_streams}
)

# Save it as an .h5 file
model.save('./model.h5', save_format='tf')

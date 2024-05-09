from flask import Flask, request, jsonify, render_template
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array, load_img
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
import numpy as np
from werkzeug.utils import secure_filename
import os

app = Flask(__name__)

# Define the upload folder where temporary images will be saved
app.config['UPLOAD_FOLDER'] = 'uploads'

# Ensure the upload folder exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Load the trained model
model = load_model('models/mymodel1.h5')

# Function to preprocess the uploaded image
def preprocess_image(image):
    img_array = img_to_array(image)
    img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension
    img_array = preprocess_input(img_array)  # Preprocess the image
    return img_array

@app.route('/404-page.html')
def page_404():
    return render_template('404-page.html')

@app.route('/coming-soon.html')
def coming_soon():
    return render_template('coming-soon.html')

@app.route('/faq.html')
def faq():
    return render_template('faq.html')

# Route for serving the index.html file
@app.route('/')
def index():
    return render_template('index.html')
    
@app.route('/index-fullscreen-countdown-video.html')
def fullscreen_countdown_video():
    return render_template('index-fullscreen-countdown-video.html')

@app.route('/privacy-policy.html')
def privacy_policy():
    return render_template('privacy-policy.html')

@app.route('/testimonials-2.html')
def testimonials_2():
    return render_template('testimonials-2.html')

@app.route('/testimonials.html')
def testimonials():
    return render_template('testimonials.html')

# Route for image classification
@app.route('/classify', methods=['POST'])
def classify_image():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400
    
    image = request.files['image']
    filename = secure_filename(image.filename)
    image_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    image.save(image_path)  # Save the uploaded image to a temporary location
    
    img = load_img(image_path, target_size=(256, 256))  # Load the image from the temporary location
    img_array = preprocess_image(img)
    
    # Perform classification
    prediction = model.predict(img_array)
    predicted_class = np.argmax(prediction, axis=1)[0]
    class_titles = ['freshapple', 'freshbananas', 'freshonions', 'freshoranges', 'freshpotatoes',
                    'freshtomatoes', 'rottenapples', 'rottenbananas', 'rottenonions',
                    'rottenoranges', 'rottenpotatoes', 'rottentomatoes']
    result = class_titles[predicted_class]
    
    # Delete the temporary image file
    os.remove(image_path)
    
    return jsonify({'result': result}), 200

if __name__ == '__main__':
    app.run(debug=True)

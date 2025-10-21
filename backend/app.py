import os
import uuid
from flask import Flask, render_template, request, jsonify
from werkzeug.utils import secure_filename

# Initialize the Flask application
app = Flask(__name__)

# Configuration
UPLOAD_FOLDER = os.path.join('static', 'uploads')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
# You might want to restrict extensions in a real application
# ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

# Ensure the upload folder exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

@app.route('/')
def index():
    """Renders the main HTML page."""
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_files():
    """Handles the file upload and saves the images."""
    if 'images' not in request.files:
        return jsonify({'error': 'No images part in the request'}), 400

    files = request.files.getlist('images')

    if not files or files[0].filename == '':
        return jsonify({'error': 'No selected files'}), 400

    # Create a unique subfolder for this upload session
    session_id = str(uuid.uuid4())
    session_folder = os.path.join(app.config['UPLOAD_FOLDER'], session_id)
    os.makedirs(session_folder)

    saved_files = []
    for file in files:
        if file:
            filename = secure_filename(file.filename)
            save_path = os.path.join(session_folder, filename)
            file.save(save_path)
            saved_files.append(filename)
    
    print(f"Saved {len(saved_files)} files to session folder: {session_folder}")

    # In the future, we will trigger the model processing here.
    # For now, we just confirm the upload was successful.

    return jsonify({
        'message': f'Successfully uploaded {len(saved_files)} files.',
        'session_id': session_id,
        'filenames': saved_files
    }), 200


if __name__ == '__main__':
    app.run(debug=True, port=5000)


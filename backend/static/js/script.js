document.addEventListener('DOMContentLoaded', () => {
    console.log("Frontend script loaded and ready!");

    const uploadForm = document.getElementById('upload-form');
    const fileInput = document.getElementById('file-input');
    const fileList = document.getElementById('file-list');
    const statusMessage = document.getElementById('status-message');
    const generateButton = uploadForm.querySelector('.generate-button');
    const buttonText = generateButton.querySelector('.btn-text');
    const spinner = generateButton.querySelector('.spinner');

    fileInput.addEventListener('change', () => {
        fileList.innerHTML = ''; // Clear previous file list
        statusMessage.innerHTML = '';
        statusMessage.className = 'status-message';

        if (fileInput.files.length > 0) {
            const fileNames = Array.from(fileInput.files).map(file => `<li>${file.name}</li>`).join('');
            fileList.innerHTML = `<ul>${fileNames}</ul>`;
        }
    });

    uploadForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent the default form submission

        if (fileInput.files.length === 0) {
            showStatus('Please select one or more images to upload.', 'error');
            return;
        }

        // --- Show loading state ---
        buttonText.textContent = 'Uploading...';
        spinner.classList.remove('hidden');
        generateButton.disabled = true;
        statusMessage.innerHTML = '';
        statusMessage.className = 'status-message';

        // --- Prepare and send data ---
        const formData = new FormData();
        for (const file of fileInput.files) {
            formData.append('images', file);
        }

        try {
            const response = await fetch('/upload', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (response.ok) {
                console.log('Success:', result);
                showStatus(result.message, 'success');
                // Here we will later trigger the 3D model loading
            } else {
                console.error('Error:', result);
                showStatus(`Error: ${result.error || 'Upload failed.'}`, 'error');
            }
        } catch (error) {
            console.error('Fetch Error:', error);
            showStatus('An unexpected error occurred. Check the console.', 'error');
        } finally {
            // --- Reset loading state ---
            buttonText.textContent = 'Generate 3D Model';
            spinner.classList.add('hidden');
            generateButton.disabled = false;
        }
    });

    function showStatus(message, type) {
        statusMessage.textContent = message;
        statusMessage.className = `status-message ${type}`;
    }
});


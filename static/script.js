// Handle file upload and display a success message
document.getElementById('upload-text-file').addEventListener('change', function() {
    const fileInput = document.getElementById('upload-text-file'); // Reference to the file input element
    const statusMessage = document.getElementById('status-message'); // Reference to the status message element

    if (fileInput.files.length > 0) {
        // If a file is selected, display a success message
        statusMessage.textContent = 'File uploaded successfully.';
        statusMessage.style.color = 'green';
    } else {
        // Clear the status message if no file is selected
        statusMessage.textContent = '';
    }
});

// Handle Tokenize button click
document.getElementById('tokenize-btn').addEventListener('click', function() {
    const inputText = document.getElementById('input-text').value; // Get text from the textarea
    const statusMessage = document.getElementById('status-message'); // Reference to the status message element
    
    if (!inputText && document.getElementById('upload-text-file').files.length === 0) {
        // If no text is entered and no file is uploaded, display an error message
        statusMessage.textContent = 'Please enter text or upload a file to tokenize.';
        statusMessage.style.color = 'red';
        return;
    }
    
    // If a file is uploaded, read its contents
    const fileInput = document.getElementById('upload-text-file');
    if (fileInput.files.length > 0) {
        const file = fileInput.files[0]; // Get the selected file
        const reader = new FileReader(); // Create a FileReader to read the file
        reader.onload = function(event) {
            const fileContent = event.target.result; // Get the file content
            tokenizeText(fileContent); // Call the function to tokenize the file content
            statusMessage.textContent = 'File tokenized successfully.';
            statusMessage.style.color = 'green';
        };
        reader.readAsText(file); // Read the file as text
    } else {
        // If no file is uploaded, tokenize the input text from the textarea
        tokenizeText(inputText);
        statusMessage.textContent = 'Text tokenized successfully.';
        statusMessage.style.color = 'green';
    }
});

// Function to send text for tokenization to the Flask backend
function tokenizeText(text) {
    fetch('/tokenize', {
        method: 'POST', // Use POST method to send data
        headers: {
            'Content-Type': 'application/json', // Set content type to JSON
        },
        body: JSON.stringify({ text: text }), // Send text as JSON
    })
    .then(response => response.json()) // Parse the JSON response
    .then(data => {
        // Display the tokenization results in the output section
        document.getElementById('output-text').value = 
            `Tokens: ${data.num_tokens}\n` +
            `Characters: ${data.num_chars}\n` +
            `Tokenized Text: ${data.tokenized_text}`;
    })
    .catch(error => {
        // Display an error message if tokenization fails
        const statusMessage = document.getElementById('status-message');
        statusMessage.textContent = 'An error occurred during tokenization.';
        statusMessage.style.color = 'red';
    });
}

// Handle the 'Remove File' button click to clear the uploaded text file
document.getElementById('remove-file-btn').addEventListener('click', function() {
    const fileInput = document.getElementById('upload-text-file'); // Reference to the file input element
    const statusMessage = document.getElementById('status-message'); // Reference to the status message element

    if (fileInput.value !== '') {
        // If a file is uploaded, clear the file input
        fileInput.value = '';
        statusMessage.textContent = 'File removed.';
        statusMessage.style.color = 'blue';
    } else {
        // Display an error message if no file is available to remove
        statusMessage.textContent = 'No file to remove.';
        statusMessage.style.color = 'red';
    }
});

// Handle Help button click to show the help modal
document.getElementById('help-btn').addEventListener('click', function() {
    document.getElementById('help-modal').style.display = 'block'; // Show the help modal
});

// Handle the close button click to hide the help modal
document.querySelector('.close-btn').addEventListener('click', function() {
    document.getElementById('help-modal').style.display = 'none'; // Hide the help modal
});

// Handle clicks outside of the modal to close it
window.addEventListener('click', function(event) {
    if (event.target == document.getElementById('help-modal')) {
        document.getElementById('help-modal').style.display = 'none'; // Hide the modal if clicked outside
    }
});

// Handle the Download button click to download the tokenized text as a file
document.getElementById('download-btn').addEventListener('click', function() {
    const outputText = document.getElementById('output-text').value; // Get the tokenized text
    if (!outputText) {
        // Display an error message if no tokenized text is available
        const statusMessage = document.getElementById('status-message');
        statusMessage.textContent = 'No tokenized text available to download.';
        statusMessage.style.color = 'red';
        return;
    }

    // Create a Blob with the output text
    const blob = new Blob([outputText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob); // Create a URL for the Blob

    // Create a temporary link element to trigger the download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tokenized_text.txt'; // Name of the downloaded file
    document.body.appendChild(a);
    a.click(); // Trigger the download
    document.body.removeChild(a); // Remove the temporary link
    URL.revokeObjectURL(url); // Clean up the URL

    // Display a success message after downloading
    const statusMessage = document.getElementById('status-message');   
    statusMessage.textContent = 'Tokenized text downloaded successfully.';
    statusMessage.style.color = 'green';
});

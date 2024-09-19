// Handle file upload and display success message
document.getElementById('upload-text-file').addEventListener('change', function() {
    const fileInput = document.getElementById('upload-text-file');
    const statusMessage = document.getElementById('status-message');

    if (fileInput.files.length > 0) {
        // Display the file name and success message
        statusMessage.textContent = `File "${fileInput.files[0].name}" uploaded successfully.`;
        statusMessage.style.color = "green";
    } else {
        statusMessage.textContent = "";
    }
});

// Handle the 'Tokenize' button click
document.getElementById('tokenize-btn').addEventListener('click', function() {
    const inputText = document.getElementById('input-text').value;
    const statusMessage = document.getElementById('status-message');
    
    if (!inputText && document.getElementById('upload-text-file').files.length === 0) {
        statusMessage.textContent = "Please enter text or upload a file to tokenize.";
        statusMessage.style.color = "red";
        return;
    }
    
    // If a text file is uploaded, use its contents
    const fileInput = document.getElementById('upload-text-file');
    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const reader = new FileReader();
        reader.onload = function(event) {
            const fileContent = event.target.result;
            tokenizeText(fileContent);
            statusMessage.textContent = "File tokenized successfully.";
            statusMessage.style.color = "green";
        };
        reader.readAsText(file);
    } else {
        // If no file is uploaded, tokenize the input text from the textarea
        tokenizeText(inputText);
        statusMessage.textContent = "Text tokenized successfully.";
        statusMessage.style.color = "green";
    }
});

// Function to send text for tokenization to the Flask backend
function tokenizeText(text) {
    fetch('/tokenize', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: text }),
    })
    .then(response => response.json())
    .then(data => {
        // Display the tokenization results in the output section
        document.getElementById('output-text').value = 
            `Tokens: ${data.num_tokens}\n` +
            `Characters: ${data.num_chars}\n` +
            `Tokenized Text: ${data.tokenized_text}`;
    })
    .catch(error => {
        const statusMessage = document.getElementById('status-message');
        statusMessage.textContent = "An error occurred during tokenization.";
        statusMessage.style.color = "red";
    });
}

// Handle the 'Remove File' button click to clear the uploaded text file
document.getElementById('remove-file-btn').addEventListener('click', function() {
    const fileInput = document.getElementById('upload-text-file');
    const statusMessage = document.getElementById('status-message');

    if (fileInput.value !== '') {
        fileInput.value = '';  // Clear the file input
        statusMessage.textContent = "File removed.";
        statusMessage.style.color = "blue";
    } else {
        statusMessage.textContent = "No file to remove.";
        statusMessage.style.color = "red";
    }
});

// Handle the 'Download' button click to download the tokenized text as a file
document.getElementById('download-btn').addEventListener('click', function() {
    const outputText = document.getElementById('output-text').value;
    if (!outputText) {
        const statusMessage = document.getElementById('status-message');
        statusMessage.textContent = "No tokenized text available to download.";
        statusMessage.style.color = "red";
        return;
    }

    // Create a Blob with the output text
    const blob = new Blob([outputText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    // Create a temporary link element to trigger the download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tokenized_text.txt';  // Name of the downloaded file
    document.body.appendChild(a);
    a.click();  // Trigger the download
    document.body.removeChild(a);  // Remove the temporary link
    URL.revokeObjectURL(url);  // Clean up the URL

    const statusMessage = document.getElementById('status-message');
    statusMessage.textContent = "Tokenized text downloaded successfully.";
    statusMessage.style.color = "green";
});

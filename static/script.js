// Handle file upload and display a success message
document.getElementById('upload-text-file').addEventListener('change', function () {
    const fileInput = document.getElementById('upload-text-file');
    const statusMessage = document.getElementById('status-message');

    if (fileInput.files.length > 0) {
        statusMessage.textContent = 'File uploaded successfully.';
        statusMessage.style.color = 'green';
    } else {
        statusMessage.textContent = '';
    }
});

// Handle Tokenize button click
document.getElementById('tokenize-btn').addEventListener('click', function () {
    const inputText = document.getElementById('input-text').value;
    const statusMessage = document.getElementById('status-message');

    if (!inputText && document.getElementById('upload-text-file').files.length === 0) {
        statusMessage.textContent = 'Please enter text or upload a file to tokenize.';
        statusMessage.style.color = 'red';
        return;
    }

    const fileInput = document.getElementById('upload-text-file');
    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const reader = new FileReader();
        reader.onload = function (event) {
            const fileContent = event.target.result;
            tokenizeText(fileContent);
        };
        reader.readAsText(file);
    } else {
        tokenizeText(inputText);
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
            // Combine all results into the output box
            const output = `
Tokens: ${data.num_tokens}
Characters: ${data.num_chars}
Avg tokens per word: ${data.avg_tokens_per_word}
Unique tokens: ${data.num_unique_tokens}
Tokenized Text: ${data.tokenized_text}
`;
            document.getElementById('output-text').value = output;
        })
        .catch(error => {
            const statusMessage = document.getElementById('status-message');
            statusMessage.textContent = 'An error occurred during tokenization.';
            statusMessage.style.color = 'red';
        });
}

// Download the content of the output box
document.getElementById('download-btn').addEventListener('click', function () {
    const outputText = document.getElementById('output-text').value;

    if (outputText) {
        const blob = new Blob([outputText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'tokenization_output.txt';
        a.click();
        URL.revokeObjectURL(url);  // Clean up the URL
    } else {
        const statusMessage = document.getElementById('status-message');
        statusMessage.textContent = 'No output available for download.';
        statusMessage.style.color = 'red';
    }
});

// Handle the 'Remove File' button click to clear the uploaded text file
document.getElementById('remove-file-btn').addEventListener('click', function () {
    const fileInput = document.getElementById('upload-text-file');
    const statusMessage = document.getElementById('status-message');

    if (fileInput.value !== '') {
        fileInput.value = '';
        statusMessage.textContent = 'File removed.';
        statusMessage.style.color = 'blue';
    } else {
        statusMessage.textContent = 'No file to remove.';
        statusMessage.style.color = 'red';
    }
});

// Handle Help button click to show the help modal
document.getElementById('help-btn').addEventListener('click', function () {
    document.getElementById('help-modal').style.display = 'block';
});

// Handle the close button click to hide the help modal
document.querySelector('.close-btn').addEventListener('click', function () {
    document.getElementById('help-modal').style.display = 'none';
});

// Handle clicks outside of the modal to close it
window.addEventListener('click', function (event) {
    if (event.target == document.getElementById('help-modal')) {
        document.getElementById('help-modal').style.display = 'none';
    }
});

// Handle the change of tokenizer option (Default, Train, Saved)
document.querySelectorAll('input[name="tokenizer"]').forEach(radio => {
    radio.addEventListener('change', function() {
        const selected = this.value;
        const optionsSection = document.getElementById('options');
        const mainInterface = document.getElementById('main-interface');
        const trainingInterface = document.getElementById('training-interface');
        
        if (selected === 'train') {
            optionsSection.style.display = 'none';  // Hide the options section
            mainInterface.style.display = 'none';   // Hide the main interface
            trainingInterface.style.display = 'block';  // Show the training interface
        } else {
            optionsSection.style.display = 'block'; // Show the options section
            mainInterface.style.display = 'block';  // Show the main interface
            trainingInterface.style.display = 'none';  // Hide the training interface
        }
    });
});

// Handle the 'Back' button click to return to the main interface
document.getElementById('back-btn').addEventListener('click', function() {
    const optionsSection = document.getElementById('options');
    const mainInterface = document.getElementById('main-interface');
    const trainingInterface = document.getElementById('training-interface');

    trainingInterface.style.display = 'none';  // Hide the training interface
    optionsSection.style.display = 'block';    // Show the options section
    mainInterface.style.display = 'block';     // Show the main interface
    document.querySelector('input[name="tokenizer"][value="default"]').checked = true; // Set "Default" radio button as selected
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
    fileInput.value = '';  // Clear the file input
    const statusMessage = document.getElementById('status-message');
    statusMessage.textContent = "File removed.";
    statusMessage.style.color = "blue";
});

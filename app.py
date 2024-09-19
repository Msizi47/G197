from flask import Flask, render_template, request, jsonify
import tiktoken

# Create a new Flask application instance
app = Flask(__name__)

# Initialize the tokenizer with a specific encoding
# "cl100k_base" is an example encoding; you should use an encoding that matches your model's requirements
enc = tiktoken.get_encoding("cl100k_base")

# Define the route for the home page
@app.route('/')
def index():
    # Render and return the 'index.html' template
    return render_template('index.html')

# Define the route for the tokenization process
@app.route('/tokenize', methods=['POST'])
def tokenize():
    # Get the input text from the JSON request body
    text = request.json.get('text', '')  # Default to an empty string if 'text' is not found

    # Tokenize the input text using the initialized tokenizer
    tokens = enc.encode(text)  # Convert the text into tokens
    num_tokens = len(tokens)  # Count the number of tokens
    num_chars = len(text)  # Count the number of characters in the input text
    tokenized_text = enc.decode(tokens)  # Convert tokens back to text

    # Return the tokenization results as a JSON response
    return jsonify({
        'num_tokens': num_tokens,  # Number of tokens in the text
        'num_chars': num_chars,    # Number of characters in the original text
        'tokenized_text': tokenized_text  # The tokenized text
    })

# Ensure this script runs only if it's executed directly
if __name__ == '__main__':
    # Run the Flask application in debug mode
    app.run(debug=True)

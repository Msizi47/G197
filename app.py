from flask import Flask, render_template, request, jsonify
import tiktoken
from collections import Counter

# Create a Flask application instance
app = Flask(__name__)

# Initialize the tokenizer with the specified encoding
enc = tiktoken.get_encoding("cl100k_base")

@app.route('/')
def index():
    # Render the main index page
    return render_template('index.html')

@app.route('/tokenize', methods=['POST'])
def tokenize():
    # Get the text input from the request
    text = request.json.get('text', '')
    
    # Tokenization process: encode the text into tokens
    tokens = enc.encode(text)
    num_tokens = len(tokens)  # Count the number of tokens
    num_chars = len(text)     # Count the number of characters
    
    # Calculate additional statistics
    words = text.split()  # Split text into words
    avg_tokens_per_word = num_tokens / len(words) if len(words) > 0 else 0  # Average tokens per word
    unique_tokens = len(set(tokens))  # Count unique tokens
    
    # Decode the tokens back into text for output
    tokenized_text = enc.decode(tokens)

    # Return a JSON response with tokenization results
    return jsonify({
        'num_tokens': num_tokens,
        'num_chars': num_chars,
        'avg_tokens_per_word': avg_tokens_per_word,
        'num_unique_tokens': unique_tokens,
        'tokenized_text': tokenized_text
    })

if __name__ == '__main__':
    # Run the Flask app in debug mode
    app.run(debug=True)

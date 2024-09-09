from flask import Flask, render_template, request, jsonify
import tiktoken

app = Flask(__name__)

# Initialize the tokenizer using an available encoding
enc = tiktoken.get_encoding("cl100k_base")

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/tokenize', methods=['POST'])
def tokenize():
    text = request.json.get('text', '')
    
    # Tokenize the input text
    tokens = enc.encode(text)
    num_tokens = len(tokens)
    num_chars = len(text)
    tokenized_text = enc.decode(tokens)

    return jsonify({
        'num_tokens': num_tokens,
        'num_chars': num_chars,
        'tokenized_text': tokenized_text
    })

if __name__ == '__main__':
    app.run(debug=True)

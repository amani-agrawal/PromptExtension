from flask import Flask, request, jsonify,  make_response
from flask_cors import CORS
from transformers import T5ForConditionalGeneration, AutoTokenizer


app = Flask(__name__)
CORS(app)

# Load model and tokenizer (once at startup)
MODEL_NAME = "amani-agrawal/prompt-pilot-model"
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = T5ForConditionalGeneration.from_pretrained(MODEL_NAME)

@app.route("/generate", methods=["POST", "OPTIONS"])
def generate():
    if request.method == 'OPTIONS':
        return make_response('', 200)
    data = request.get_json()
    prompt = data.get("prompt")
    if not prompt:
        return jsonify({"error": "Prompt is required"}), 400
    inputs = tokenizer(prompt, return_tensors="pt")
    output_ids = model.generate(**inputs, max_length=2000)
    output_text = tokenizer.decode(output_ids[0], skip_special_tokens=True)
    return jsonify({"output": output_text})

if __name__ == "__main__":
    app.run(port=5001)

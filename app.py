from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import T5Tokenizer, T5ForConditionalGeneration


app = Flask(__name__)
CORS(app)

MODEL_NAME = "amani-agrawal/prompt-pilot-model"
tokenizer = T5Tokenizer.from_pretrained(MODEL_NAME)
model = T5ForConditionalGeneration.from_pretrained(MODEL_NAME)

@app.route("/generate", methods=["POST"])
def generate():
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

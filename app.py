from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import AutoTokenizer
from transformers import T5Tokenizer, T5ForConditionalGeneration, TrainingArguments, Trainer


app = Flask(__name__)
CORS(app, origins="chrome-extension://lidnoefjhhhejpekmjkhpgncdpmhnbjd")

# Load model and tokenizer (once at startup)
MODEL_PATH = "./prompt-pilot-model"
model = T5ForConditionalGeneration.from_pretrained("./prompt-pilot-model")
tokenizer = T5Tokenizer.from_pretrained("./prompt-pilot-model")

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

@app.after_request
def after_request(response):
    response.headers["Access-Control-Allow-Origin"] = "chrome-extension://lidnoefjhhhejpekmjkhpgncdpmhnbjd"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    response.headers["Access-Control-Allow-Methods"] = "POST, OPTIONS"
    return response

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)

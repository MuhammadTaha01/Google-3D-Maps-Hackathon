# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import google.generativeai as genai

# # Initialize the Flask app
# app = Flask(__name__)

# # Enable CORS for the app (to allow cross-origin requests from frontend)
# CORS(app, resources={r"/ask-chatbot": {"origins": "*"}})  # Enable CORS for specific route

# # Configure Google Gemini API with your API key
# genai.configure(api_key="AIzaSyDz8b9DJWRskmsMIIt3Bb6UvceTX3FgUEk")
# model = genai.GenerativeModel("gemini-1.5-flash")

# # Route to handle requests from the frontend (chatbot)
# @app.route("/ask-chatbot", methods=["POST", "OPTIONS"])
# def ask_chatbot():
#     if request.method == "OPTIONS":  # Handle OPTIONS request for CORS
#         return "", 200  # No content, just a 200 response

#     user_input = request.json.get("question")  # Get the question from the frontend
#     if not user_input:
#         return jsonify({"error": "No question provided"}), 400

#     # Generate a response using Google Gemini API
#     response = model.generate_content(user_input)
#     return jsonify({"answer": response.text})  # Send the generated answer back to the frontend

# if __name__ == "__main__":
#     app.run(debug=True)  # Ensure the app runs on http://127.0.0.1:5000

import os
from huggingface_hub import InferenceClient

from dotenv import load_dotenv
load_dotenv()

# Get token from environment variable or replace with your actual token
# To get a token: https://huggingface.co/settings/tokens
API_TOKEN = os.getenv("HUGGINGFACE_TOKEN")

if API_TOKEN == "YOUR_HUGGING_FACE_TOKEN":
    print("WARNING: Please set your Hugging Face API token!")
    print("   1. Get a token from: https://huggingface.co/settings/tokens")
    print("   2. Either:")
    print("      - Set environment variable: $env:HUGGINGFACE_TOKEN='your_token_here'")
    print("      - Or replace 'YOUR_HUGGING_FACE_TOKEN' in the code with your actual token")
    exit(1)

# Initialize the Inference Client
client = InferenceClient(api_key=API_TOKEN)

print("Generating image...")
print("Model: black-forest-labs/FLUX.1-schnell (fast generation)")
print("Prompt: Astronaut riding a horse in space")
print()

try:
    # Generate image using text-to-image
    image = client.text_to_image(
        prompt="Pytramids in space",
        model="black-forest-labs/FLUX.1-schnell"  # Fast model, you can also try FLUX.1-dev for higher quality
    )
    
    # Save the generated image
    image.save("api_image.png")
    print("Image saved successfully as 'api_image.png'!")
    print(f"   Image size: {image.size}")
    print(f"   Image mode: {image.mode}")
    
except Exception as e:
    print(f"Error generating image: {e}")
    print()
    print("Troubleshooting tips:")
    print("   - Make sure your API token is valid")
    print("   - Check your internet connection")
    print("   - The model might be loading (wait 20-30 seconds and try again)")
    print("   - Try a different model like 'stabilityai/stable-diffusion-3.5-large'")
    exit(1)
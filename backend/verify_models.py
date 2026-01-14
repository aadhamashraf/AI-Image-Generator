import json
import os
import concurrent.futures
from concurrent.futures import ThreadPoolExecutor, as_completed
from huggingface_hub import InferenceClient

from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Load models
try:
    with open("models.json", "r") as f:
        models = json.load(f)
except Exception as e:
    print(f"Error loading models.json: {e}")
    exit(1)

API_TOKEN = os.getenv("HUGGINGFACE_TOKEN")
if not API_TOKEN:
    print("Error: HUGGINGFACE_TOKEN not found in environment variables.")
    exit(1)

client = InferenceClient(api_key=API_TOKEN)

def check_model(model):
    model_id = model["id"]
    print(f"Checking {model['name']} ({model_id})...")
    
    try:
        # Pinging the model status directly using get_model_status if available or just a lightweight call
        try:
             # Try a minimal text-to-image to see if it routes correctly
             client.text_to_image("test", model=model_id, width=64, height=64)
             return {"id": model_id, "status": "active", "message": "OK"}
        except Exception as e:
             error_str = str(e)
             if "422 Unprocessable Entity" in error_str:
                 return {"id": model_id, "status": "error", "message": f"{error_str[:300]}"}
             if "503" in error_str or "Model is loading" in error_str:
                 return {"id": model_id, "status": "active", "message": "Model loading"}
             return {"id": model_id, "status": "error", "message": str(e)[:100]}
             
    except Exception as e:
        return {"id": model_id, "status": "error", "message": str(e)}

print(f"Found {len(models)} models. Starting verification...")

results = []
# Run in parallel to speed up
with ThreadPoolExecutor(max_workers=5) as executor:
    future_to_model = {executor.submit(check_model, model): model for model in models}
    for future in as_completed(future_to_model):
        model = future_to_model[future]
        try:
            result = future.result()
            results.append(result)
            status_icon = "[OK]" if result["status"] == "active" else "[LOAD]" if result["status"] == "loading" else "[FAIL]"
            print(f"{status_icon} {model['name']}: {result['status']} - {result['message']}")
        except Exception as exc:
            print(f"[FAIL] {model['name']} generated an exception: {exc}")

# Summary
active_count = sum(1 for r in results if r["status"] == "active")
loading_count = sum(1 for r in results if r["status"] == "loading")
error_count = sum(1 for r in results if r["status"] == "error")

summary = {
    "total": len(models),
    "active": active_count,
    "loading": loading_count,
    "error": error_count,
    "details": results
}

# Write results to file
with open("model_verification_results.json", "w") as f:
    json.dump(summary, f, indent=4)

print(f"\nVerification Complete.")
print(f"Active: {active_count}")
print(f"Loading: {loading_count}")
print(f"Error: {error_count}")
print(f"Results saved to model_verification_results.json")

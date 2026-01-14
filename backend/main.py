from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field
from huggingface_hub import InferenceClient
from typing import Optional, List, Dict
import os
import uuid
import json
from datetime import datetime
from pathlib import Path

from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(
    title="AI Image Generation API",
    description="Professional API for generating images using verified AI models from Hugging Face",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create directories
GENERATED_IMAGES_DIR = Path("generated_images")
GENERATED_IMAGES_DIR.mkdir(exist_ok=True)

# Mount static files
app.mount("/images", StaticFiles(directory="generated_images"), name="images")

# Get API token - FORCE load from env
API_TOKEN = os.getenv("HUGGINGFACE_TOKEN")
if not API_TOKEN:
    print("Error: HUGGINGFACE_TOKEN not found in environment variables or .env file.")
    # We do NOT fallback to hardcoded token
    pass

# Initialize Hugging Face client
client = InferenceClient(api_key=API_TOKEN)

# Comprehensive model database with 50+ models

# Load models from JSON file
def load_models():
    try:
        # Get the directory where main.py is located
        current_dir = os.path.dirname(os.path.abspath(__file__))
        models_path = os.path.join(current_dir, "models.json")
        with open(models_path, "r") as f:
            return json.load(f)
    except FileNotFoundError:
        print("Error: models.json not found")
        return []
    except json.JSONDecodeError:
        print("Error: models.json is invalid")
        return []


MODELS_DATABASE = load_models()
print(f"Backend initialized with {len(MODELS_DATABASE)} models from models.json")


# Pydantic models
class ImageGenerationRequest(BaseModel):
    prompt: str = Field(..., description="Text prompt for image generation", min_length=1, max_length=1000)
    model: str = Field(default="black-forest-labs/FLUX.1-schnell", description="Model ID to use")
    width: Optional[int] = Field(default=512, ge=128, le=2048, description="Image width")
    height: Optional[int] = Field(default=512, ge=128, le=2048, description="Image height")
    num_inference_steps: Optional[int] = Field(default=None, ge=1, le=100, description="Number of denoising steps")
    guidance_scale: Optional[float] = Field(default=None, ge=1.0, le=20.0, description="Guidance scale for generation")
    negative_prompt: Optional[str] = Field(default=None, description="Negative prompt to avoid certain features")
    seed: Optional[int] = Field(default=None, description="Random seed for reproducibility")

class ImageGenerationResponse(BaseModel):
    success: bool
    image_url: str
    filename: str
    prompt: str
    model: str
    config: Dict
    timestamp: str

class ModelInfo(BaseModel):
    id: str
    name: str
    provider: str
    speed: str
    quality: str
    style: str
    description: str
    supports_config: bool

# API Endpoints
@app.get("/")
async def root():
    return {
        "message": "AI Image Generation API",
        "version": "1.0.0",
        "total_models": len(MODELS_DATABASE),
        "docs": "/docs"
    }

@app.get("/api/models", response_model=List[ModelInfo])
async def get_models():
    """Get list of all available models with metadata"""
    print(f"API Request: /api/models - Returning {len(MODELS_DATABASE)} models")
    return MODELS_DATABASE

@app.post("/api/generate", response_model=ImageGenerationResponse)
async def generate_image(request: ImageGenerationRequest):
    """Generate an image using the specified model and parameters"""
    
    try:
        # Validate model exists
        model_exists = any(m["id"] == request.model for m in MODELS_DATABASE)
        if not model_exists:
            print(f"Warning: Requested model '{request.model}' not in database.")

        print(f"Generating image with model: {request.model}")
        print(f"Prompt: {request.prompt}")
        print(f"Config: {request.width}x{request.height}")
        
        # Build generation parameters
        generation_params = {
            "prompt": request.prompt,
            "model": request.model,
            "width": request.width,
            "height": request.height,
        }
        
        if request.num_inference_steps:
            generation_params["num_inference_steps"] = request.num_inference_steps
        if request.guidance_scale:
            generation_params["guidance_scale"] = request.guidance_scale
        if request.negative_prompt:
            generation_params["negative_prompt"] = request.negative_prompt
        if request.seed:
            generation_params["seed"] = request.seed
        
        # Generate image
        try:
            image = client.text_to_image(**generation_params)
        except Exception as e:
            print(f"First attempt failed: {repr(e)}")
            
            if isinstance(e, StopIteration):
                raise HTTPException(status_code=503, detail=f"Model '{request.model}' is currently not available via the inference API. Please try a different model.")

            print(f"Retrying with basic parameters...")
            try:
                image = client.text_to_image(
                    prompt=request.prompt,
                    model=request.model
                )
            except Exception as retry_e:
                print(f"Retry failed: {repr(retry_e)}")
                if isinstance(retry_e, StopIteration):
                     raise HTTPException(status_code=503, detail=f"Model '{request.model}' is currently not available via the inference API.")
                raise retry_e
        
        # Generate unique filename
        filename = f"{uuid.uuid4()}.png"
        filepath = GENERATED_IMAGES_DIR / filename
        
        # Save image
        image.save(filepath)
        
        # Prepare response
        response = ImageGenerationResponse(
            success=True,
            image_url=f"/images/{filename}",
            filename=filename,
            prompt=request.prompt,
            model=request.model,
            config={
                "width": request.width,
                "height": request.height,
                "steps": request.num_inference_steps,
                "guidance_scale": request.guidance_scale,
                "negative_prompt": request.negative_prompt,
                "seed": request.seed,
            },
            timestamp=datetime.utcnow().isoformat()
        )
        
        print(f"Image generated successfully: {filename}")
        
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error generating image: {repr(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error generating image: {str(e) or repr(e)}")

@app.get("/api/history")
async def get_history():
    """Get list of all generated images"""
    
    images = []
    for img_file in GENERATED_IMAGES_DIR.glob("*.png"):
        images.append({
            "filename": img_file.name,
            "image_url": f"/images/{img_file.name}",
            "created_at": datetime.fromtimestamp(img_file.stat().st_mtime).isoformat()
        })
    
    # Sort by creation time, newest first
    images.sort(key=lambda x: x["created_at"], reverse=True)
    
    return {"images": images, "total": len(images)}

@app.get("/api/stats")
async def get_stats():
    """Get API statistics"""
    
    total_images = len(list(GENERATED_IMAGES_DIR.glob("*.png")))
    
    return {
        "total_models": len(MODELS_DATABASE),
        "total_images_generated": total_images,
        "api_version": "1.0.0",
        "models_by_style": {
            "general": len([m for m in MODELS_DATABASE if m.get("style") == "general"]),
            "photorealistic": len([m for m in MODELS_DATABASE if m.get("style") == "photorealistic"]),
            "anime": len([m for m in MODELS_DATABASE if m.get("style") == "anime"]),
            "artistic": len([m for m in MODELS_DATABASE if m.get("style") == "artistic"]),
            "fantasy": len([m for m in MODELS_DATABASE if m.get("style") == "fantasy"]),
            "sci-fi": len([m for m in MODELS_DATABASE if m.get("style") == "sci-fi"]),
            "3d": len([m for m in MODELS_DATABASE if m.get("style") == "3d"]),
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

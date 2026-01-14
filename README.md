# AI Image Generator

A professional full-stack web application for AI-powered image generation featuring verified state-of-the-art models from Hugging Face with advanced configuration options.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109.0-green)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Models](https://img.shields.io/badge/AI%20Models-Verified-purple)

## Features

### Verified AI Models
- **FLUX Series**: FLUX.1-schnell, FLUX.1-dev (Black Forest Labs)
- **Stable Diffusion XL**: Base 1.0 (Stability AI)
- Dynamically validated availability to ensure reliability.

### Advanced Configuration
- **Image Dimensions**: Width & Height (128px - 2048px)
- **Inference Steps**: Control quality vs speed (1-100 steps)
- **Guidance Scale**: Prompt adherence control (1.0-20.0)
- **Negative Prompts**: Specify what to avoid
- **Seed Control**: Reproducible generations with random seed option

### Premium UI/UX
- **Glassmorphism Design**: Modern, elegant glass card effects
- **Dark Theme**: Easy on the eyes with vibrant accent colors
- **Smooth Animations**: Micro-interactions and transitions
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile
- **Real-time Feedback**: Loading states and progress indicators

### Image Management
- **Gallery View**: Grid layout with hover effects
- **Image Preview**: Full-screen modal with metadata
- **Download**: Save generated images locally
- **History**: View all previously generated images
- **Metadata Display**: Prompt, model, and configuration details

### Prompt Suggestions
- **Example Prompts** across multiple categories
- **One-click Copy**: Click any prompt to copy to clipboard

## Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- Hugging Face API Token ([Get one here](https://huggingface.co/settings/tokens))

### 1. Set Up Environment

1.  Create a `.env` file in the root directory (Project_5).
2.  Add your Hugging Face API token:

```
HUGGINGFACE_TOKEN=hf_your_token_here
```

### 2. Install Backend Dependencies

```powershell
cd backend
pip install -r requirements.txt
```

### 3. Install Frontend Dependencies

```powershell
cd frontend
npm install
```

### 4. Start the Backend Server

```powershell
cd backend
python main.py
```

The API will be available at `http://localhost:8000`
- API Documentation: `http://localhost:8000/docs`

### 5. Start the Frontend Development Server

```powershell
cd frontend
npm run dev
```

The web app will be available at `http://localhost:3000`

## Project Structure

```
Project #5/
├── backend/
│   ├── main.py                 # FastAPI application
│   ├── verify_models.py        # Script to verify model availability
│   ├── models.json             # Verified model list
│   ├── requirements.txt        # Python dependencies
│   └── generated_images/       # Storage for generated images
├── frontend/
│   ├── src/
│   │   ├── App.jsx            # Main application component
│   │   ├── main.jsx           # React entry point
│   │   ├── index.css          # Design system styles
│   │   └── components/
│   │       ├── ImageGenerator.jsx    # Generation form with config
│   │       ├── ImageGallery.jsx      # Image grid and modal
│   │       └── PromptSuggestions.jsx # Example prompts
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── generate.py                 # CLI generation script
├── .env                        # Environment variables (not tracked by git)
└── README.md                   # This file
```

## Usage Guide

### Generating Images

1. **Enter a Prompt**: Describe the image you want to generate
2. **Select a Model**: Choose from the available verified models
3. **Configure Settings** (Optional):
   - Adjust image dimensions
   - Set inference steps (more = higher quality)
   - Control guidance scale (higher = more prompt adherence)
   - Add negative prompts
   - Set a seed for reproducibility
4. **Generate**: Click the "Generate Image" button
5. **Wait**: Generation takes 10-30 seconds depending on the model
6. **View & Download**: Your image appears in the gallery

## API Endpoints

### `GET /api/models`
Get list of verified verified available models with metadata

### `POST /api/generate`
Generate an image with specified parameters

**Request:**
```json
{
  "prompt": "Astronaut riding a horse in space",
  "model": "black-forest-labs/FLUX.1-schnell",
  "width": 512,
  "height": 512,
  "num_inference_steps": 20,
  "guidance_scale": 7.5,
  "negative_prompt": "blurry, low quality",
  "seed": 42
}
```

### `GET /api/history`
Get all generated images

### `GET /api/stats`
Get API statistics

## Development

### Backend Development

```powershell
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Development

```powershell
cd frontend
npm run dev
```

### Building for Production

```powershell
cd frontend
npm run build
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `HUGGINGFACE_TOKEN` | Your Hugging Face API token | Yes |

## Support

For issues or questions:
1. Check the API documentation at `/docs`
2. Review this README
3. Check Hugging Face model cards for specific model issues

---

**Made with FastAPI, React, and Hugging Face**

"""
FastAPI entrypoint for Vercel deployment
"""

import os
import sys

# Add the current directory to Python path for imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Set environment variables for Vercel deployment
os.environ.setdefault("PYTHONPATH", os.path.dirname(os.path.abspath(__file__)))

# Import the FastAPI app
from app.main import app

# Export the FastAPI app for Vercel
__all__ = ["app"]

# Vercel serverless handler
handler = app

# For local development
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

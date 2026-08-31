import os
from dotenv import load_dotenv
from huggingface_hub import InferenceClient
import io
import base64 

load_dotenv("manager\\.env")

client = InferenceClient(
    provider="fal-ai",
    api_key=os.getenv('HUGGINGFACE_API'),
)

def generate_video(prompt:str):
    
    """
    Args:
        prompt (string): Use AI model to generate image based on the prompt

    Returns:
        PIL Object
    """
    
    # output is a PIL.Image object
    video = client.text_to_video(
        prompt,
        model="Wan-AI/Wan2.1-T2V-1.3B",
    )
    




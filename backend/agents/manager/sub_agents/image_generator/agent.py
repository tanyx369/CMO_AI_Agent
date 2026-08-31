import os
from dotenv import load_dotenv
from huggingface_hub import InferenceClient
import io
import base64 
from uuid import uuid4

load_dotenv("D:\\Kabel Projects\\CMO AI Agent\\CMO_AI_Agent\\backend\\agents\\manager\\.env")

client = InferenceClient(
    provider="fal-ai",
    api_key=os.getenv('HUGGINGFACE_API'),
)

async def generate_image(prompt:str, file_path = None) -> dict:
    
    """
    Args:
        prompt (string): Use AI model to generate image based on the prompt

    Returns:
        PIL Object
    """
    
    # output is a PIL.Image object
    image = client.text_to_image(
    prompt,
    model="black-forest-labs/FLUX.1-dev",
    )
    
    file_name = uuid4()
    
    if file_path:
        image.save(f'{file_path}\\{file_name}.jpg')
    else:
        image.save('ai_generated.png')
    # return(image)

    # Convert to base64 string (serializable)
    buffer = io.BytesIO()
    image.save(buffer, format="JPEG")
    img_b64 = base64.b64encode(buffer.getvalue()).decode("utf-8")
    
    return {
        "status": "success",
        "image_base64": img_b64,   # ✅ serializable
        "width": image.width,
        "height": image.height,
        "file_path":f'{file_path}\\{file_name}.jpg'
    }



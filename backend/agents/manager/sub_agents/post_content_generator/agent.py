from google.adk.agents import Agent
from google.adk.tools.tool_context import ToolContext
from google.adk.models.lite_llm import LiteLlm
from google.adk.sessions import InMemorySessionService
from google.adk.runners import Runner
from google.genai import types

from pydantic import BaseModel, Field, ConfigDict, EmailStr, AnyUrl, field_serializer
from typing import Optional, List, Literal

# import os
# from dotenv import load_dotenv
# load_dotenv("manager\\.env")

class PostContent(BaseModel):
    content:str

cloud_ollama_model = LiteLlm(
    model="ollama_chat/gemma4:31b"
)


content_generator = Agent(
    name="post_content_generator",
    model=cloud_ollama_model,
    description="An agent that generate social media post content for company marketing",
    instruction="""
    Generate attractive and eye-catching social media post content in text based on the user's objective and requirement.
    """
)


# Function version 

async def generate_post_content(prompt:str, platform):
    
    APP_NAME = "marketing_app"
    USER_ID = "default_user"

    session_service = InMemorySessionService()

    runner = Runner(
        agent=content_generator,
        app_name=APP_NAME,
        session_service=session_service,
    )
    
    
     # Each call needs a session; reuse one if you want conversational memory,
    # or create a fresh one per call for stateless generation.
    session = await session_service.create_session(
        app_name=APP_NAME,
        user_id=USER_ID,
    )

    full_prompt = f"""
    Main Prompt: {prompt}
    
    Target platform: {platform}
    
    If the main prompt mentioned platform that conflict with the Target platform, still generate according to the Target platform.
    The answer should be consist only a complete and proper output, no need to provide any own elaboration. 
    
    """
    
    
    user_message = types.Content(
        role="user",
        parts=[types.Part(text=full_prompt)],
    )

    final_text = ""
    async for event in runner.run_async(
        user_id=USER_ID,
        session_id=session.id,
        new_message=user_message,
    ):
        if event.is_final_response() and event.content and event.content.parts:
            final_text = event.content.parts[0].text

    return final_text
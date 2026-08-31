from google.adk.agents import Agent
from google.adk.tools.agent_tool import AgentTool
from google.adk.models.lite_llm import LiteLlm

from .sub_agents.image_generator.agent import generate_image
from .sub_agents.post_content_generator.agent import content_generator

cloud_ollama_model = LiteLlm(
    model="ollama_chat/gemma4:31b"
)

# Attach to ADK Agent
root_agent = Agent(
    name="manager",
    model=cloud_ollama_model,
    instruction="""
    You are a Chief Marketing Officer agent that is responsible for generating and managing marketing strategy. You should also delegate the tasks to the right agents or use the correct tools.
    
    Sub-Agents available:
    1. post_content_generator
       - An agent that specifically used for generate text content for social media posting and marketing
       
    The tools you can use:
    1. generate_image
       - A function for you to use other AI model to generate image
       
    You should always return the content from the sub-agents without any changes
    """,
    tools=[generate_image, AgentTool(content_generator)]  # Ensure selected cloud model has native function calling capabilities if passing tools
    
)

# root_agent = Agent(
#     name="manager",
#     model="gemini-2.5-flash",
#     description="Chief Marketing Officer Agent",
#     instruction="""
#     You are a Chief Marketing Officer agent that is responsible for generating and managing marketing strategy. You should also oversee the works of the other agents and review their works
#     """
# )
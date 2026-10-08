import os
import time

from dotenv import load_dotenv
from google import genai
from google.genai.errors import ServerError


# =================================
# LOAD ENVIRONMENT VARIABLES
# =================================
# .env file-la irukkura
# GEMINI_API_KEY-a load pannrom.

load_dotenv()


# =================================
# GEMINI API KEY
# =================================
# .env file-la irukkura API key-a
# environment variable moolama edukkrom.

API_KEY = os.getenv("GEMINI_API_KEY")


# =================================
# GEMINI CLIENT
# =================================
# API key use panni Gemini client
# create pannrom.

client = genai.Client(
    api_key=API_KEY
)


# =================================
# ANALYZE PLANT
# =================================
# Plant details and symptoms-a
# Gemini-ku send panni AI analysis
# return panna indha function use aagum.

def analyze_plant(
    plant_name: str,
    plant_type: str,
    symptoms: str
):

    # =================================
    # AI PROMPT
    # =================================
    # User plant information-a
    # Gemini understand pannura maathiri
    # prompt create pannrom.

    prompt = f"""
You are a plant health assistant.

Analyze the following plant information.

Plant name: {plant_name}
Plant type: {plant_type}
Symptoms: {symptoms}

Provide:

1. Possible plant health issue
2. Short explanation
3. Three practical care suggestions
4. When the user should seek help from a gardening or agricultural expert

Do not claim to provide a guaranteed diagnosis.
Give a clear and simple educational response.
"""


    # =================================
    # RETRY LOGIC
    # =================================
    # Gemini server temporary-aa
    # unavailable irundha maximum 3 times
    # request try pannuvom.

    for attempt in range(3):

        try:

            # Current attempt terminal-la
            # display pannrom.

            print(
                f"Gemini attempt {attempt + 1}/3"
            )


            # =================================
            # GEMINI API REQUEST
            # =================================
            # Prompt-a Gemini model-ku send pannrom.
            #
            # gemini-3.1-flash-lite
            # simple text analysis-ku use pannrom.

            response = client.models.generate_content(
                model="gemini-3.1-flash-lite",
                contents=prompt
            )


            # =================================
            # AI RESPONSE
            # =================================
            # Gemini return pannina text-a
            # backend-ku return pannrom.

            return response.text


        # =================================
        # GEMINI SERVER ERROR
        # =================================
        # Gemini server temporary problem
        # vandha indha block execute aagum.

        except ServerError as error:

            print(
                f"Gemini server unavailable. "
                f"Attempt {attempt + 1}/3"
            )


            # Actual error details-a
            # terminal-la print pannrom.
            #
            # Debug panna idhu useful.

            print(
                f"Gemini error details: {error}"
            )


            # =================================
            # FINAL ATTEMPT
            # =================================
            # 3rd attempt-um fail aana
            # user-ku friendly message return pannrom.

            if attempt == 2:

                return (
                    "The AI service is temporarily unavailable. "
                    "Please try again in a few moments."
                )


            # =================================
            # WAIT BEFORE RETRY
            # =================================
            # Immediate-aa retry pannaama
            # 5 seconds wait pannrom.

            time.sleep(5)
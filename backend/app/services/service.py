
import os
import time
import json

from dotenv import load_dotenv
from google import genai
from google.genai.errors import ServerError


# .env file-la irundhu API key load pannrom.
load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise ValueError(
        "GEMINI_API_KEY is missing from the .env file."
    )


# Gemini client create pannrom.
client = genai.Client(api_key=API_KEY)


def analyze_plant(
    plant_name: str,
    plant_type: str,
    symptoms: str,
) -> dict:

    # Lecturer worksheet-ku match aagura JSON prompt.
    prompt = f"""
You are a careful plant health assistant.

Plant name: {plant_name}
Plant type: {plant_type}
Reported symptoms: {symptoms}

Return ONLY a valid JSON object.
Do not include Markdown code fences or extra text.

Use exactly this structure:

{{
    "possible_issue": "Possible plant health issue",
    "explanation": "Simple explanation of the possible issue",
    "care_suggestions": [
        "Care suggestion 1",
        "Care suggestion 2",
        "Care suggestion 3"
    ],
    "expert_advice_needed": false
}}

Rules:
- Do not invent symptoms that were not reported.
- Do not claim a guaranteed diagnosis.
- Explain uncertainty if the symptoms are insufficient.
- care_suggestions must be a list of strings.
- expert_advice_needed must be true or false, not a string.
- Set expert_advice_needed to true when expert agricultural
  advice is recommended.
"""

    # Maximum 3 attempts.
    for attempt in range(3):
        try:
            print(f"Gemini attempt {attempt + 1}/3")

            response = client.models.generate_content(
                model="gemini-3.1-flash-lite",
                contents=prompt,
                config={
                    "response_mime_type": "application/json"
                },
            )

            result_text = response.text

            if not result_text:
                raise ValueError(
                    "Gemini returned an empty response."
                )

            # JSON string-ai Python dictionary-aa convert pannrom.
            result = json.loads(result_text)

            if not isinstance(result, dict):
                raise ValueError(
                    "Gemini response must be a JSON object."
                )

            # Required fields check pannrom.
            required_fields = [
                "possible_issue",
                "explanation",
                "care_suggestions",
                "expert_advice_needed",
            ]

            missing_fields = [
                field
                for field in required_fields
                if field not in result
            ]

            if missing_fields:
                raise ValueError(
                    "Missing required fields: "
                    + ", ".join(missing_fields)
                )

            # Field types validate pannrom.
            if not isinstance(result["possible_issue"], str):
                raise ValueError(
                    "possible_issue must be a string."
                )

            if not isinstance(result["explanation"], str):
                raise ValueError(
                    "explanation must be a string."
                )

            if (
                not isinstance(result["care_suggestions"], list)
                or not all(
                    isinstance(item, str)
                    for item in result["care_suggestions"]
                )
            ):
                raise ValueError(
                    "care_suggestions must be a list of strings."
                )

            if not isinstance(
                result["expert_advice_needed"], bool
            ):
                raise ValueError(
                    "expert_advice_needed must be a boolean."
                )

            # Python dictionary return pannrom.
            return result

        except ServerError as error:
            print(
                f"Gemini server error on attempt "
                f"{attempt + 1}: {error}"
            )

            if attempt == 2:
                raise RuntimeError(
                    "AI service is temporarily unavailable."
                ) from error

            time.sleep(5)

        except (json.JSONDecodeError, ValueError) as error:
            # Lecturer worksheet: JSON error handling.
            print("Gemini returned invalid JSON:", error)

            if attempt == 2:
                raise RuntimeError(
                    "Could not generate a valid AI response."
                ) from error

            time.sleep(2)

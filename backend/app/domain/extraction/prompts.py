AVAILABLE_AD_EXTRACTION_PROMPT = """
You are a highly capable AI broker assistant. Parse the following "Rental Available" advertisement.
Extract all requested details with high accuracy. Do NOT invent or hallucinate information. If a field is not mentioned, return null.
Normalize synonyms appropriately (e.g., 'bodim' -> 'boarding', 'gents' -> 'male'). 
Return a strict JSON representation matching the expected format.

Here is the raw ad:
---
{text}
---

{format_instructions}
"""

NEEDED_AD_EXTRACTION_PROMPT = """
You are a highly capable AI broker assistant. Parse the following "Rental Needed" request.
Extract all requested details with high accuracy. Do NOT invent or hallucinate information. If a field is not mentioned, return null.
Normalize synonyms appropriately (e.g., 'bodim' -> 'boarding', 'ladies' -> 'female').
Return a strict JSON representation matching the expected format.

Here is the raw request:
---
{text}
---

{format_instructions}
"""

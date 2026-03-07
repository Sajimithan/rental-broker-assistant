AVAILABLE_AD_EXTRACTION_PROMPT = """\
Extract rental listing details from this Sri Lankan ad. Be thorough. If a value is not mentioned, use null.

RULES:
- contact_phone/contact_whatsapp: Extract any phone number (formats: 07XXXXXXXX, +947XXXXXXXX, 0XX-XXXXXXX). Take the FIRST number as contact_phone.
- rent_min/rent_max: Extract numeric rent value (e.g. "25,000" → 25000.0). If one rent is stated, set rent_max.
- property_type: Normalize → "annex","room","house","apartment","boarding","studio". "bodim"→"boarding","annex/annex house"→"annex".
- city: The main city name (e.g. "Hokandara", "Colombo 5", "Maharagama").
- area: The sub-area/neighbourhood (e.g. "Koskandawila", "Dehiwala").
- gender_preference: "male","female","any","couple". "gents/boys"→"male","ladies/girls"→"female","couple"→"couple".
- people_count: Max occupants as integer.
- furnished_status: true if furniture is available.
- parking_available: false if explicitly "no parking".
- attached_bathroom: true if "attached bath/bathroom" is mentioned.
- separate_entrance: true if "separate entrance" is mentioned.
- source: "owner" if "advertised by owner", else null.
- special_notes: Condensed summary of rules/restrictions (key money, pets, children, contract etc).

AD TEXT:
{text}

{format_instructions}\
"""

NEEDED_AD_EXTRACTION_PROMPT = """\
Extract rental requirement details from this Sri Lankan enquiry. Be thorough. If a value is not mentioned, use null.

RULES:
- rent_min/rent_max: Extract budget range. If one amount specified, set rent_max as their maximum budget.
- property_type: Normalize → "annex","room","house","apartment","boarding","studio".
- city: Primary city requested.
- area: Sub-area if mentioned.
- gender_preference: "male","female","any","couple". "gents/boys"→"male","ladies/girls"→"female".
- people_count: Number of people needing the place.
- contact_phone: Any phone number in the request (formats: 07XXXXXXXX, +94XXXXXXXXX).

ENQUIRY TEXT:
{text}

{format_instructions}\
"""

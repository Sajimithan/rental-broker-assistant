from typing import TypeVar, Type, Any, Dict
from pydantic import BaseModel
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from app.infrastructure.llm.gemini_client import get_gemini_client

T = TypeVar('T', bound=BaseModel)

class StructuredExtractor:
    def __init__(self):
        self.llm = get_gemini_client()

    async def extract(self, text: str, schema: Type[T], prompt_template: str) -> T:
        parser = PydanticOutputParser(pydantic_object=schema)
        
        prompt = PromptTemplate(
            template=prompt_template,
            input_variables=["text"],
            partial_variables={"format_instructions": parser.get_format_instructions()}
        )
        
        chain = prompt | self.llm | parser
        
        try:
            result = await chain.ainvoke({"text": text})
            return result
        except Exception as e:
            # Handle parsing errors, maybe fallback or raise validation error
            raise ValueError(f"Failed to extract structured data: {str(e)}")

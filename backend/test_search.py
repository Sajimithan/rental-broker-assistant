import asyncio
import json
import httpx

async def main():
    async with httpx.AsyncClient() as client:
        try:
            resp = await client.post("http://localhost:8000/api/v1/search/query", json={"query": "looking for a room in nugegoda"})
            print("Status:", resp.status_code)
            print("Body:", resp.text)
        except Exception as e:
            print("Error:", e)

if __name__ == "__main__":
    asyncio.run(main())

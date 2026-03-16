import httpx
import asyncio

async def test_create():
    async with httpx.AsyncClient() as client:
        res = await client.post("http://localhost:8000/api/tenants", json={
            "name": "docker_integration_test",
            "tenant_type": "EVOLUTION",
            "instance_name": "docker_test_01",
            "api_key": "test_key_docker"
        })
        print(res.status_code, res.text)

asyncio.run(test_create())

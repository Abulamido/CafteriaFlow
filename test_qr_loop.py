import httpx
import asyncio

async def test():
    async with httpx.AsyncClient() as client:
        # Create tenant
        res = await client.post('http://localhost:8000/api/tenants', json={
            'name': 'qr_final_test',
            'tenant_type': 'EVOLUTION',
            'instance_name': 'qr_final_ok_01',
            'api_key': 'test'
        })
        tenant_data = res.json()
        print("Create response:", tenant_data)
        
        # Check if tenant has ID and if Evolution Instance was actually created
        if 'id' in tenant_data:
            tenant_id = tenant_data['id']
            # Give API a moment though it's sync now
            await asyncio.sleep(1)
            # Fetch QR endpoint
            res2 = await client.get(f'http://localhost:8000/api/tenants/{tenant_id}/qr')
            qr_data = res2.json()
            
            # Truncate base64 for easy read
            if 'qr' in qr_data and 'base64' in qr_data['qr'] and len(str(qr_data['qr']['base64'])) > 50:
                qr_data['qr']['base64'] = qr_data['qr']['base64'][:50] + "...(truncated)"
                
            print("QR Fetch response:", qr_data)

asyncio.run(test())

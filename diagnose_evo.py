"""
Diagnostic script: Creates an Evolution API instance and prints the FULL response.
This tells us exactly what JSON keys the Docker container returns.
"""
import json
import urllib.request

EVO_URL = 'http://localhost:8080'
API_KEY = 'cafteriaflow_evo_key'

def create_and_inspect():
    # Step 1: Create instance
    print("=== STEP 1: Create Instance ===")
    data = json.dumps({
        "instanceName": "diag_instance_99",
        "token": "abcdef1234567890abcdef1234567890",
        "qrcode": True,
        "integration": "WHATSAPP-BAILEYS"
    }).encode('utf-8')
    
    req = urllib.request.Request(
        f'{EVO_URL}/instance/create',
        data=data,
        headers={'apikey': API_KEY, 'Content-Type': 'application/json'}
    )
    
    try:
        with urllib.request.urlopen(req) as resp:
            body = json.loads(resp.read().decode())
            print(f"Status: {resp.status}")
            print(f"Keys: {list(body.keys()) if isinstance(body, dict) else 'not a dict'}")
            print(f"Full response (truncated):")
            full = json.dumps(body, indent=2)
            # Print first 2000 chars to see structure without flooding
            print(full[:2000])
            if len(full) > 2000:
                print(f"...(truncated, total {len(full)} chars)")
    except Exception as e:
        print(f"Create ERROR: {e}")
        if hasattr(e, 'read'):
            print(f"Response body: {e.read().decode()}")
        return

    # Step 2: Try connect endpoint
    print("\n=== STEP 2: Connect Endpoint ===")
    req2 = urllib.request.Request(
        f'{EVO_URL}/instance/connect/diag_instance_99',
        headers={'apikey': API_KEY}
    )
    try:
        with urllib.request.urlopen(req2) as resp2:
            body2 = json.loads(resp2.read().decode())
            print(f"Status: {resp2.status}")
            print(f"Keys: {list(body2.keys()) if isinstance(body2, dict) else 'not a dict'}")
            full2 = json.dumps(body2, indent=2)
            print(full2[:2000])
    except Exception as e:
        print(f"Connect ERROR: {e}")
        if hasattr(e, 'read'):
            print(f"Response body: {e.read().decode()}")

    # Step 3: Fetch instances list
    print("\n=== STEP 3: List Instances ===")
    req3 = urllib.request.Request(
        f'{EVO_URL}/instance/fetchInstances',
        headers={'apikey': API_KEY}
    )
    try:
        with urllib.request.urlopen(req3) as resp3:
            body3 = json.loads(resp3.read().decode())
            print(f"Instance count: {len(body3) if isinstance(body3, list) else 'not a list'}")
            for inst in (body3 if isinstance(body3, list) else []):
                print(f"  - {inst.get('name', inst.get('instanceName', 'unknown'))}: state={inst.get('connectionStatus', 'unknown')}")
    except Exception as e:
        print(f"List ERROR: {e}")

create_and_inspect()

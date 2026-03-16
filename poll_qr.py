import urllib.request
import json
import time

url = 'http://localhost:8080/instance/connect/docker_test_01'
headers = {'apikey': 'cafteriaflow_evo_key'}
req = urllib.request.Request(url, headers=headers)

print("Polling for QR code...")
for i in range(10):
    try:
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            print(f"Attempt {i+1}:", list(data.keys()) if isinstance(data, dict) else "Not a dict")
            
            # Print the actual structure if it looks like a QR code response
            if 'base64' in data or 'qrcode' in data or 'code' in data:
                print("FOUND QR PAYLOAD:")
                print(json.dumps(data, indent=2)[:500] + "...")
                break
            elif isinstance(data, dict) and 'count' in data:
                print("Still connecting...")
    except Exception as e:
        print(f"Attempt {i+1} Error:", e)
    
    time.sleep(2)

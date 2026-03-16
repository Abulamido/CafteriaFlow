import json
import urllib.request

url = 'http://localhost:8080/instance/create'
headers = {
    'apikey': 'cafteriaflow_evo_key',
    'Content-Type': 'application/json'
}
data = {
    "instanceName": "test_instance_01",
    "token": "1234567890abcdef1234567890abcdef",
    "qrcode": True,
    "integration": "WHATSAPP-BAILEYS"
}

req = urllib.request.Request(url, json.dumps(data).encode('utf-8'), headers)
try:
    with urllib.request.urlopen(req) as response:
        print(response.read().decode())
except Exception as e:
    print("ERROR:", e)
    if hasattr(e, 'read'):
        print(e.read().decode())

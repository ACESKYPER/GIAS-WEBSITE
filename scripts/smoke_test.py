from fastapi.testclient import TestClient
from main import app as app_obj
import json

client = TestClient(app_obj)

def run():
    print('GET /health')
    r = client.get('/health')
    print(r.status_code)
    print(r.json())

    print('\nGET /api/v1/roles')
    r = client.get('/api/v1/roles')
    print(r.status_code)
    print(json.dumps(r.json(), indent=2))

    roles = r.json()
    if roles:
        role_id = roles[0]['id']
        print('\nPOST /api/v1/auth/register')
        payload = {
            'email': 'smoke+test@example.com',
            'full_name': 'Smoke Test',
            'password': 'SmokePass123!',
            'role_id': role_id
        }
        r2 = client.post('/api/v1/auth/register', json=payload)
        print(r2.status_code)
        try:
            print(json.dumps(r2.json(), indent=2))
        except Exception:
            print('Register response not JSON:', r2.text)

        print('\nPOST /api/v1/auth/login')
        payload2 = {'email': 'smoke+test@example.com', 'password': 'SmokePass123!'}
        r3 = client.post('/api/v1/auth/login', json=payload2)
        print(r3.status_code)
        try:
            print(json.dumps(r3.json(), indent=2))
        except Exception:
            print('Login response not JSON:', r3.text)
    else:
        print('No roles found; skipping register/login')

if __name__ == '__main__':
    run()

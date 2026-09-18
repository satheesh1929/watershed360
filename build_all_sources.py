import os, base64

def s(p, b):
    os.makedirs(os.path.dirname(p), exist_ok=True)
    with open(p, 'wb') as f:
        f.write(base64.b64decode(b))
    print('Created:', p)

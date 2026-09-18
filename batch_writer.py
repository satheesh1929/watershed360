import os, sys, base64

def put(path, b64):
    d = os.path.dirname(path)
    if d: os.makedirs(d, exist_ok=True)
    with open(path, 'wb') as f:
        f.write(base64.b64decode(b64))
    print('Saved', path)

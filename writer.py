import os, sys, base64

def write(path, b64str):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'wb') as f:
        f.write(base64.b64decode(b64str))
    print('Warreded', path)

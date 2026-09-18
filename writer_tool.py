import os, sys, base64, re

def write(path, b64str):
    d = os.path.dirname(path)
    if d: os.makedirs(d, exist_ok=True)
    cleaned = re.sub(r',\s+', '', b64str)
    while len(cleaned) % 4 != 0:
        cleaned += '='
    with open(path, 'wb') as f:
        f.write(base64.b64decode(cleaned, validate=False))
    print('Wrote', path)

if __name__ == '__main__':
    write(sys.argv[1], sys.argv[2])

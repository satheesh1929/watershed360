# Build script for WATERSHED360 components
import os

def w(path, content):
    d = os.path.dirname(path)
    if d: os.makedirs(d, exist_ok=True)
    with open(path, 'w', encoding='utf-8') as out:
        out.write(content.strip() + '\n')
    print('Wrote', path)

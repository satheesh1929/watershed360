# Build script
import os

def write(filepath, content):
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, 'w', encoding='utf-8') as out:
        out.write(content)
    print(f'Wrote {filepath}')

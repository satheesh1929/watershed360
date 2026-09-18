# Complete generator for WATERSHED360 Phase 1
import os

def w(path, text):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as out:
        out.write(text.strip() + '\n')
    print('Created:', path)

print('compile_all ready')

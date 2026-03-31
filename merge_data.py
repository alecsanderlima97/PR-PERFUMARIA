import json
import re

# Read original data.js to extract existing perfumes
with open('c:/Users/escri/OneDrive/Documentos/GitHub/PR-PERFUMARIA/src/data.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Simple extraction of the array content
# This is a bit hacky but works for this specific file structure
match = re.search(r'export const perfumes = \[(.*)\];', content, re.DOTALL)
if not match:
    print("Could not find perfumes array in data.js")
    exit(1)

# I'll just keep the first 12 as they are and append the new ones
# But I need to format them exactly as JS objects

with open('c:/Users/escri/OneDrive/Documentos/GitHub/PR-PERFUMARIA/perfumes_data.json', 'r', encoding='utf-16le') as f:
    new_perfumes = json.load(f)

# The original perfumes (1-12)
original_perfumes_js = match.group(1).strip()

# Now generating the JS string for new perfumes
new_perfumes_js = ""
for p in new_perfumes:
    js_obj = "  {\n"
    for k, v in p.items():
        val = json.dumps(v, ensure_ascii=False)
        # Fix for keys that don't need quotes in JS (optional but cleaner)
        js_obj += f"    {k}: {val},\n"
    js_obj = js_obj.rstrip(',\n') + "\n  },\n"
    new_perfumes_js += js_obj

final_content = f"export const perfumes = [\n{original_perfumes_js},\n{new_perfumes_js.rstrip(',\n')}\n];"

with open('c:/Users/escri/OneDrive/Documentos/GitHub/PR-PERFUMARIA/src/data.js', 'w', encoding='utf-8') as f:
    f.write(final_content)

print("Updated data.js with new perfumes.")

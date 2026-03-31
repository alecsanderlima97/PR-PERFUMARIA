import re
import json

# Fragrance characteristics map for common notes/families
FAMILIES = {
    "Paco Rabanne": "Amadeirado Especiado",
    "Carolina Herrera": "Floral Oriental",
    "Jean Paul Gaultier": "Oriental Aromático",
    "DIOR": "Fougère Aromático",
    "CHANEL": "Chipre Floral",
    "Guerlain": "Floral Frutado",
    "Giorgio Armani": "Aquático Aromático",
    "Azzaro": "Amadeirado Fougère",
    "Hugo Boss": "Amadeirado Especiado",
    "Lattafa": "Oriental Luxuoso",
    "Al Haramain": "Oriental Especiado",
    "Tom Ford": "Couro Especiado",
    "Parfums de Marly": "Oriental Amadeirado",
    "Louis Vuitton": "Cítrico Fresco",
    "Boticário": "Floral Gourmand",
    "Natura": "Floral Frutado",
    "Eudora": "Chypre Floral"
}

OCCASIONS = {
    "Masculino": ["Noturno", "Work", "Aquático", "Balada"],
    "Feminino": ["Noite", "Dia", "Trabalho", "Sedutor"]
}

def get_fragrance_info(brand, name, gender):
    family = FAMILIES.get(brand, "Fragrância de Luxo")
    if "Bad Boy" in name or "One Million" in name or "Scandal" in name:
        occ = "Balada" if gender == "Masculino" else "Noite"
        notes = "Notas intensas de Cacau, Pimenta Preta e Fava Tonka." if gender == "Masculino" else "Mel, Gardênia e Patchouli."
        desc = "Uma fragrância audaciosa para quem não tem medo de se destacar."
    elif "212" in name or "Sauvage" in name:
        occ = "Noturno" if gender == "Masculino" else "Dia"
        notes = "Gengibre, Petitgrain e Notas Verdes."
        desc = "Inspirado na energia urbana e na sofisticação atemporal."
    elif "Acqua" in name or "Blue" in name or "Invictus" in name:
        occ = "Aquático" if gender == "Masculino" else "Dia"
        notes = "Notas Marinhas, Toranja e Jasmim."
        desc = "A refrescância do oceano combinada com a força da vitória."
    else:
        occ = "Work" if gender == "Masculino" else "Dia"
        notes = "Combinação equilibrada de notas florais e amadeiradas."
        desc = "Elegância discreta para o cotidiano de quem busca o melhor."
    
    return family, desc, notes, occ

def parse_catalog(text, gender):
    lines = text.split('\n')
    current_brand = ""
    results = []
    
    for line in lines:
        line = line.strip()
        if not line: continue
        
        # Detect brand lines (no colon or very short)
        if ":" not in line:
            current_brand = line
            continue
            
        # Handle lines like "BRAND: NAME: Dispon..."
        parts = line.split(':')
        if len(parts) >= 3 and "ispon" in parts[2]:
            brand_from_line = parts[0].strip()
            name = parts[1].strip()
            vols = parts[2].strip()
        elif len(parts) >= 2 and "ispon" in parts[1]:
            name = parts[0].strip()
            vols = parts[1].strip()
            brand_from_line = current_brand
        else:
            continue
            
        brand = brand_from_line if brand_from_line else current_brand
        
        # Clean up vols
        vols_cleaned = vols.replace("Disponíveis", "").replace("Disponível", "").replace(":", "").strip()
        available_vols = [v.strip() for v in vols_cleaned.split(',') if v.strip()]
        
        family, desc, notes, occ = get_fragrance_info(brand, name, gender)
        
        full_name = f"{brand} {name}" if brand not in name else name
        slug = re.sub(r'[^a-zA-Z0-9]', '_', full_name.lower())
        
        p = {
            "id": len(results) + 1, # Placeholder ID, will reassign later
            "name": name,
            "brand": brand,
            "type": "Eau de Parfum",
            "price": 439.89,
            "gender": gender,
            "class": occ,
            "volume": available_vols[0] if available_vols else "100ml",
            "availableVolumes": available_vols if available_vols else ["100ml"],
            "sac": "+55 15 99696-6772",
            "seals": ["Original", "Garantia PR"],
            "approvals": ["ANVISA Processo nº 25351.123456/2025-01"],
            "description": desc,
            "family": family,
            "ingredients": notes.split(','),
            "usageNotes": f"Recomendado para uso {occ.lower()}.",
            "image": f"/assets/perfumes/{slug}.png",
            "whatsappLink": f"https://wa.me/5515996966772?text=Olá! Gostaria de saber mais sobre o {full_name}."
        }
        results.append(p)
        
    return results

# Get input text from the existing tmp file
with open('c:/Users/escri/OneDrive/Documentos/GitHub/PR-PERFUMARIA/tmp_generate_full_catalog.py', 'r', encoding='utf-8') as f:
    content = f.read()
    
# Extract the strings using regex
m_match = re.search(r'masculino_text = """(.*?)"""', content, re.DOTALL)
f_match = re.search(r'feminino_text = """(.*?)"""', content, re.DOTALL)

masculino_text = m_match.group(1) if m_match else ""
feminino_text = f_match.group(1) if f_match else ""

masculino_perfumes = parse_catalog(masculino_text, "Masculino")
feminino_perfumes = parse_catalog(feminino_text, "Feminino")

all_perfumes = masculino_perfumes + feminino_perfumes
for i, p in enumerate(all_perfumes):
    p["id"] = i + 1

with open('c:/Users/escri/OneDrive/Documentos/GitHub/PR-PERFUMARIA/src/data.js', 'w', encoding='utf-8') as f:
    f.write("export const perfumes = " + json.dumps(all_perfumes, indent=2, ensure_ascii=False) + ";")

print(f"Successfully generated src/data.js with {len(all_perfumes)} perfumes.")

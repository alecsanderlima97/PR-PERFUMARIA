import re

def count_perfumes(text):
    lines = text.split('\n')
    count = 0
    for line in lines:
        if ':' in line:
            count += 1
    return count

masculino_text = """Paco Rabanne
Invictus: Disponíveis: 50 ml, 100 ml, 200 ml
Invictus Victory: Disponíveis: 50 ml, 100 ml, 200 ml
Invictus Parfum: Disponíveis: 50 ml, 100 ml, 200 ml
One Million Cologne: Disponíveis: 125 ml
One Million Elixir: Disponíveis: 50 ml, 100 ml, 200 ml
One Million Royal: Disponíveis: 50 ml, 100 ml, 200 ml
One Million Parfum: Disponíveis: 50 ml, 100 ml, 200 ml
One Million: Disponíveis: 50 ml, 100 ml, 200 ml
Lucky: Disponíveis: 50 ml, 100 ml, 200 ml
Phantom: Disponíveis: 50 ml, 100 ml, 150 ml
Phantom Parfum: Disponíveis: 50 ml, 100 ml, 150 ml
Pure XS: Disponíveis: 50 ml, 100 ml
Carolina Herrera
Gold Fantasy: Disponíveis: 50 ml, 100 ml
Bad Boy: Disponíveis: 50 ml, 100 ml
Bad Boy Cobalt: Disponíveis: 50 ml, 100 ml
Bad Boy Dazzling Garden: Disponíveis: 50 ml, 100 ml
Bad Boy Sparkling Ice: Disponíveis: 50 ml, 100 ml
Bad Boy Extreme: Disponíveis: 50 ml, 100 ml
212 VIP Black: Disponíveis: 50 ml, 100 ml, 200 ml
212 VIP Black MTV: Disponíveis: 100 ml
212 VIP Black Elixir: Disponíveis: 50 ml, 100 ml
212 VIP Red: Disponíveis: 50 ml, 100 ml, 200 ml
212 VIP MTV: Disponíveis: 100 ml
212 Men NYC: Disponíveis: 50 ml, 100 ml, 200 ml
Herrera for Men: Disponíveis: 100 ml, 200 ml
212 Men Heroes Forever Young: Disponíveis: 50 ml, 90 ml, 150 ml
CH Men: Disponíveis: 50 ml, 100 ml
Jean Paul Gaultier
Scandal Absolu: Disponíveis: 50 ml, 100 ml, 150 ml
Scandal: Disponíveis: 50 ml, 100 ml, 150 ml
Scandal Le Parfum: Disponíveis: 50 ml, 100 ml
Scandal Intense: Disponíveis: 50 ml, 100 ml
Le Beau: Disponíveis: 75 ml, 125 ml
Le Male: Disponíveis: 75 ml, 125 ml
Ultra Male: Disponíveis: 75 ml, 125 ml, 200 ml
Le Male Le Parfum: Disponíveis: 75 ml, 125 ml
Le Male Elixir: Disponíveis: 75 ml, 125 ml
Le Beau Paradise Garden: Disponíveis: 75 ml, 125 ml
Maison Francis Kurkdjian
Baccarat Rouge 540: Disponíveis: 50 ml, 100 ml, 200 ml
Lattafa
Ansaam Silver: Disponível: 100 ml
Ameer: Disponível: 100 ml
Wazeer: Disponível: 100 ml
Maahir Legacy: Disponível: 100 ml
Khamrah: Disponível: 100 ml
Asad Bourbon: Disponível: 100 ml
Asad: Disponível: 100 ml
Asad Zanzibar: Disponível: 100 ml
Art of Arabia 3: Disponível: 100 ml
Fakhar Gold: Disponível: 100 ml
Fakhar: Disponível: 100 ml
Al Haramain
L'Aventure: Disponível: 100 ml
Tom Ford
Oud Wood: Disponível: 50 ml
Fucking Fabulous: Disponível: 50 ml
Neroli Portofino: Disponível: 50 ml
Extreme: Disponível: 50 ml
Parfums de Marly
Althair: Disponível: 125 ml
Layton: Disponível: 125 ml
Godolphin: Disponível: 125 ml
Haltane: Disponível: 125 ml
Thierry Mugler
A Man: Disponível: 100 ml
Xerjoff
Alexandria: Disponível: 50 ml, 100 ml
Erba Pura: Disponível: 50 ml, 100 ml
Naxos: Disponível: 50 ml, 100 ml
Maison Alhambra
Perseus: Disponível: 50 ml, 100 ml
Tobacco Touch: Disponível: 100 ml
Salvo: Disponível: 100 ml
Louis Vuitton
Imagination: Disponível: 50 ml, 100 ml
French Avenue
Liquid Brun: Disponível: 100 ml
Royal Blend: Disponível: 100 ml
Parys Elysees
Black Caviar: Disponível: 100 ml
Dior
Sauvage Elixir: Disponível: 60 ml
Sauvage: Disponíveis: 100 ml, 200 ml
Fahrenheit: Disponíveis: 100 ml, 200 ml
Dior Homme: Disponíveis: 100 ml
Mercedes Benz
Club Black: Disponível: 100 ml
Club Silver: Disponível: 100 ml
Select Night: Disponível: 100 ml
Chanel
Allure Homme: Disponíveis: 50 ml, 100 ml, 150 ml
Platinum Egoiste: Disponíveis: 50 ml, 100 ml
Bleu de Chanel: Disponíveis: 50 ml, 100 ml
Allure Homme Sport: Disponíveis: 50 ml, 100 ml
Calvin Klein
Defy: Disponível: 100 ml
CK One Essence: Disponíveis: 100 ml, 200 ml
CK One: Disponíveis: 50 ml, 200 ml
CK Be: Disponíveis: 100 ml, 200 ml
CK One Shock: Disponíveis: 100 ml, 200 ml
Ralph Lauren
Polo 67: Disponíveis: 40 ml, 75 ml
Polo Red: Disponíveis: 75 ml, 125 ml, 200 ml
Polo Blue: Disponíveis: 75 ml, 125 ml, 200 ml
Polo Green: Disponíveis: 30 ml, 50 ml, 100 ml
Polo Sport: Disponíveis: 50 ml, 125 ml
Polo Black: Disponíveis: 30 ml, 50 ml, 100 ml, 200 ml
Polo Club
Beverly Hills 2: Disponível: 100 ml
Beverly Hills 1: Disponível: 100 ml
Beverly Hills 8: Disponível: 100 ml
Ferrari
Ferrari Red: Disponíveis: 75 ml, 125 ml
Ferrari Black: Disponíveis: 50 ml, 100 ml, 200 ml
Burberry
Hero: Disponíveis: 50 ml, 100 ml
Riiff
Bleu Absolu: Disponível: 100 ml
Prada
L'Homme: Disponível: 100 ml
Black: Disponível: 100 ml
Azzaro
Chrome: Disponíveis: 50 ml, 100 ml, 200 ml
The Most Wanted: Disponíveis: 50 ml, 100 ml, 150 ml
Pour Homme: Disponíveis: 30 ml, 50 ml, 100 ml, 200 ml
Wanted: Disponível: 50 ml, 100 ml
Cologne Intense: Disponível: 30 ml, 50 ml, 100 ml
Yves Saint Laurent
Y: Disponível: 100 ml
My Self: Disponível: 100 ml
Dolce & Gabbana
Pour Homme: Disponíveis: 75 ml, 125 ml, 200 ml
Light Blue: Disponíveis: 30 ml, 50 ml, 100 ml
The One: Disponíveis: 100 ml, 150 ml
King of Seduction: Disponível: 50 ml, 100 ml, 200 ml
Mont Blanc
Starwalker: Disponíveis: 50 ml, 100 ml
Legend Blue: Disponível: 50 ml, 100 ml
Legend Red: Disponível: 50 ml, 100 ml
Explorer: Disponíveis: 50 ml, 100 ml
Individuel: Disponível: 100 ml
Davidoff
Cool Water: Disponível: 100 ml
Viktor & Rolf
Spicebomb: Disponíveis: 50 ml, 90 ml
Jacques Bogart
Silver Scent: Disponíveis: 30 ml, 50 ml, 100 ml, 200 ml
Armaf
Club de Nuit Oud: Disponível: 105 ml
Club de Nuit Intense: Disponível: 100 ml
Club de Nuit Milestone: Disponível: 100 ml
Club de Nuit Intense Man: Disponível: 100 ml
Anfar
Bateig Azul: Disponível: 100 ml
Joop!
Homme: Disponíveis: 75 ml, 125 ml, 200 ml
Narciso Rodriguez
Bleu Noir: Disponíveis: 50 ml, 100 ml
John Varvatos
Artisan: Disponível: 100 ml
La Rive
Mr. Sharp: Disponível: 100 ml
Creed
Aventus: Disponível: 100 ml
Lamborghini
Huracan: Disponíveis: 50 ml, 100 ml, 150 ml
Benetton
We Are Tribe: Disponível: 90 ml
Givenchy
Gentleman: Disponíveis: 50 ml, 100 ml
Ace of Spades: Disponível: 100 ml
Society Extreme: Disponível: 100 ml
Issey Miyake
L'Eau d'Issey: Disponível: 100 ml
Nautica
Voyage: Disponíveis: 50 ml, 100 ml
Eudora
Impression in Black: Disponível: 100 ml
Impression: Disponível: 100 ml
Club 6 Intenso: Disponível: 100 ml
Club 6 Voyage: Disponível: 100 ml
Club 6 Exclusive: Disponível: 100 ml
Club 6 Spotlight: Disponível: 100 ml
O Boticário
Coffee Man Sense: Disponível: 100 ml
Coffee Man Duo: Disponível: 100 ml
Coffee Addictive: Disponível: 100 ml
Coffee Man Seduction: Disponível: 100 ml
Zaad Mondo: Disponível: 95 ml
Zaad Santal: Disponível: 95 ml
Zaad: Disponível: 95 ml
Zaad Arctic: Disponível: 95 ml
Zaad Venture: Disponível: 95 ml
Zaad Expedition: Disponível: 95 ml
Verano en Firenze: Disponível: 90 ml
African Sunrise: Disponível: 90 ml
Dark Mint: Disponível: 100 ml
Fiji Paradise: Disponível: 90 ml
The Blend Cardamom: Disponível: 100 ml
The Blend Bourbon: Disponível: 100 ml
The Blend: Disponível: 100 ml
Malbec Signature: Disponível: 90 ml
Malbec Gold: Disponível: 100 ml
Malbec Black: Disponível: 100 ml
Malbec Sport: Disponível: 100 ml
Malbec Magnetic: Disponível: 100 ml
Malbec Icon: Disponível: 100 ml
Malbec Bleu: Disponível: 100 ml
Malbec X: Disponível: 100 ml
Malbec Flame: Disponível: 100 ml
Malbec Ultra Bleu: Disponível: 100 ml
Malbec Vert: Disponível: 100 ml
Malbec 20: Disponível: 100 ml
Malbec Pure Gold: Disponível: 100 ml
Malbec Noir: Disponível: 100 ml
Uomini Black: Disponível: 100 ml
Quasar Brave: Disponível: 100 ml
Uomini: Disponível: 100 ml
Quasar Ice: Disponível: 100 ml
Quasar Vision: Disponível: 100 ml
Arbo Puro: Disponível: 100 ml
Arbo Atlântica: Disponível: 100 ml
Arbo Botanic: Disponível: 100 ml
Arbo Intenso: Disponível: 100 ml
Arbo Forest: Disponível: 100 ml
Clash: Disponível: 100 ml
Natura
Homem Nos: Disponível: 100 ml
Homem Tato: Disponível: 100 ml
Homem Elo: Disponível: 100 ml
Homem Verum: Disponível: 100 ml
Homem Dom: Disponível: 100 ml
Homem Sagaz: Disponível: 100 ml
Homem Essence: Disponível: 100 ml
Homem Neo: Disponível: 100 ml
Homem Coragio: Disponível: 100 ml
Essencial Único: Disponível: 90 ml
Essencial Mirra: Disponível: 100 ml
Essencial Palo Santo: Disponível: 100 ml
Essencial Sentir: Disponível: 100 ml
Essencial Supreme: Disponível: 100 ml
Essencial Exclusivo: Disponível: 100 ml
Essencial Oud Vanilla: Disponível: 100 ml
Essencial Elixir: Disponível: 100 ml
Essencial Atrai: Disponível: 100 ml
Essencial Oud: Disponível: 100 ml
K Max: Disponível: 100 ml
K Natura: Disponível: 100 ml
Conexão de Humor: Disponível: 75 ml
Sintonia Noite: Disponível: 100 ml
Humor a Dois: Disponível: 75 ml
Giorgio Armani
Acqua di Giò Profondo: Disponíveis: 90 ml, 100 ml, 150 ml, 200 ml
Stronger With You: Disponível: 50 ml, 100 ml
Armani Code: Disponíveis: 50 ml, 75 ml, 125 ml, 200 ml
Acqua di Giò Pour Homme: Disponíveis: 20 ml, 50 ml, 100 ml, 200 ml
Bulgari
Terrae Essence: Disponíveis: 60 ml, 100 ml, 150 ml
Rain Essence: Disponíveis: 50 ml, 100 ml
Wood Essence: Disponíveis: 60 ml, 100 ml, 150 ml
Man in Black: Disponíveis: 60 ml, 100 ml, 150 ml
Aqva: Disponíveis: 50 ml, 100 ml
Glacial Essence: Disponíveis: 60 ml, 100 ml
Animale
Animale Gold: Disponíveis: 30 ml, 100 ml, 200 ml
Animale: Disponíveis: 30 ml, 100 ml, 200 ml
Animale S: Disponíveis: 30 ml, 50 ml, 100 ml
Nautica
Blue: Disponíveis: 50 ml, 100 ml
Moschino
Toy Boy: Disponíveis: 30 ml, 50 ml, 100 ml
Lacoste
L12 12: Disponíveis: 50 ml, 100 ml
Stella Dustin
Homme: Disponível: 100 ml
Ikario: Disponível: 100 ml
Lumina Black: Disponível: 100 ml
D'Oro: Disponível: 100 ml
Versace
The Dreamer: Disponíveis: 50 ml, 100 ml
Eros Flame: Disponíveis: 50 ml, 100 ml
Pour Homme: Disponíveis: 50 ml, 100 ml, 200 ml
Eros: Disponíveis: 50 ml, 100 ml, 200 ml
Eros Energy: Disponíveis: 50 ml, 100 ml
Dylan Blue: Disponíveis: 30 ml, 50 ml, 100 ml, 200 ml
Antonio Banderas
The Secret: Disponíveis: 50 ml, 100 ml, 200 ml
The Golden Secret: Disponíveis: 50 ml, 100 ml, 200 ml
The Icon Elixir: Disponíveis: 50 ml, 100 ml
The Icon: Disponíveis: 50 ml, 100 ml
The Secret Absolu: Disponíveis: 50 ml, 100 ml, 200 ml
Diesel
Only the Brave: Disponíveis: 75 ml, 125 ml, 200 ml
Spirit of the Brave: Disponíveis: 125 ml"""

feminino_text = """Carolina Herrera
Good Girl: Disponíveis: 30 ml, 50 ml, 80 ml, 150 ml
Good Girl Légère: Disponíveis: 30 ml, 50 ml, 80 ml
Good Girl Suprême: Disponíveis: 30 ml, 50 ml, 80 ml
Good Girl Blush: Disponíveis: 30 ml, 50 ml, 80 ml
Good Girl Blush Elixir: Disponíveis: 30 ml, 50 ml, 80 ml
Good Girl Dazzling Garden: Disponíveis: 80 ml
Good Girl Midnight: Disponíveis: 80 ml
Good Girl Gold Fantasy: Disponíveis: 80 ml
Good Girl Fantastic Pink: Disponíveis: 80 ml
Good Girl Very Good Girl: Disponíveis: 30 ml, 50 ml, 80 ml
Good Girl Glam: Disponíveis: 30 ml, 50 ml, 80 ml
Good Girl Glorious Gold: Disponíveis: 80 ml
Good Girl Dot Drama: Disponíveis: 80 ml
Good Girl Collector Edition: Disponíveis: 80 ml
Good Girl Glitter Collector: Disponíveis: 80 ml
212 VIP Rosé: Disponíveis: 30 ml, 50 ml, 80 ml
212 VIP Rosé Elixir: Disponíveis: 30 ml, 50 ml, 80 ml
212 VIP Rosé Smiley: Disponíveis: 80 ml
212 VIP Rosé Red: Disponíveis: 80 ml
212 Her: Disponíveis: 30 ml, 60 ml, 100 ml
Jean Paul Gaultier
Scandal: Disponíveis: 30 ml, 50 ml, 80 ml
Scandal Le Parfum: Disponíveis: 30 ml, 50 ml, 80 ml
Scandal Absolu: Disponíveis: 30 ml, 50 ml, 80 ml
La Belle: Disponíveis: 30 ml, 50 ml, 100 ml
La Belle Le Parfum: Disponíveis: 30 ml, 50 ml, 100 ml
Divine: Disponíveis: 30 ml, 50 ml, 100 ml
Divine Le Parfum: Disponíveis: 30 ml, 50 ml, 100 ml
Classique: Disponíveis: 30 ml, 50 ml, 100 ml
Lancôme
Idôle: Disponíveis: 25 ml, 50 ml, 100 ml
Idôle Aura: Disponíveis: 25 ml, 50 ml, 100 ml
Idôle Nectar: Disponíveis: 25 ml, 50 ml, 100 ml
Idôle Now: Disponíveis: 25 ml, 50 ml, 100 ml
La Vie Est Belle: Disponíveis: 30 ml, 50 ml, 100 ml
La Vie Est Belle Iris Absolu: Disponíveis: 30 ml, 50 ml, 100 ml
La Vie Est Belle En Rose: Disponíveis: 50 ml, 100 ml
La Vie Est Belle Soleil Cristal: Disponíveis: 50 ml, 100 ml
Giorgio Armani
My Way: Disponíveis: 30 ml, 50 ml, 90 ml
My Way Intense: Disponíveis: 30 ml, 50 ml, 90 ml
My Way Nectar: Disponíveis: 30 ml, 50 ml, 90 ml
My Way Floral: Disponíveis: 30 ml, 50 ml, 90 ml
Sì: Disponíveis: 30 ml, 50 ml, 100 ml
Sì Passione: Disponíveis: 30 ml, 50 ml, 100 ml
Yves Saint Laurent
Libre: Disponíveis: 30 ml, 50 ml, 90 ml
Libre Intense: Disponíveis: 30 ml, 50 ml, 90 ml
Libre Le Parfum: Disponíveis: 30 ml, 50 ml, 90 ml
Black Opium: Disponíveis: 30 ml, 50 ml, 90 ml
Dior
J'adore: Disponíveis: 30 ml, 50 ml, 100 ml
Miss Dior: Disponíveis: 30 ml, 50 ml, 100 ml
Hypnotic Poison: Disponíveis: 30 ml, 50 ml, 100 ml
Pure Poison: Disponíveis: 30 ml, 50 ml, 100 ml
Chanel
Chanel No 5: Disponíveis: 35 ml, 50 ml, 100 ml
Coco Mademoiselle: Disponíveis: 35 ml, 50 ml, 100 ml
Chance: Disponíveis: 35 ml, 50 ml, 100 ml
Gabrielle: Disponíveis: 35 ml, 50 ml, 100 ml
Paco Rabanne
Lady Million: Disponíveis: 30 ml, 50 ml, 80 ml
Olympéa: Disponíveis: 30 ml, 50 ml, 80 ml
Fame: Disponíveis: 30 ml, 50 ml, 80 ml
Pure XS For Her: Disponíveis: 30 ml, 50 ml, 80 ml
O Boticário
Lily: Disponível: 75 ml
Lily Absolu: Disponível: 75 ml
Lily Lumiére: Disponível: 75 ml
Elysée: Disponível: 50 ml
Elysée Succés: Disponível: 50 ml
Floratta Blue: Disponível: 75 ml
Floratta Gold: Disponível: 75 ml
Floratta Red: Disponível: 75 ml
Floratta Rose: Disponível: 75 ml
Coffee Woman Duo: Disponível: 100 ml
Coffee Woman Seduction: Disponível: 100 ml
Eudora
Eudora Royal: Disponível: 100 ml
Eudora Magnific: Disponível: 100 ml
Eudora Rouge: Disponível: 100 ml
Lyra: Disponível: 100 ml
Impression For Her: Disponível: 100 ml"""

m_count = count_perfumes(masculino_text)
f_count = count_perfumes(feminino_text)
print(f"Masculinos: {m_count}")
print(f"Femininos: {f_count}")
print(f"Total: {m_count + f_count}")

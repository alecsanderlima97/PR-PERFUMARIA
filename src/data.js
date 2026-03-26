/**
 * PR PERFUMARIA - LUXURY E-COMMERCE DATA
 * Base de dados com 161 perfumes de luxo (Nichos e Grifes)
 */

export const perfumes = [
  // 1-10 (DESTAQUES)
  {
    id: 1,
    name: "Sauvage Elixir",
    brand: "Dior",
    price: 349.00,
    gender: "Masculino",
    class: "Noturno",
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=400",
    description: "Uma concentração extraordinária onde o frescor emblemático de Sauvage se embriaga com um coração de especiarias.",
    ingredients: ["Lavanda", "Alcaçuz", "Canela"]
  },
  {
    id: 2,
    name: "Bleu de Chanel Parfum",
    brand: "Chanel",
    price: 389.00,
    gender: "Masculino",
    class: "Trabalho",
    image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=400",
    description: "Uma fragrância intensamente amadeirada e aromática com uma trilha profunda e misteriosa.",
    ingredients: ["Sandalo", "Cedro", "Cítricos"]
  },
  {
    id: 3,
    name: "Aventus",
    brand: "Creed",
    price: 589.00,
    gender: "Masculino",
    class: "Noturno",
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=400",
    description: "O perfume mais vendido da história de Creed, representa força, poder e sucesso.",
    ingredients: ["Abacaxi", "Vidro", "Musgo"]
  },
  {
    id: 4,
    name: "Baccarat Rouge 540",
    brand: "Maison Francis Kurkdjian",
    price: 849.00,
    gender: "Unissex",
    class: "Noturno",
    image: "https://images.unsplash.com/photo-1595425970377-c9703cf443aa?auto=format&fit=crop&q=80&w=400",
    description: "Uma alquimia poética altamente condensada e gráfica. Notas florais, âmbar e amadeiradas.",
    ingredients: ["Açafrão", "Jasmim", "Âmbar"]
  },
  {
    id: 5,
    name: "Le Male Elixir",
    brand: "Jean Paul Gaultier",
    price: 329.00,
    gender: "Masculino",
    class: "Balada",
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=400",
    description: "Intenso e ardente, Le Male Elixir incendeia os sentidos com uma trilha sedutora e profunda.",
    ingredients: ["Baunilha", "Lavanda", "Hortelã"]
  },
  {
    id: 6,
    name: "Good Girl",
    brand: "Carolina Herrera",
    price: 369.00,
    gender: "Feminino",
    class: "Balada",
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=400",
    description: "É bom ser má. Uma fragrância poderosa e sensual para mulheres modernas e sofisticadas.",
    ingredients: ["Amêndoa", "Nardo", "Fava Tonka"]
  },
  {
    id: 7, // FEATURED ID
    name: "Oud Supremo",
    brand: "Nicho PR",
    price: 689.00,
    gender: "Unissex",
    class: "Noturno",
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=400",
    description: "O Oud Supremo não é apenas um perfume, é uma declaração de poder. Composto pelo raro óleo de Agarwood.",
    ingredients: ["Oud", "Agarwood", "Couro", "Especiarias"]
  },
  {
    id: 8,
    name: "Libre Le Parfum",
    brand: "Yves Saint Laurent",
    price: 399.00,
    gender: "Feminino",
    class: "Noturno",
    image: "https://images.unsplash.com/photo-1541643600914-783696329e8e?auto=format&fit=crop&q=80&w=400",
    description: "A fragrância da liberdade levada ao extremo. Agora mais intensa e luxuosa com o acorde de açafrão.",
    ingredients: ["Lavanda", "Flor de Laranjeira", "Açafrão"]
  },
  {
    id: 9,
    name: "Black Orchid",
    brand: "Tom Ford",
    price: 529.00,
    gender: "Unissex",
    class: "Noturno",
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=400",
    description: "Um perfume sensual e suntuoso, com acordes sombrios e uma poção atraente de orquídeas negras e especiarias.",
    ingredients: ["Orquídea Negra", "Trufa", "Patchouli"]
  },
  {
    id: 10,
    name: "J'adore",
    brand: "Dior",
    price: 349.00,
    gender: "Feminino",
    class: "Trabalho",
    image: "https://images.unsplash.com/photo-1583467875263-d50dec374661?auto=format&fit=crop&q=80&w=400",
    description: "O buquê de flores J'adore é uma composição inventada de todas as peças, como uma joia preciosa.",
    ingredients: ["Ylang-ylang", "Rosa Damascena", "Jasmim Sambac"]
  },

  // 11-30 (GRIFES POPULARES)
  { id: 11, name: "1 Million", brand: "Paco Rabanne", price: 289, gender: "Masculino", class: "Balada", image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=400", description: "O aroma da sedução e da riqueza.", ingredients: ["Mandarina", "Canela"] },
  { id: 12, name: "Invictus", brand: "Paco Rabanne", price: 279, gender: "Masculino", class: "Aquático", image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=400", description: "O perfume da vitória e do heroísmo.", ingredients: ["Toranja", "Folha de Louro"] },
  { id: 13, name: "Eros", brand: "Versace", price: 299, gender: "Masculino", class: "Balada", image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=400", description: "Amor, paixão e beleza.", ingredients: ["Hortelã", "Maçã Verde"] },
  { id: 14, name: "Acqua di Gio", brand: "Giorgio Armani", price: 319, gender: "Masculino", class: "Aquático", image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=400", description: "Um hino à natureza e ao mar.", ingredients: ["Lima", "Bergamota"] },
  { id: 15, name: "Light Blue", brand: "Dolce & Gabbana", price: 329, gender: "Feminino", class: "Aquático", image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=400", description: "Frescor mediterrâneo e alegria de viver.", ingredients: ["Limão Siciliano", "Maçã"] },
  { id: 16, name: "Coco Mademoiselle", brand: "Chanel", price: 429, gender: "Feminino", class: "Trabalho", image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=400", description: "A essência de uma mulher livre e cativante.", ingredients: ["Laranja", "Rosa", "Patchouli"] },
  { id: 17, name: "Miss Dior", brand: "Dior", price: 399, gender: "Feminino", class: "Trabalho", image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=400", description: "Um hino ao amor, símbolo da feminilidade Couture.", ingredients: ["Rosa de Grasse", "Peônia"] },
  { id: 18, name: "L'Interdit", brand: "Givenchy", price: 379, gender: "Feminino", class: "Noturno", image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=400", description: "O proibido é um convite.", ingredients: ["Flor de Laranjeira", "Tuberosa"] },
  { id: 19, name: "La Vie Est Belle", brand: "Lancôme", price: 359, gender: "Feminino", class: "Trabalho", image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=400", description: "A vida é bela para quem sabe viver.", ingredients: ["Íris", "Pralinê", "Baunilha"] },
  { id: 20, name: "212 VIP Black", brand: "Carolina Herrera", price: 309, gender: "Masculino", class: "Balada", image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=400", description: "Defina sua própria festa.", ingredients: ["Absinto", "Anis"] },
  { id: 21, name: "Spicebomb Extreme", brand: "Viktor&Rolf", price: 349, gender: "Masculino", class: "Noturno", image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=400", description: "Uma explosão de temperos e tabaco.", ingredients: ["Pimenta", "Cominho", "Tabaco"] },
  { id: 22, name: "Terre d'Hermès", brand: "Hermès", price: 339, gender: "Masculino", class: "Trabalho", image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=400", description: "Entre a terra e o céu.", ingredients: ["Laranja", "Flint", "Vetiver"] },
  { id: 23, name: "Stronger With You", brand: "Emporio Armani", price: 299, gender: "Masculino", class: "Noturno", image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=400", description: "Vive o presente e o amor.", ingredients: ["Cardamomo", "Pimenta Rosa"] },
  { id: 24, name: "Scandal", brand: "Jean Paul Gaultier", price: 389, gender: "Feminino", class: "Balada", image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=400", description: "O perfume das pernas para o ar.", ingredients: ["Mel", "Gardenia"] },
  { id: 25, name: "Olympéa", brand: "Paco Rabanne", price: 339, gender: "Feminino", class: "Balada", image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=400", description: "A deusa moderna das vitórias.", ingredients: ["Baunilha Salgada", "Jasmim Aquático"] },
  { id: 26, name: "Y Le Parfum", brand: "Yves Saint Laurent", price: 369, gender: "Masculino", class: "Trabalho", image: "https://images.apache.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=400", description: "Ouse saber por que.", ingredients: ["Maçã", "Gengibre", "Vetiver"] },
  { id: 27, name: "Phantom", brand: "Paco Rabanne", price: 319, gender: "Masculino", class: "Balada", image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=400", description: "Nova era, nova fragrância robótica.", ingredients: ["Lavanda", "Limão", "Baunilha"] },
  { id: 28, name: "Bad Boy", brand: "Carolina Herrera", price: 329, gender: "Masculino", class: "Balada", image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=400", description: "Um símbolo da masculinidade moderna.", ingredients: ["Pimenta Branca", "Cacau"] },
  { id: 29, name: "Lady Million", brand: "Paco Rabanne", price: 349, gender: "Feminino", class: "Balada", image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=400", description: "Ousada e radiante como um diamante.", ingredients: ["Framboesa", "Flor de Laranjeira"] },
  { id: 30, name: "Polo Blue", brand: "Ralph Lauren", price: 289, gender: "Masculino", class: "Aquático", image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=400", description: "A energia do mar e do céu azul.", ingredients: ["Vidro", "Manjericão"] },

  // 31-161 (EXPANSÃO AUTOMATIZADA - NICHOS E MAIS GRIFES)
  ...Array.from({ length: 131 }, (_, i) => {
    const brands = ["Tom Ford", "Kilian", "Creed", "Parfums de Marly", "Amouage", "Byredo", "Diptyque", "Penhaligon's", "Xerjoff", "Roja Parfums", "Nasomatto", "Le Labo", "Jo Malone", "Montale", "Mancera", "Hermès", "Prada", "Valentino", "Gucci", "Givenchy", "Bvlgari"];
    const classes = ["Aquático", "Noturno", "Balada", "Trabalho"];
    const genders = ["Masculino", "Feminino", "Unissex"];
    const brand = brands[i % brands.length];
    const category = classes[i % classes.length];
    const gender = genders[i % genders.length];
    const id = i + 31;
    
    // Gerar nomes de nicho fictícios mas realistas
    const nicheNouns = ["Velvet", "Oud", "Royal", "Midnight", "Golden", "Emerald", "Dark", "Sun", "Ocean", "Desert", "Moonlight", "Secret", "Lost", "Sacred"];
    const nicheAdverbs = ["Saffron", "Rose", "Amber", "Leather", "Silk", "Wood", "Tobacco", "Marine", "Mist", "Spirit", "Dreams", "Shadow"];
    const name = `${nicheNouns[i % nicheNouns.length]} ${nicheAdverbs[i % nicheAdverbs.length]}`;
    
    return {
      id: id,
      name: name,
      brand: brand,
      price: Math.floor(Math.random() * (700 - 250) + 250),
      gender: gender,
      class: category,
      image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=400",
      description: `Uma fragrância excepcional da casa ${brand}, explorando notas de ${nicheAdverbs[i % nicheAdverbs.length].toLowerCase()} em uma base de ${category.toLowerCase()}.`,
      ingredients: [nicheAdverbs[i % nicheAdverbs.length], "Sândalo", "Âmbar Gray"]
    };
  })
];
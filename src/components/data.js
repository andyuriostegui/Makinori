export const PRODUCTOS = [
  {
    id: 1, tag: "CHEF'S PICK", tagDark: false,
    nombre: "Philadelphia Roll", jp: "フィラデルフィア", precio: "$100",
    desc: "Ajonjolí por fuera, por dentro: Salmon, pepino y philadelphia.",
    badges: ["Fresco", "8 piezas"],
    ilu: "sashimi", foto: "/sushi1.png",
  },
  {
    id: 2, tag: "BEST SELLER", tagDark: true,
    nombre: "Dragon Roll", jp: "ドラゴンロール", precio: "$95",
    desc: "Aderezo tampico por fuera, por dentro: pepino, camarón, aguacate y philadelphia.",
    badges: ["🌶 Picante suave", "8 piezas"],
    ilu: "dragon", foto: "/sushi2.png",
  },
  {
    id: 3, tag: "NUEVO", tagDark: false,
    nombre: "Ramen Buldak Doble Picante", jp: "ブルダック", precio: "$100",
    desc: "Preparado con cebollín rallado, tocino, hongos, ajonjolí y zanahoria finamente picada.",
    badges: ["🔥 Muy picante", "Seco"],
    ilu: "ramen", foto: "/maki10.jpeg",
  },
  {
    id: 4, tag: null,
    nombre: "Snow Roll", jp: "スノーロール", precio: "$95",
    desc: "Cubierta de Philadelphia y ajonjolí por fuera, por dentro: Pepino, aguacate y surimi.",
    badges: ["Fresco", "8 piezas"],
    ilu: "nigiri", foto: "/maki4.jpeg",
  },
  {
    id: 5, tag: null,
    nombre: "Volcano Roll", jp: "ボルカノ", precio: "$95",
    desc: "Aderezo chipotle por fuera, por dentro: carne enchilada, tocino, philadelphia y chile.",
    badges: ["🌶 Picante", "8 piezas"],
    badgePicante: true,
    ilu: "temaki", foto: "/maki9.jpeg",
  },
  {
    id: 6, tag: null,
    nombre: "Mogu Mogu", jp: "もぐもぐ", precio: "$67",
    desc: "Bebida japonesa de fresa, lyche, piña, uva o blueberry. Refrescante y única.",
    badges: ["Bebida", "Importada"],
    ilu: "matcha", foto: "/maki11.jpeg",
  },
];

export const MENU_CATS = {
  frescos: {
    jp: "フレッシュロール",
    sub: "8 piezas por orden · Ingredientes frescos del día",
    items: [
      { nombre: "California Roll",   desc: "Ajonjolí por fuera, por dentro: pepino, aguacate, philadelphia y surimi.",                    precio: "$85"  },
      { nombre: "Veggi Roll",        desc: "Alga por fuera, por dentro: Pepino, aguacate, philadelphia y zanahoria.",                     precio: "$85"  },
      { nombre: "Tropical Roll",     desc: "Alga y salsa de anguila por fuera, por dentro: Pepino, piña, philadelphia y platano frito.",  precio: "$90"  },
      { nombre: "Snow Roll",         desc: "Cubierta de Philadelphia y ajonjolí por fuera, por dentro: Pepino, aguacate y surimi.",       precio: "$95"  },
      { nombre: "Almond Roll",       desc: "Nuez moscada y salsa de anguila por fuera, por dentro: Camarón tempura, piña y philadelphia.", precio: "$100" },
      { nombre: "Philadelphia Roll", desc: "Ajonjolí por fuera, por dentro: Salmon, pepino y philadelphia.",                              precio: "$100" },
      { nombre: "New York Roll",     desc: "Ajonjolí por fuera, por dentro: Salmon, surimi y aguacate.",                                  precio: "$100" },
    ],
  },
  empanizados: {
    jp: "エンパニサード",
    sub: "8 piezas por orden · Zanahoria o aderezo por fuera",
    items: [
      { nombre: "Empanizado Roll",   desc: "Zanahoria por fuera, por dentro: pepino, aguacate, philadelphia y surimi.",               precio: "$90" },
      { nombre: "Teriyaki Roll",     desc: "Zanahoria por fuera, por dentro: Pepino, aguacate, philadelphia y pollo teriyaki.",        precio: "$90" },
      { nombre: "Mar y Tierra Roll", desc: "Aderezo tampico por fuera, por dentro: pepino, camarón, aguacate y philadelphia.",         precio: "$95" },
      { nombre: "Miau Roll",         desc: "Aderezo tampico por fuera, por dentro: Pepino, pollo teriyaki, philadelphia y camarón.",   precio: "$95" },
      { nombre: "Chimmy Roll",       desc: "Salsa de anguila y tampico por fuera, por dentro: salami, carne molida y tocino.",         precio: "$95" },
      { nombre: "Volcano Roll",      desc: "Aderezo chipotle por fuera, por dentro: carne enchilada, tocino, philadelphia y chile.",   precio: "$95" },
      { nombre: "Ando Roll",         desc: "Aderezo chipotle por fuera, por dentro: Carne Enchilada, pollo y philadelphia.",           precio: "$95" },
      { nombre: "Arrachera Roll",    desc: "Zanahoria por fuera, por dentro: pepino, aguacate, philadelphia y arrachera.",             precio: "$95" },
      { nombre: "Burguer Roll",      desc: "Aderezo BBQ por fuera, por dentro: carne molida, queso manchego y tocino.",               precio: "$95" },
      { nombre: "Pizza Roll",        desc: "Aderezo spicy por fuera, por dentro: Salami, piña y queso manchego.",                     precio: "$95" },
    ],
  },
  ramen: {
    jp: "ラーメン",
    sub: "Seco o caldoso · $100 · Ingrediente extra $20",
    items: [
      { nombre: "Buldak Carbonara",         desc: "Preparada con queso philadelphia, queso amarillo, hongos, pollo y leche.",                       precio: "$100" },
      { nombre: "Buldak Queso Picante",     desc: "Preparada con queso philadelphia, queso amarillo, hongos, pollo y leche.",                       precio: "$100" },
      { nombre: "Buldak Picante",           desc: "Preparada con cebollín rallado, tocino, hongos, ajonjolí y zanahoria finamente picada.",         precio: "$100" },
      { nombre: "Buldak Doble Picante 🔥",  desc: "Preparada con cebollín rallado, tocino, hongos, ajonjolí y zanahoria finamente picada.",         precio: "$100" },
      { nombre: "Buldak Habanero y Limón",  desc: "Preparada con limón, hongos, salsa habanera y camarón.",                                         precio: "$100" },
      { nombre: "Kang Res con Vegetales",   desc: "Preparada con cebollín rallado, tocino, ajonjolí, hongos y zanahoria finamente picada.",         precio: "$100" },
      { nombre: "Kang Cerdo con Cebollín",  desc: "Preparada con cebollín rallado, tocino, ajonjolí, hongos y zanahoria finamente picada.",         precio: "$100" },
      { nombre: "Kang Res Picante",         desc: "Preparada con cebollín rallado, tocino, ajonjolí, hongos y zanahoria finamente picada.",         precio: "$100" },
      { nombre: "Kang Estofado de Ternera", desc: "Preparada con cebollín rallado, tocino, ajonjolí, hongos y zanahoria finamente picada.",         precio: "$100" },
      { nombre: "Kang Pollo y Hongo",       desc: "Preparada con cebollín rallado, tocino, ajonjolí, hongos y zanahoria finamente picada.",         precio: "$100" },
      { nombre: "Kang Camarón",             desc: "Preparada con cebollín rallado, camarón, ajonjolí, hongos y zanahoria finamente picada.",        precio: "$100" },
    ],
  },
  bebidas: {
    jp: "お飲み物",
    sub: "Bebidas frías, calientes y con alcohol",
    items: [
      { nombre: "Agua 1/2 Lt",              desc: "Agua natural.",                                                     precio: "$16"  },
      { nombre: "Agua 1 Lt",                desc: "Agua natural.",                                                     precio: "$22"  },
      { nombre: "Calpis 1/2 Lt",            desc: "Bebida láctea japonesa.",                                           precio: "$35"  },
      { nombre: "Calpis 1 Lt",              desc: "Bebida láctea japonesa.",                                           precio: "$60"  },
      { nombre: "Café Americano",           desc: "Con refill incluido.",                                              precio: "$50"  },
      { nombre: "Café Gourmet 17gr",        desc: "Café gourmet de especialidad.",                                     precio: "$65"  },
      { nombre: "Boing",                    desc: "Uva, fresa, guayaba, mango, naranja y manzana.",                    precio: "$27"  },
      { nombre: "Mogu Mogu",                desc: "Fresa, lyche, piña, uva, blueberry.",                              precio: "$67"  },
      { nombre: "Refresco",                 desc: "Coca cola, fanta, sidral, yoli, fresca.",                           precio: "$27"  },
      { nombre: "Ramunes",                  desc: "Naranja, Lyche, bluberry, piña, fresa, sandía.",                   precio: "$67"  },
      { nombre: "Cerveza Corona / Victoria",desc: "Cerveza nacional fría.",                                            precio: "$36"  },
      { nombre: "Cerveza Sapporo",          desc: "Importada japonesa.",                                               precio: "$80"  },
      { nombre: "Cerveza Lucky",            desc: "Importada.",                                                        precio: "$70"  },
      { nombre: "Cerveza Tsingtao",         desc: "Importada china.",                                                  precio: "$70"  },
      { nombre: "Sake Hide 350ml",          desc: "Sake importado.",                                                   precio: "$300" },
      { nombre: "Mojito",                   desc: "Cóctel clásico.",                                                   precio: "$75"  },
      { nombre: "Piña Colada",              desc: "Cóctel tropical.",                                                  precio: "$75"  },
      { nombre: "Cuba Libre",               desc: "Cóctel clásico.",                                                   precio: "$75"  },
      { nombre: "Clericot Copa",            desc: "Copa de clericot.",                                                 precio: "$80"  },
      { nombre: "Clericot Jarra",           desc: "Jarra de clericot.",                                               precio: "$250" },
      { nombre: "Hidromiel Rey Rurik Copa", desc: "Copa de hidromiel.",                                               precio: "$60"  },
      { nombre: "Hidromiel Rey Rurik Bot.", desc: "Botella de hidromiel.",                                             precio: "$80"  },
      { nombre: "Soyu",                     desc: "Fresa, uva, limón, toronja, durazno, cereza, natural.",            precio: "$120" },
    ],
  },
};

export const SNACKS = [
  { nombre: "Papiuxs",                desc: "Porción de 220 gr. Sazonados con los condimentos de la casa.",                               precio: "$45" },
  { nombre: "Aros de Cebolla",        desc: "10 aros crujientes de cebolla, acompañadas de nuestro aderezo chipotle.",                    precio: "$65" },
  { nombre: "Palomitas Mediana",      desc: "Mantequilla, queso cheddar o flaming hot, preparadas de manera natural.",                    precio: "$60" },
  { nombre: "Palomitas Grande",       desc: "Incluye 1 refill. Mantequilla, queso cheddar o flaming hot.",                               precio: "$80" },
  { nombre: "Kushiagues Queso",       desc: "3 Brochetas empanizadas rellenas de queso.",                                                precio: "$50" },
  { nombre: "Kushiagues Q+Plátano",  desc: "3 Brochetas empanizadas rellenas de queso y plátano.",                                      precio: "$50" },
  { nombre: "Kushiagues Q+Camarón",  desc: "3 Brochetas empanizadas rellenas de queso y camarón.",                                      precio: "$55" },
  { nombre: "Pops Camarón",           desc: "5 bolas de arroz rellenas de camarón y queso manchego, acompañadas de aderezo tampico.",    precio: "$65" },
  { nombre: "Pops Arrachera",         desc: "5 bolas de arroz rellenas de arrachera y queso manchego, acompañadas de aderezo tampico.",  precio: "$70" },
  { nombre: "Onigiri Furikake",       desc: "Rico triángulo de arroz con relleno de furikake.",                                          precio: "$25" },
  { nombre: "Onigiri Camarón+Tampico",desc: "Rico triángulo de arroz con camarón y aderezo tampico.",                                   precio: "$35" },
  { nombre: "Yakimeshi Pollo",        desc: "Arroz frito salteado con pollo y verduras.",                                                precio: "$65" },
  { nombre: "Yakimeshi Cerdo",        desc: "Arroz frito salteado con cerdo y verduras.",                                                precio: "$70" },
  { nombre: "Yakimeshi Camarón",      desc: "Arroz frito salteado con camarón y verduras.",                                              precio: "$80" },
  { nombre: "Yakimeshi Mixto",        desc: "Arroz frito salteado con pollo, cerdo, camarón y verduras.",                               precio: "$85" },
];

export const HORARIOS = [
  { dia: "Lunes – Viernes", hora: "13:00 – 22:00" },
  { dia: "Sábado",          hora: "12:00 – 23:00" },
  { dia: "Domingo",         hora: "12:00 – 20:00" },
];

export const CONTACTO = [
  { href: "tel:+527331002030",                label: "+52 733 100 2030"  },
  { href: "mailto:hola@makinori.mx",          label: "hola@makinori.mx" },
  { href: "https://instagram.com/makinorimx", label: "@makinorimx"      },
];

export const JP_CONCEPTS = [
  {
    kanji: "おもてなし", romaji: "Omotenashi", title: "Hospitalidad total",
    desc: "Más que servicio: es la devoción del itamae por anticipar cada necesidad del comensal antes de que la exprese. Cada visita a Maki Nori está impregnada de este espíritu.",
  },
  {
    kanji: "侘寂", romaji: "Wabi-sabi", title: "Belleza en lo imperfecto",
    desc: "La perfección de nuestros rollos no es geométrica sino intencional. Cada pieza, hecha a mano, lleva la huella del artesano: sencilla, auténtica y precisa.",
  },
  {
    kanji: "お任せ", romaji: "Omakase", title: "Lo dejo en tus manos",
    desc: "El nivel máximo de confianza en el chef. Al pedir omakase te dejas llevar: un menú degustación con los ingredientes más frescos del día, elegido para ti en el momento.",
  },
];
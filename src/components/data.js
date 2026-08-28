export const PRODUCTOS = [
  {
    id: 1, tag: "CHEF'S PICK", tagDark: false, featured: true,
    nombre: "Philadelphia Roll", jp: "フィラデルフィア", precio: "$100",
    desc: "Ajonjolí por fuera. Por dentro: salmón, pepino y philadelphia. El clásico de la casa.",
    badges: ["Fresco", "10 piezas", "Salmón"],
    ilu: "sashimi", foto: "/maki1.jpeg",
  },
  {
    id: 2, tag: "BEST SELLER", tagDark: true,
    nombre: "Mar y Tierra", jp: "海と陸", precio: "$95",
    desc: "Aderezo tampico por fuera. Pepino, camarón, aguacate y philadelphia por dentro.",
    badges: ["🌶 Picante suave", "10 piezas"],
    ilu: "dragon", foto: "/IMG_7027.jpg",
  },
  {
    id: 3, tag: "NUEVO", tagDark: false,
    nombre: "Yakimeshi", jp: "焼き飯", precio: "$85",
    desc: "Arroz frito salteado con cebollín, tocino, hongos, ajonjolí y zanahoria. Para compartir.",
    badges: ["Salteado", "Pollo · Cerdo · Mixto"],
    ilu: "ramen", foto: "/maki5.jpeg",
  },
  {
    id: 4, tag: "RAMEN", tagDark: true,
    nombre: "Ramen Buldak", jp: "プルダックラーメン", precio: "$100",
    desc: "Caldoso o seco. Cebollín, tocino, hongos, ajonjolí y el picante que aguantes.",
    badges: ["Caldoso o seco", "🔥 Picante"],
    badgePicante: true,
    ilu: "nigiri", foto: "/IMG_7129.jpg",
  },
  {
    id: 5, tag: "PICANTE", tagDark: false,
    nombre: "Volcano Roll", jp: "ボルカノ", precio: "$95",
    desc: "Aderezo chipotle por fuera. Carne enchilada, tocino, philadelphia y chile.",
    badges: ["🌶 Picante", "10 piezas"],
    badgePicante: true,
    ilu: "temaki", foto: "/IMG_6996.jpg",
  },
  {
    id: 6, tag: "BEBIDA", tagDark: true, wide: true,
    nombre: "Mogu Mogu", jp: "もぐもぐ", precio: "$67",
    desc: "Bebida japonesa de fresa, lychee, piña, uva o blueberry. Con nata de coco.",
    badges: ["Importada", "5 sabores"],
    ilu: "matcha", foto: "/bebida.jpeg",
  },
];

export const MENU_CATS = {
  frescos: {
    jp: "フレッシュロール",
    sub: "10 piezas por orden · Ingredientes frescos del día",
    items: [
      { nombre: "California Roll",   desc: "Ajonjolí por fuera, por dentro: pepino, aguacate, philadelphia y surimi.",                    precio: "$85",  foto: "/maki1.jpeg", popular: true },
      { nombre: "Veggi Roll",        desc: "Alga por fuera, por dentro: pepino, aguacate, philadelphia y zanahoria.",                     precio: "$85",  foto: "/IMG_7058.jpg" },
      { nombre: "Tropical Roll",     desc: "Alga y salsa de anguila por fuera, por dentro: pepino, piña, philadelphia y plátano frito.",  precio: "$90",  foto: "/maki7.jpeg" },
      { nombre: "Snow Roll",         desc: "Cubierta de philadelphia y ajonjolí por fuera, por dentro: pepino, aguacate y surimi.",       precio: "$95",  foto: "/maki10.jpeg" },
      { nombre: "Almond Roll",       desc: "Nuez moscada y salsa de anguila por fuera, por dentro: camarón tempura, piña y philadelphia.", precio: "$100", foto: "/IMG_7009.jpg", popular: true },
      { nombre: "Philadelphia Roll", desc: "Ajonjolí por fuera, por dentro: salmón, pepino y philadelphia.",                              precio: "$100", foto: "/maki1.jpeg", popular: true },
      { nombre: "New York Roll",     desc: "Ajonjolí por fuera, por dentro: salmón, surimi y aguacate.",                                  precio: "$100", foto: "/maki10.jpeg" },
    ],
  },
  empanizados: {
    jp: "エンパニサード",
    sub: "10 piezas por orden · Zanahoria o aderezo por fuera",
    items: [
      { nombre: "Empanizado Roll",   desc: "Zanahoria por fuera, por dentro: pepino, aguacate, philadelphia y surimi.",               precio: "$90", foto: "/IMG_6999.jpg" },
      { nombre: "Teriyaki Roll",     desc: "Zanahoria por fuera, por dentro: pepino, aguacate, philadelphia y pollo teriyaki.",        precio: "$90", foto: "/IMG_7006.jpg" },
      { nombre: "Mar y Tierra Roll", desc: "Aderezo tampico por fuera, por dentro: pepino, camarón, aguacate y philadelphia.",         precio: "$95", foto: "/IMG_7027.jpg", popular: true },
      { nombre: "Miau Roll",         desc: "Aderezo tampico por fuera, por dentro: pepino, pollo teriyaki, philadelphia y camarón.",   precio: "$95", foto: "/maki2.jpeg" },
      { nombre: "Chimmy Roll",       desc: "Salsa de anguila y tampico por fuera, por dentro: salami, carne molida y tocino.",         precio: "$95", foto: "/IMG_7047.jpg", popular: true },
      { nombre: "Volcano Roll",      desc: "Aderezo chipotle por fuera, por dentro: carne enchilada, tocino, philadelphia y chile.",   precio: "$95", foto: "/IMG_6996.jpg", popular: true },
      { nombre: "Ando Roll",         desc: "Aderezo chipotle por fuera, por dentro: carne enchilada, pollo y philadelphia.",           precio: "$95", foto: "/maki11.jpeg" },
      { nombre: "Arrachera Roll",    desc: "Zanahoria por fuera, por dentro: pepino, aguacate, philadelphia y arrachera.",             precio: "$95", foto: "/maki6.jpeg" },
      { nombre: "Burguer Roll",      desc: "Aderezo BBQ por fuera, por dentro: carne molida, queso manchego y tocino.",               precio: "$95", foto: "/maki11.jpeg" },
      { nombre: "Pizza Roll",        desc: "Aderezo spicy por fuera, por dentro: salami, piña y queso manchego.",                     precio: "$95", foto: "/maki2.jpeg" },
    ],
  },
  ramen: {
    jp: "ラーメン",
    sub: "Seco o caldoso · $100 · Ingrediente extra $20",
    items: [
      { nombre: "Buldak Carbonara",         desc: "Queso philadelphia, queso amarillo, hongos, pollo y leche. Cremosa y con carácter.",           precio: "$100", foto: "/IMG_7129.jpg", popular: true },
      { nombre: "Buldak Queso Picante",     desc: "Queso philadelphia, queso amarillo, hongos, pollo y leche. El picante que pega suave.",        precio: "$100", foto: "/IMG_7129.jpg" },
      { nombre: "Buldak Picante",           desc: "Cebollín, tocino, hongos, ajonjolí y zanahoria. Para paladares valientes.",                    precio: "$100", foto: "/maki4.jpeg" },
      { nombre: "Buldak Doble Picante 🔥",  desc: "La misma base, el doble de fuego. Trae servilleta y un Mogu Mogu cerca.",                      precio: "$100", foto: "/maki12.jpeg", popular: true },
      { nombre: "Buldak Habanero y Limón",  desc: "Limón, hongos, salsa habanera y camarón. Ácido, picante y con mar.",                           precio: "$100", foto: "/maki3.jpeg" },
      { nombre: "Kang Res con Vegetales",   desc: "Cebollín, tocino, ajonjolí, hongos y zanahoria. Caldo profundo de res.",                       precio: "$100", foto: "/IMG_7156.jpg", popular: true },
      { nombre: "Kang Cerdo con Cebollín",  desc: "Cebollín, tocino, ajonjolí, hongos y zanahoria. El favorito de los sábados.",                  precio: "$100", foto: "/maki4.jpeg" },
      { nombre: "Kang Res Picante",         desc: "La Kang de res con un extra de chile. Calienta la tarde.",                                    precio: "$100", foto: "/maki3.jpeg" },
      { nombre: "Kang Estofado de Ternera", desc: "Estofado lento, tocino, ajonjolí, hongos y zanahoria.",                                        precio: "$100", foto: "/IMG_7156.jpg" },
      { nombre: "Kang Pollo y Hongo",       desc: "Pollo, hongos, cebollín, tocino y ajonjolí. Más suave, igual de honesta.",                     precio: "$100", foto: "/ramen.png" },
      { nombre: "Kang Camarón",             desc: "Camarón, cebollín, ajonjolí, hongos y zanahoria. Marina y reconfortante.",                     precio: "$100", foto: "/maki12.jpeg" },
    ],
  },
  parrilla: {
    jp: "焼肉",
    sub: "A la parrilla · Al estilo coreano",
    items: [],
  },
  bebidas: {
    jp: "お飲み物",
    sub: "Bebidas frías, calientes y con alcohol",
    items: [
      { nombre: "Agua 1/2 Lt",              desc: "Agua natural.",                                                     precio: "$16"  },
      { nombre: "Agua 1 Lt",                desc: "Agua natural.",                                                     precio: "$22"  },
      { nombre: "Calpis 1/2 Lt",            desc: "Bebida láctea japonesa, suave y un poco dulce.",                    precio: "$35",  foto: "/bebida.jpeg" },
      { nombre: "Calpis 1 Lt",              desc: "Bebida láctea japonesa. Para compartir.",                           precio: "$60",  foto: "/bebida.jpeg" },
      { nombre: "Café Americano",           desc: "Con refill incluido.",                                              precio: "$50"  },
      { nombre: "Café Gourmet 17gr",        desc: "Café gourmet de especialidad.",                                     precio: "$65"  },
      { nombre: "Boing",                    desc: "Uva, fresa, guayaba, mango, naranja y manzana.",                    precio: "$27"  },
      { nombre: "Mogu Mogu",                desc: "Fresa, lychee, piña, uva o blueberry. Con nata de coco.",          precio: "$67",  foto: "/bebida.jpeg", popular: true },
      { nombre: "Refresco",                 desc: "Coca-Cola, Fanta, Sidral, Yoli, Fresca.",                           precio: "$27"  },
      { nombre: "Ramunes",                  desc: "Naranja, lychee, blueberry, piña, fresa, sandía. Con canica.",     precio: "$67",  foto: "/bebida.jpeg", popular: true },
      { nombre: "Cerveza Corona / Victoria",desc: "Cerveza nacional bien fría.",                                       precio: "$36",  foto: "/maki12.jpeg" },
      { nombre: "Cerveza Sapporo",          desc: "Importada japonesa.",                                               precio: "$80",  foto: "/IMG_7297.jpg" },
      { nombre: "Cerveza Lucky",            desc: "Importada. La etiqueta de Buda.",                                   precio: "$70",  foto: "/IMG_7293.jpg" },
      { nombre: "Cerveza Tsingtao",         desc: "Importada china.",                                                  precio: "$70",  foto: "/IMG_7297.jpg" },
      { nombre: "Sake Hide 350ml",          desc: "Sake importado. Para brindar en serio.",                            precio: "$300", foto: "/IMG_7289.jpg", popular: true },
      { nombre: "Mojito",                   desc: "Hierbabuena, limón y el clásico de la barra.",                      precio: "$75",  foto: "/IMG_7322.jpg" },
      { nombre: "Piña Colada",              desc: "Cremosa, tropical, de patio.",                                      precio: "$75",  foto: "/IMG_7334.jpg" },
      { nombre: "Cuba Libre",               desc: "Cóctel clásico.",                                                   precio: "$75",  foto: "/IMG_7318.jpg" },
      { nombre: "Clericot Copa",            desc: "Copa de clericot.",                                                 precio: "$80",  foto: "/IMG_7318.jpg" },
      { nombre: "Clericot Jarra",           desc: "Jarra de clericot. Para la mesa.",                                  precio: "$250", foto: "/IMG_7318.jpg" },
      { nombre: "Hidromiel Rey Rurik Copa", desc: "Copa de hidromiel artesanal.",                                      precio: "$60",  foto: "/IMG_7284.jpg" },
      { nombre: "Hidromiel Rey Rurik Bot.", desc: "Botella de hidromiel.",                                             precio: "$80",  foto: "/IMG_7284.jpg" },
      { nombre: "Soyu",                     desc: "Fresa, uva, limón, toronja, durazno, cereza o natural.",            precio: "$120", foto: "/IMG_7271.jpg", popular: true },
    ],
  },
};

export const SNACKS = [
  { nombre: "Papiuxs",                desc: "Porción de 220 gr. Sazonados con los condimentos de la casa.",                               precio: "$45" },
  { nombre: "Aros de Cebolla",        desc: "10 aros crujientes, con aderezo chipotle de la casa.",                                        precio: "$65", foto: "/IMG_7072.jpg", popular: true },
  { nombre: "Palomitas Mediana",      desc: "Mantequilla, queso cheddar o flaming hot.",                                                  precio: "$60", foto: "/IMG_7263.jpg" },
  { nombre: "Palomitas Grande",       desc: "Incluye 1 refill. Mantequilla, cheddar o flaming hot.",                                      precio: "$80", foto: "/IMG_7263.jpg" },
  { nombre: "Kushiagues Queso",       desc: "3 brochetas empanizadas rellenas de queso.",                                                 precio: "$50", foto: "/IMG_7094.jpg" },
  { nombre: "Kushiagues Q+Plátano",  desc: "3 brochetas empanizadas de queso y plátano.",                                                precio: "$50", foto: "/IMG_7094.jpg" },
  { nombre: "Kushiagues Q+Camarón",  desc: "3 brochetas empanizadas de queso y camarón.",                                                precio: "$55", foto: "/IMG_7094.jpg", popular: true },
  { nombre: "Pops Camarón",           desc: "5 bolas de arroz con camarón y manchego, aderezo tampico.",                                  precio: "$65", foto: "/maki11.jpeg", popular: true },
  { nombre: "Pops Arrachera",         desc: "5 bolas de arroz con arrachera y manchego, aderezo tampico.",                                precio: "$70", foto: "/maki11.jpeg" },
  { nombre: "Onigiri Furikake",       desc: "Triángulo de arroz con relleno de furikake.",                                                precio: "$25", foto: "/sushi1.png" },
  { nombre: "Onigiri Camarón+Tampico",desc: "Triángulo de arroz con camarón y aderezo tampico.",                                          precio: "$35", foto: "/sushi2.png" },
  { nombre: "Yakimeshi Pollo",        desc: "Arroz frito salteado con pollo y verduras.",                                                 precio: "$65", foto: "/maki5.jpeg" },
  { nombre: "Yakimeshi Cerdo",        desc: "Arroz frito salteado con cerdo y verduras.",                                                 precio: "$70", foto: "/maki5.jpeg" },
  { nombre: "Yakimeshi Camarón",      desc: "Arroz frito salteado con camarón y verduras.",                                               precio: "$80", foto: "/maki5.jpeg" },
  { nombre: "Yakimeshi Mixto",        desc: "Arroz frito con pollo, cerdo, camarón y verduras.",                                          precio: "$85", foto: "/maki5.jpeg", popular: true },
];

export const HORARIOS = [
  { dia: "Lunes – Viernes", hora: "10:00 – 21:00" },
  { dia: "Sábado",          hora: "11:00 – 21:00" },
  { dia: "Domingo",         hora: "11:00 – 21:00" },
];

export const WA_NUM = "527331598996";
export const WA_HREF = `https://wa.me/${WA_NUM}`;
export const waMsg = (text) => `${WA_HREF}?text=${encodeURIComponent(text)}`;
export const WA_PEDIDO = waMsg("Hola Maki Nori, quiero hacer un pedido 🍣");
export const WA_OMAKASE = waMsg("Hola Maki Nori, quiero que el chef arme un omakase. Mis preferencias (mariscos / vegetariano / picante / alergias): ");

export const CONTACTO = [
  { href: "tel:+527331598996",                              label: "+52 733 159 89 96" },
  { href: "mailto:hola@makinori.mx",                        label: "hola@makinori.mx" },
  { href: "https://www.instagram.com/sushi.makinori/",      label: "@sushi.makinori" },
];

export const GALERIA_FOTOS = [
  { src: "/IMG_7047.jpg", alt: "Roll empanizado",      span: 2 },
  { src: "/IMG_7058.jpg", alt: "Veggi Roll",           span: 1 },
  { src: "/IMG_7027.jpg", alt: "Mar y Tierra",         span: 1 },
  { src: "/IMG_7156.jpg", alt: "Ramen Kang",           span: 2 },
  { src: "/IMG_6996.jpg", alt: "Volcano Roll",         span: 1 },
  { src: "/IMG_7009.jpg", alt: "Almond Roll",          span: 1 },
  { src: "/IMG_7129.jpg", alt: "Buldak Carbonara",     span: 1 },
  { src: "/IMG_7094.jpg", alt: "Kushiagues",           span: 1 },
  { src: "/IMG_6999.jpg", alt: "Empanizado Roll",      span: 1 },
  { src: "/IMG_7072.jpg", alt: "Aros de cebolla",      span: 1 },
  { src: "/IMG_7006.jpg", alt: "Roll con zanahoria",   span: 1 },
  { src: "/IMG_7289.jpg", alt: "Sake Hide",            span: 1 },
  { src: "/IMG_7287.jpg", alt: "Sake Hide · casco",    span: 1 },
  { src: "/IMG_7271.jpg", alt: "Soju",                 span: 2 },
  { src: "/IMG_7322.jpg", alt: "Mojito",               span: 1 },
  { src: "/IMG_7334.jpg", alt: "Piña Colada",          span: 1 },
  { src: "/IMG_7318.jpg", alt: "Cóctel de la casa",    span: 1 },
  { src: "/IMG_7297.jpg", alt: "Tsingtao",             span: 1 },
  { src: "/IMG_7293.jpg", alt: "Buddha Beer",          span: 1 },
  { src: "/IMG_7284.jpg", alt: "Hidromiel Rey Rurik",  span: 1 },
  { src: "/IMG_7263.jpg", alt: "Palomitas",            span: 1 },
];

export const JP_CONCEPTS = [
  {
    kanji: "お任せ", romaji: "Omakase", title: "Lo dejo en tus manos",
    desc: "El nivel máximo de confianza en el chef. Al pedir omakase te dejas llevar: un menú degustación con los ingredientes más frescos del día, elegido para ti en el momento.",
  }
];
export interface Club {
  id: string;
  name: string;
  description: string;
  image: string;
}

export interface Burger {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

export const clubs: Club[] = [
  {
    id: "mess",
    name: "MESS",
    description:
      "Scène immersive et murs de LED : l'expérience club nouvelle génération",
    image: "/images/club-mess.webp",
  },
  {
    id: "le-duplex",
    name: "Le Duplex",
    description:
      "La plus grande boîte de nuit du Pays Basque avec DJs internationaux",
    image: "/images/club-le-duplex.webp",
  },
  {
    id: "carre-coast-biarritz",
    name: "Le Carré Coast",
    description:
      "Club tendance face à l'océan avec terrasse panoramique sur la côte",
    image: "/images/club-carre-coast.webp",
  },
  {
    id: "l-opium",
    name: "L'Opium",
    description:
      "Club mythique pour les noctambules en quête d'ambiance électrisante",
    image: "/images/club-l-opium.webp",
  },
];

export const burgers: Burger[] = [
  {
    id: "pink-burger",
    name: "Pink burger",
    description: "2 steaks 90g, bacon, 2 cheddar, sauce pink",
    price: 12,
    image: "/images/burger-pink-burger.webp",
  },
  {
    id: "pink-chicken",
    name: "Pink Chicken",
    description: "Poulet croustillant, cheddar, sauce pink",
    price: 10,
    image: "/images/burger-pink-chicken.webp",
  },
  {
    id: "pink-mc",
    name: "Pink mc",
    description: "2 steaks 45g, 2 cheddar, oignons, cornichons, sauce biggy",
    price: 9,
    image: "/images/burger-pink-mc.webp",
  },
  {
    id: "double-cheese",
    name: "Double cheese",
    description: "2 steaks 45g, cheddar, cornichons, sauce ketchup / moutarde douce",
    price: 8,
    image: "/images/burger-double-cheese.webp",
  },
];

export const getClub = (id: string | undefined) =>
  clubs.find((club) => club.id === id);

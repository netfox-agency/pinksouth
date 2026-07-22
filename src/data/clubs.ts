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
    id: "double-cheese",
    name: "Double cheese",
    description: "2 steak 45g, cheddar, ketchup, moutarde",
    price: 8,
    image: "/images/burger-double-cheese.webp",
  },
  {
    id: "big-mac",
    name: "Big Mac",
    description: "2 steak 45g, cheddar, sauce Big Mac",
    price: 9,
    image: "/images/burger-big-mac.webp",
  },
  {
    id: "big-cheese-steak",
    name: "Big cheese steak",
    description: "1 steak 90g, cheddar, sauce Big cheese",
    price: 10,
    image: "/images/burger-big-cheese-steak.webp",
  },
  {
    id: "big-cheese-poulet",
    name: "Big cheese poulet",
    description: "1 filet de poulet pane, cheddar, sauce Big cheese",
    price: 10,
    image: "/images/burger-big-cheese-poulet.webp",
  },
  {
    id: "180",
    name: "180",
    description: "1 steak 180g, double cheddar, sauce 180",
    price: 12,
    image: "/images/burger-180.webp",
  },
];

export const getClub = (id: string | undefined) =>
  clubs.find((club) => club.id === id);

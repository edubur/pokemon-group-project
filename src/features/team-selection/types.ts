export interface DetailsPageProps {
  params: { id: string };
}

export interface PokemonSprites {
  front_default: string;
  other: {
    dream_world: {
      front_default: string;
    };
  };
}

export interface Pokemon {
  id: number;
  name: string;
  sprites: PokemonSprites;
  url: string;
  image: string;
  types: { slot: number; type: { name: string } }[];
  abilities: { ability: { name: string }; is_hidden: boolean }[];
  stats: { base_stat: number; stat: { name: string } }[];
  moves: { move: { name: string } }[];
  height: number;
  weight: number;
}

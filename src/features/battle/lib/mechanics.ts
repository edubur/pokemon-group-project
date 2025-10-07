export const typeChart: { [key: string]: { [key: string]: number } } = {
  normal: { rock: 0.5, ghost: 0, steel: 0.5 },
  fire: {
    fire: 0.5,
    water: 0.5,
    grass: 2,
    ice: 2,
    bug: 2,
    rock: 0.5,
    dragon: 0.5,
    steel: 2,
  },
  water: { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
  electric: {
    water: 2,
    electric: 0.5,
    grass: 0.5,
    ground: 0,
    flying: 2,
    dragon: 0.5,
  },
  grass: {
    fire: 0.5,
    water: 2,
    grass: 0.5,
    poison: 0.5,
    ground: 2,
    flying: 0.5,
    bug: 0.5,
    rock: 2,
    dragon: 0.5,
    steel: 0.5,
  },
  ice: {
    fire: 0.5,
    water: 0.5,
    grass: 2,
    ice: 0.5,
    ground: 2,
    flying: 2,
    dragon: 2,
    steel: 0.5,
  },
  fighting: {
    normal: 2,
    ice: 2,
    poison: 0.5,
    flying: 0.5,
    psychic: 0.5,
    bug: 0.5,
    rock: 2,
    ghost: 0,
    dark: 2,
    steel: 2,
  },
  poison: {
    grass: 2,
    poison: 0.5,
    ground: 0.5,
    rock: 0.5,
    ghost: 0.5,
    steel: 0,
  },
  ground: {
    fire: 2,
    electric: 2,
    grass: 0.5,
    poison: 2,
    flying: 0,
    bug: 0.5,
    rock: 2,
    steel: 2,
  },
  flying: {
    electric: 0.5,
    grass: 2,
    fighting: 2,
    bug: 2,
    rock: 0.5,
    steel: 0.5,
  },
  psychic: { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
  bug: {
    fire: 0.5,
    grass: 2,
    fighting: 0.5,
    poison: 0.5,
    flying: 0.5,
    psychic: 2,
    ghost: 0.5,
    dark: 2,
    steel: 0.5,
  },
  rock: {
    fire: 2,
    ice: 2,
    fighting: 0.5,
    ground: 0.5,
    flying: 2,
    bug: 2,
    steel: 0.5,
  },
  ghost: { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
  dragon: { dragon: 2, steel: 0.5 },
  dark: { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5 },
  steel: { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5 },
};

// Calculates a Pokemons stat
export function calculateStat(
  base: number,
  level: number,
  statName: string
): number {
  if (statName === "hp") {
    return Math.floor((2 * base * level) / 100) + level + 10;
  }
  return Math.floor((2 * base * level) / 100) + 5;
}

// Calculates the damage for attacks
export function calculateDamage(
  level: number,
  move: any,
  attacker: any,
  defender: any
): { damage: number; effectiveness: string } {
  if (!move.power) {
    return { damage: 0, effectiveness: "normal" };
  }

  const attackStat =
    move.damage_class.name === "physical" ? "attack" : "special-attack";
  const defenseStat =
    move.damage_class.name === "physical" ? "defense" : "special-defense";

  const attack = attacker.stats.find((s: any) => s.name === attackStat).value;
  const defense = defender.stats.find((s: any) => s.name === defenseStat).value;

  let damage =
    (((2 * level) / 5 + 2) * move.power * (attack / defense)) / 50 + 2;

  // Calculates which Type is strong against another Type
  let multiplier = 1;
  for (const type of defender.types) {
    const effectiveness = typeChart[move.type.name]?.[type.type.name];
    if (effectiveness !== undefined) {
      multiplier *= effectiveness;
    }
  }

  damage *= multiplier;

  let effectiveness = "normal";
  if (multiplier > 1) {
    effectiveness = "super-effective";
  } else if (multiplier < 1 && multiplier > 0) {
    effectiveness = "not-very-effective";
  } else if (multiplier === 0) {
    effectiveness = "no-effect";
  }

  // Adds randomness
  damage *= Math.random() * (1.0 - 0.85) + 0.85;

  return { damage: Math.max(1, Math.floor(damage)), effectiveness };
}

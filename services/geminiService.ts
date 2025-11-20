import { RecruitProfile, ScoutCard } from "../types";

// Pre-defined data for offline functionality
const NICKNAMES = ["The Mountain Goat", "Raleigh Rocket", "The Ibex", "Summit Striker", "Cliffhanger", "Horned Hero", "Peak Performer", "The Crag"];
const ADVICE = [
  "CLIMB THE LEAGUE TABLE!",
  "HEADS UP, HORNS OUT!",
  "DEFEND LIKE A MOUNTAIN.",
  "KEEP THE SHAPE TIGHT.",
  "PASS AND MOVE, LIKE AN IBEX ON ROCKS.",
  "DOMINATE THE MIDFIELD!",
  "WATCH THE OFFSHIDE LINE.",
  "FULL PRESS!"
];
const CHANT_TEMPLATES = [
  "WE ARE IBEX, MIGHTY IBEX!\nFROM RALEIGH TO THE WORLD!",
  "GOATS ON TOP,\nWE NEVER STOP,\nIBEX FC ON THE BLOCK!",
  "RED, GOLD AND NAVY BLUE,\nIBEX FC WE LOVE YOU!",
  "OLE, OLE, OLE,\nIBEX ARE HERE TO STAY!"
];

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const generateScoutCard = async (profile: RecruitProfile): Promise<ScoutCard> => {
  await delay(1000);

  // Generate random stats based on position
  let baseSpeed = 50;
  let basePower = 50;
  let baseTech = 50;

  if (profile.position === 'Striker') { baseSpeed = 80; basePower = 75; baseTech = 70; }
  else if (profile.position === 'Defender') { baseSpeed = 60; basePower = 85; baseTech = 50; }
  else if (profile.position === 'Midfielder') { baseSpeed = 70; basePower = 60; baseTech = 85; }

  const randomOffset = () => Math.floor(Math.random() * 20) - 5;

  return {
    generated: true,
    nickname: NICKNAMES[Math.floor(Math.random() * NICKNAMES.length)],
    stats: {
      speed: Math.min(99, baseSpeed + randomOffset()),
      power: Math.min(99, basePower + randomOffset()),
      technique: Math.min(99, baseTech + randomOffset()),
    },
    description: `A solid recruit coming from ${profile.experience}. Styles their game on ${profile.favoritePlayer}. Ready to climb with the Ibex.`
  };
};

export const getTacticalAdvice = async (query: string): Promise<string> => {
  await delay(800);
  return ADVICE[Math.floor(Math.random() * ADVICE.length)];
};

export const generateKit = async (colors: string, style: string): Promise<string> => {
  await delay(1500);
  
  // Generate a simple SVG kit based on input
  const color1 = colors.split(' ')[0] || '#A62525'; // Default Ibex Red
  const color2 = colors.split(' ')[2] || '#D9A441'; // Default Ibex Gold
  
  // Create a data URI for the SVG
  const svgString = `
    <svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="400" fill="#050505"/>
      <!-- Shirt Body -->
      <path d="M100 80 L300 80 L300 350 L100 350 Z" fill="${color1}" stroke="white" stroke-width="4"/>
      <!-- Sleeves -->
      <path d="M100 80 L50 150 L80 170 L110 100" fill="${color1}" stroke="white" stroke-width="4"/>
      <path d="M300 80 L350 150 L320 170 L290 100" fill="${color1}" stroke="white" stroke-width="4"/>
      <!-- Pattern Text -->
      <text x="200" y="220" font-family="'Courier New', monospace" font-weight="bold" font-size="30" fill="${color2}" text-anchor="middle" transform="rotate(-10 200 220)">
        ${style.toUpperCase()}
      </text>
      <text x="200" y="140" font-family="sans-serif" font-size="20" fill="white" text-anchor="middle">IBEX</text>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${btoa(svgString)}`;
};

export const generateChant = async (opponent: string): Promise<string> => {
  await delay(600);
  const template = CHANT_TEMPLATES[Math.floor(Math.random() * CHANT_TEMPLATES.length)];
  return `(To the tune of an 8-bit anthem)\n\n${opponent.toUpperCase()} ARE SHAKING!\n${template}`;
};
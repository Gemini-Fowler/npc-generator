const races = [
  "Elf", "Dwarf", "Human", "Orc", "Halfling", "Gnome", "Tiefling", "Dragonborn",
  "Half-Orc", "Half-Elf", "Aasimar", "Air Genasi", "Earth Genasi", "Fire Genasi",
  "Water Genasi", "Bugbear", "Goblin", "Hobgoblin", "Kobold", "Lizardfolk",
  "Tabaxi", "Triton", "Yuan-ti Pureblood"
];

const classes = [
  "Wizard", "Rogue", "Cleric", "Fighter", "Ranger", "Paladin", "Bard", "Druid",
  "Monk", "Warlock", "Sorcerer", "Barbarian", "Artificer", "Blood Hunter",
  "Cavalier", "Samurai", "Gunslinger", "Mystic", "Warden", "Alchemist", "Archer",
  "Assassin", "Beastmaster", "Shadowdancer"
];

const backgrounds = [
  "Noble", "Soldier", "Criminal", "Merchant", "Sailor", "Hermit", "Folk Hero",
  "Acolyte", "Entertainer", "Guild Artisan", "Outlander", "Sage", "Urchin"
];

const levels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

const traits = {
  alignment: ["Lawful", "Neutral", "Chaotic"],
  social: ["Introvert", "Ambivert", "Extrovert"],
  outlook: ["Optimist", "Realist", "Cynic"]
};

const flaws = [
  "Greedy", "Arrogant", "Cowardly", "Impulsive", "Stubborn", "Lazy", "Jealous",
  "Vengeful", "Pessimistic", "Hot-tempered", "Gullible", "Overconfident",
  "Secretive", "Reckless", "Dishonest", "Selfish", "Naive", "Paranoid",
  "Materialistic", "Indecisive", "Aloof", "Melancholic", "Sarcastic",
  "Skeptical", "Timid", "Untrustworthy"
];

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateNPC() {
  return {
    race: getRandom(races),
    class: getRandom(classes),
    background: getRandom(backgrounds),
    level: getRandom(levels),
    personality: {
      alignment: getRandom(traits.alignment),
      social: getRandom(traits.social),
      outlook: getRandom(traits.outlook),
      flaw: getRandom(flaws)
    }
  };
}

document.getElementById("generateBtn").addEventListener("click", () => {
  const npc = generateNPC();
  const card = document.getElementById("npcCard");

  // Clear previous race class
  card.className = "npc-card";

  // Add race-based theme class (lowercase)
  const raceClass = npc.race.toLowerCase().replace(/\s+/g, '-');
  card.classList.add(raceClass);

  // Add animation class
  setTimeout(() => card.classList.add("show"), 50);

  card.innerHTML = `
    <h2>${npc.race} ${npc.class} (Level ${npc.level})</h2>
    <p><strong>Background:</strong> ${npc.background}</p>
    <p><strong>Personality:</strong> ${npc.personality.alignment}, ${npc.personality.social}, ${npc.personality.outlook}</p>
    <p><strong>Flaw:</strong> ${npc.personality.flaw}</p>
  `;
});

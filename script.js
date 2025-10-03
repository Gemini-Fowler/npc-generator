document.getElementById("generateBtn").addEventListener("click", () => {
  const races = ["Elf", "Dwarf", "Human", "Orc", "Halfling", "Gnome", "Tiefling", "Dragonborn", "Half-Orc", "Half-Elf", "Aasimar", "Air Genasi", "Earth Genasi", "Fire Genasi", "Water Genasi", "Bugbear", "Goblin", "Hobgoblin", "Kobold", "Lizardfolk", "Tabaxi", "Triton", "Yuan-ti Pureblood"];
  const classes = ["Wizard", "Rogue", "Cleric", "Fighter", "Ranger", "Paladin", "Bard", "Druid", "Monk", "Warlock", "Sorcerer", "Barbarian", "Artificer", "Blood Hunter", "Cavalier", "Samurai", "Gunslinger", "Mystic", "Warden", "Alchemist", "Archer", "Assassin", "Beastmaster", "Shadowdancer"];
  const traits = ["Optimist", "Cynic", "Introvert", "Extrovert"];
  const flaws = ["Greedy", "Arrogant", "Cowardly", "Impulsive", "Stubborn", "Lazy", "Jealous", "Vengeful", "Pessimistic", "Hot-tempered", "Gullible", "Overconfident", "Secretive", "Reckless", "Dishonest", "Selfish", "Naive", "Paranoid", "Materialistic", "Indecisive", "Aloof", "Melancholic", "Sarcastic", "Skeptical", "Timid", "Untrustworthy"];

  const npc = {
    race: races[Math.floor(Math.random() * races.length)],
    class: classes[Math.floor(Math.random() * classes.length)],
    trait: traits[Math.floor(Math.random() * traits.length)],
    flaw: flaws[Math.floor(Math.random() * flaws.length)]
  };

  document.getElementById("npcCard").innerHTML = `
    <h2>${npc.race} ${npc.class}</h2>
    <p>Personality: ${npc.trait}</p>
    <p>Flaw: ${npc.flaw}</p>
  `;
});

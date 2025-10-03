document.getElementById("generateBtn").addEventListener("click", () => {
  const races = ["Elf", "Dwarf", "Human", "Orc"];
  const classes = ["Wizard", "Rogue", "Cleric", "Fighter"];
  const traits = ["Optimist", "Cynic", "Introvert", "Extrovert"];

  const npc = {
    race: races[Math.floor(Math.random() * races.length)],
    class: classes[Math.floor(Math.random() * classes.length)],
    trait: traits[Math.floor(Math.random() * traits.length)]
  };

  document.getElementById("npcCard").innerHTML = `
    <h2>${npc.race} ${npc.class}</h2>
    <p>Personality: ${npc.trait}</p>
  `;
});

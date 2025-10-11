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

const levels = [1, 2, 3, 4, 5];

const traits = {
  alignment: ["Lawful", "Neutral", "Chaotic"],
  social: ["Introvert", "Ambivert", "Extrovert"],
  outlook: ["Optimist", "Realist", "Cynic"]
};

const morality = ["Evil", "Neutral", "Good"];

const flaws = [
  "Greedy", "Arrogant", "Cowardly", "Impulsive", "Stubborn", "Lazy", "Jealous",
  "Vengeful", "Pessimistic", "Hot-tempered", "Gullible", "Overconfident",
  "Secretive", "Reckless", "Dishonest", "Selfish", "Naive", "Paranoid",
  "Materialistic", "Indecisive", "Aloof", "Melancholic", "Sarcastic",
  "Skeptical", "Timid", "Untrustworthy"
];

const quirks = [
  "Always speaks in rhyme", "Collects shiny rocks", "Talks to their pet like it's a person",
  "Obsessed with tea rituals", "Carries a mysterious locked box", "Laughs at inappropriate times",
  "Refuses to wear shoes", "Writes everything in a tiny notebook", "Has an imaginary friend",
  "Thinks they're being followed", "Only eats food in pairs", "Talks to plants",
  "Believes they're royalty", "Wears a mask at all times", "Is convinced they're cursed",
  "Sings instead of speaking", "Carries a rubber duck for luck", "Is terrified of birds",
  "Refuses to say their real name", "Always offers unsolicited advice"
];

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getSliderValue(id, options) {
  const index = parseInt(document.getElementById(id).value);
  return options[index];
}

function populateDropdown(id, options) {
  const select = document.getElementById(id);
  options.forEach(opt => {
    const option = document.createElement("option");
    option.value = opt;
    option.textContent = opt;
    select.appendChild(option);
  });
}

populateDropdown("raceSelect", races);
populateDropdown("classSelect", classes);

["alignmentSlider", "moralitySlider", "socialSlider", "outlookSlider"].forEach(id => {
  document.getElementById(id).addEventListener("input", () => {
    const labelId = id.replace("Slider", "Value");
    const options = id === "moralitySlider" ? morality : traits[id.replace("Slider", "")];
    document.getElementById(labelId).textContent = options[parseInt(document.getElementById(id).value)];
  });
});

function generateNPC(custom = {}) {
  return {
    race: custom.race || getRandom(races),
    class: custom.class || getRandom(classes),
    background: getRandom(backgrounds),
    level: getRandom(levels),
    personality: {
      alignment: getRandom(traits.alignment) + " " + getRandom(morality),
      social: getRandom(traits.social),
      outlook: getRandom(traits.outlook),
      flaw: getRandom(flaws)
    },
    quirk: getRandom(quirks)
  };
}

function displayNPC(npc) {
  const card = document.getElementById("npcCard");
  card.className = "npc-card";

  const raceClass = npc.race.toLowerCase().replace(/\s+/g, '-');
  const classTheme = npc.class.toLowerCase().replace(/\s+/g, '-');
  card.classList.add(raceClass, classTheme, "animate");

  setTimeout(() => {
    card.classList.add("show");
    card.classList.remove("animate");
  }, 600);

  card.innerHTML = `
    <h2>${npc.race} ${npc.class} (Level ${npc.level})</h2>
    <p><strong>Background:</strong> ${npc.background}</p>
    <p><strong>Personality:</strong> ${npc.personality.alignment}, ${npc.personality.social}, ${npc.personality.outlook}</p>
    <p><strong>Flaw:</strong> ${npc.personality.flaw}</p>
    <p><strong>Quirk:</strong> ${npc.quirk}</p>
  `;
}

document.getElementById("generateBtn").addEventListener("click", () => {
  const npc = generateNPC();
  displayNPC(npc);
});

document.getElementById("saveBtn").addEventListener("click", () => {
  const npc = document.getElementById("npcCard").innerText;
  let savedNPCs = JSON.parse(localStorage.getItem("savedNPCs")) || [];
  savedNPCs.push(npc);
  localStorage.setItem("savedNPCs", JSON.stringify(savedNPCs));
  alert("NPC saved!");
});

document.getElementById("exportBtn").addEventListener("click", () => {
  const npc = generateNPC();
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(npc, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", "npc.json");
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
});

document.getElementById("buildBtn").addEventListener("click", () => {
  const race = document.getElementById("raceSelect").value;
  const classType = document.getElementById("classSelect").value;

  const alignment = getSliderValue("alignmentSlider", traits.alignment);
  const moralityValue = getSliderValue("moralitySlider", morality);
  const social = getSliderValue("socialSlider", traits.social);
  const outlook = getSliderValue("outlookSlider", traits.outlook);

  const npc = {
    race: race || getRandom(races),
    class: classType || getRandom(classes),
    background: getRandom(backgrounds),
    level: getRandom(levels),
    personality: {
      alignment: `${alignment} ${moralityValue}`,
      social: social,
      outlook: outlook,
      flaw: getRandom(flaws)
    },
    quirk: getRandom(quirks)
  };

  displayNPC(npc);
});

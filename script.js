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

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

async function fetchOptions(endpoint) {
  const res = await fetch(`https://www.dnd5eapi.co/api/${endpoint}`);
  const data = await res.json();
  return data.results.map(item => capitalize(item.name));
}

// curated extras to ensure dropdowns have plenty of options
const extraRaces = [
  "Aarakocra", "Aasimar", "Bugbear", "Centaur", "Changeling", "Kobold",
  "Lizardfolk", "Locathah", "Minotaur", "Satyr", "Shifter", "Simic Hybrid",
  "Tortle", "Vedalken", "Warforged", "Yuan-Ti", "Firbolg", "Triton",
  "Goliath", "Hobgoblin", "Kenku", "Tabaxi", "Goblin", "Orc",
  "Fey", "Undead", "Dragonborn", "Halfling", "Dwarf", "Elf"
];

const extraClasses = [
  "Artificer", "Blood Hunter", "Psion", "Mystic", "Witch", "Gunslinger",
  "Warlord", "Alchemist", "Inquisitor", "Arcanist", "Shaman", "Summoner",
  "Spellblade", "Battlemaster", "Scout", "Hexblade", "Templar", "Engineer",
  "Beastmaster", "Cavalier", "Samurai", "Oracle", "Sage", "Ritualist",
  "Wardens"
];

function padOptions(options, min, extras = []) {
  const set = new Set(options.map(o => capitalize(o)));
  // add extras first
  for (let e of extras) {
    if (set.size >= min) break;
    set.add(capitalize(e));
  }
  // if still short, add generic variants
  let counter = 1;
  while (set.size < min) {
    set.add(`Variant ${counter}`);
    counter++;
  }
  return Array.from(set);
}

async function getCachedOptions(key, endpoint, padTo = 0, extras = []) {
  const cached = localStorage.getItem(key);
  if (cached) return JSON.parse(cached);

  let options = await fetchOptions(endpoint);
  if (padTo > 0) options = padOptions(options, padTo, extras);
  localStorage.setItem(key, JSON.stringify(options));
  return options;
}

function populateDropdown(id, options) {
  const select = document.getElementById(id);
  select.innerHTML = ""; // Clear existing options
  options.forEach(opt => {
    const option = document.createElement("option");
    option.value = opt;
    option.textContent = opt;
    select.appendChild(option);
  });
}

async function populateAllDropdowns() {
  const raceOptions = await getCachedOptions("raceList", "races", 25, extraRaces);
  const classOptions = await getCachedOptions("classList", "classes", 25, extraClasses);
  populateDropdown("raceSelect", raceOptions);
  populateDropdown("classSelect", classOptions);
}

populateAllDropdowns();

["alignmentSlider", "moralitySlider", "socialSlider", "outlookSlider"].forEach(id => {
  document.getElementById(id).addEventListener("input", () => {
    const labelId = id.replace("Slider", "Value");
    const options = id === "moralitySlider" ? morality : traits[id.replace("Slider", "")];
    document.getElementById(labelId).textContent = options[parseInt(document.getElementById(id).value)];
  });
});

async function generateNPC(custom = {}) {
  const raceList = await getCachedOptions("raceList", "races");
  const classList = await getCachedOptions("classList", "classes");

  return {
    race: custom.race || getRandom(raceList),
    class: custom.class || getRandom(classList),
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

// Keep the last displayed NPC object for QR/export/save use
let currentNPC = null;

function generateQRCode(data) {
  const qrContainer = document.getElementById("qrCode");
  qrContainer.innerHTML = ""; // Clear previous QR
  const qr = document.createElement("img");
  const encoded = encodeURIComponent(JSON.stringify(data));
  qr.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encoded}`;
  qr.alt = "NPC QR Code";
  qrContainer.appendChild(qr);
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

  // attach campaign and notes if present
  if (npc.campaign) {
    const c = document.createElement('p');
    c.innerHTML = `<strong>Campaign:</strong> ${npc.campaign}`;
    card.appendChild(c);
  }
  if (npc.notes) {
    const n = document.createElement('p');
    n.innerHTML = `<strong>Session Notes:</strong> ${npc.notes}`;
    card.appendChild(n);
  }

  // store the last displayed NPC for other actions
  currentNPC = npc;
}

document.getElementById("generateBtn").addEventListener("click", async () => {
  const npc = await generateNPC();
  displayNPC(npc);
});

document.getElementById("saveBtn").addEventListener("click", () => {
  // Save the currently displayed NPC, including campaign and notes
  const npcText = document.getElementById("npcCard").innerText;
  if (!npcText) return alert("Generate or build an NPC first.");
  const campaign = document.getElementById("campaignInput")?.value.trim() || "Unassigned";
  const notes = document.getElementById("notesInput")?.value.trim() || "";

  let savedNPCs = JSON.parse(localStorage.getItem("savedNPCs")) || [];
  savedNPCs.push({ text: npcText, campaign, notes });
  localStorage.setItem("savedNPCs", JSON.stringify(savedNPCs));
  updateCampaignFilter();
  displaySavedNPCs(document.getElementById("campaignFilter")?.value || "");
  alert("NPC saved!");
});

document.getElementById("exportBtn").addEventListener("click", async () => {
  const npc = await generateNPC();
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(npc, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", "npc.json");
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
});

document.getElementById("buildBtn").addEventListener("click", async () => {
  const race = document.getElementById("raceSelect").value;
  const classType = document.getElementById("classSelect").value;
  const campaign = document.getElementById("campaignInput")?.value.trim();
  const notes = document.getElementById("notesInput")?.value.trim();

  const alignment = getSliderValue("alignmentSlider", traits.alignment);
  const moralityValue = getSliderValue("moralitySlider", morality);
  const social = getSliderValue("socialSlider", traits.social);
  const outlook = getSliderValue("outlookSlider", traits.outlook);

  const npc = {
    race: race || getRandom(await getCachedOptions("raceList", "races")),
    class: classType || getRandom(await getCachedOptions("classList", "classes")),
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

  // attach campaign and notes when building a custom NPC
  if (campaign) npc.campaign = campaign;
  if (notes) npc.notes = notes;

  // set current NPC so other actions (QR/export/save) can use it
  currentNPC = npc;

  displayNPC(npc);
});

// QR generation button
document.getElementById("qrBtn").addEventListener("click", () => {
  if (!currentNPC) return alert("Generate or build an NPC first.");
  // pass the full object so QR decodes to JSON
  generateQRCode(currentNPC);
});

document.getElementById("refreshDataBtn")?.addEventListener("click", async () => {
  localStorage.removeItem("raceList");
  localStorage.removeItem("classList");
  await populateAllDropdowns();
  alert("Race and class data refreshed!");
});

// Campaign filter & saved list UI functions
function updateCampaignFilter() {
  const saved = JSON.parse(localStorage.getItem("savedNPCs")) || [];
  const campaigns = [...new Set(saved.map(npc => npc.campaign))];
  const filter = document.getElementById("campaignFilter");
  if (!filter) return;
  filter.innerHTML = '<option value="">All</option>';
  campaigns.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c;
    filter.appendChild(opt);
  });
}

function displaySavedNPCs(filter = "") {
  const list = document.getElementById("savedList");
  if (!list) return;
  list.innerHTML = "";
  const saved = JSON.parse(localStorage.getItem("savedNPCs")) || [];
  saved
    .filter(npc => !filter || npc.campaign === filter)
    .forEach(npc => {
      const li = document.createElement("li");
      li.textContent = `[${npc.campaign}] ${npc.text}`;
      if (npc.notes) {
        const notes = document.createElement("p");
        notes.textContent = `📝 ${npc.notes}`;
        notes.style.fontStyle = "italic";
        li.appendChild(notes);
      }
      list.appendChild(li);
    });
}

document.getElementById("campaignFilter")?.addEventListener("change", e => {
  displaySavedNPCs(e.target.value);
});

// initialize saved list and filters on load
updateCampaignFilter();
displaySavedNPCs();

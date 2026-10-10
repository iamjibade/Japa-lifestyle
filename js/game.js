“use strict”;

const SAVE_KEY = “japaLifestyleWorldAlpha_v2”;
const FUND_GOAL = 1000000;
const TRAVEL_ENERGY = 10;

const cities = {
lagos: {
name: “Lagos”,
icon: “🌆”,
mood: “The hustle is real. Keep moving.”,
description: “Fast-paced streets, big dreams, and plenty of ways to make a move.”,
status: “The Hustle”,
image: “images/cities/lagos.jpg”,
locations: [
{
id: “home”,
name: “Home”,
icon: “🏠”,
type: “Rest”,
description: “Your base. Recover energy and plan the day.”,
jobs: []
},
{
id: “market”,
name: “Balogun Market”,
icon: “🛍️”,
type: “Trade”,
description: “A busy market where a sharp mind can find opportunity.”,
jobs: [
{
id: “market-run”,
title: “Help a market trader”,
description: “Sort and deliver a small order nearby.”,
pay: 6500,
energy: 12,
xp: 10,
rep: 1
}
]
},
{
id: “tech”,
name: “Yaba Tech Hub”,
icon: “💻”,
type: “Tech”,
description: “Ideas, laptops, and people building the next big thing.”,
jobs: [
{
id: “web-fix”,
title: “Fix a small website issue”,
description: “Help a small business update its web page.”,
pay: 10000,
energy: 18,
xp: 20,
rep: 2
}
]
},
{
id: “transport”,
name: “Ojota Bus Stop”,
icon: “🚌”,
type: “Transport”,
description: “A lively transport link with people going everywhere.”,
jobs: [
{
id: “dispatch”,
title: “Assist with dispatch”,
description: “Help coordinate a local delivery run.”,
pay: 7500,
energy: 16,
xp: 12,
rep: 1
}
]
},
{
id: “food”,
name: “Street Food Corner”,
icon: “🍲”,
type: “Food”,
description: “Grab a bite, reset your energy, and keep going.”,
jobs: [
{
id: “food-support”,
title: “Help a food vendor”,
description: “Assist during a busy service period.”,
pay: 5500,
energy: 10,
xp: 9,
rep: 1
}
]
},
{
id: “business”,
name: “Victoria Island”,
icon: “🏢”,
type: “Business”,
description: “Meet professionals and look for the next opportunity.”,
jobs: [
{
id: “client-pitch”,
title: “Prepare a client pitch”,
description: “Help a small team prepare a simple proposal.”,
pay: 12000,
energy: 20,
xp: 24,
rep: 3
}
]
}
]
},

abuja: {
    name: "Abuja",
    icon: "🏛️",
    mood: "Plan smart. Move with purpose.",
    description: "A city of offices, calm avenues, and opportunities for organised minds.",
    status: "The Capital",
    image: "images/cities/abuja.jpg",
    locations: [
        {
            id: "abuja-home",
            name: "Wuse Apartment",
            icon: "🏠",
            type: "Rest",
            description: "Your Abuja base. Take a moment to recover.",
            jobs: []
        },
        {
            id: "abuja-business",
            name: "Central Business District",
            icon: "🏢",
            type: "Business",
            description: "Professional connections and office-based opportunities.",
            jobs: [
                {
                    id: "office-support",
                    title: "Help an office team",
                    description: "Organise a small task list and update records.",
                    pay: 10500,
                    energy: 17,
                    xp: 19,
                    rep: 2
                }
            ]
        },
        {
            id: "abuja-market",
            name: "Wuse Market",
            icon: "🛍️",
            type: "Trade",
            description: "A busy shopping area with plenty of activity.",
            jobs: [
                {
                    id: "abuja-market-run",
                    title: "Support a local seller",
                    description: "Help prepare and organise customer orders.",
                    pay: 7000,
                    energy: 12,
                    xp: 11,
                    rep: 1
                }
            ]
        },
        {
            id: "abuja-tech",
            name: "Innovation Space",
            icon: "💻",
            type: "Tech",
            description: "Work on practical digital solutions.",
            jobs: [
                {
                    id: "digital-task",
                    title: "Complete a digital task",
                    description: "Help a small organisation with a web update.",
                    pay: 11500,
                    energy: 18,
                    xp: 22,
                    rep: 2
                }
            ]
        }
    ]
},
ibadan: {
    name: "Ibadan",
    icon: "🌇",
    mood: "Steady progress is still progress.",
    description: "A city with deep roots, student energy, and room to grow.",
    status: "The Red City",
    image: "images/cities/ibadan.jpg",
    locations: [
        {
            id: "ibadan-home",
            name: "Family House",
            icon: "🏠",
            type: "Rest",
            description: "Rest up before your next task.",
            jobs: []
        },
        {
            id: "ibadan-market",
            name: "Bodija Market",
            icon: "🛍️",
            type: "Trade",
            description: "A busy market with local businesses to support.",
            jobs: [
                {
                    id: "bodija-help",
                    title: "Help a market stall",
                    description: "Organise goods and help with customer requests.",
                    pay: 6000,
                    energy: 12,
                    xp: 10,
                    rep: 1
                }
            ]
        },
        {
            id: "ibadan-tech",
            name: "Student Tech Corner",
            icon: "💻",
            type: "Tech",
            description: "Learn, build, and share ideas with other creators.",
            jobs: [
                {
                    id: "student-site",
                    title: "Update a student website",
                    description: "Make a simple content update for a local group.",
                    pay: 8500,
                    energy: 15,
                    xp: 18,
                    rep: 2
                }
            ]
        },
        {
            id: "ibadan-transport",
            name: "Challenge Bus Park",
            icon: "🚌",
            type: "Transport",
            description: "A busy transport hub connecting people and places.",
            jobs: [
                {
                    id: "ibadan-dispatch",
                    title: "Coordinate a pickup",
                    description: "Help a local business organise a pickup.",
                    pay: 6500,
                    energy: 13,
                    xp: 11,
                    rep: 1
                }
            ]
        }
    ]
},
"port-harcourt": {
    name: "Port Harcourt",
    icon: "🌴",
    mood: "Stay sharp. Build your network.",
    description: "A lively riverside city where practical skills can open doors.",
    status: "The Garden City",
    image: "images/cities/port-harcourt.jpg",
    locations: [
        {
            id: "ph-home",
            name: "Rumuola Home",
            icon: "🏠",
            type: "Rest",
            description: "Recharge and plan your next move.",
            jobs: []
        },
        {
            id: "ph-business",
            name: "GRA Business Strip",
            icon: "🏢",
            type: "Business",
            description: "Connect with small businesses and service providers.",
            jobs: [
                {
                    id: "ph-records",
                    title: "Organise business records",
                    description: "Help a small team tidy up its customer records.",
                    pay: 9500,
                    energy: 16,
                    xp: 17,
                    rep: 2
                }
            ]
        },
        {
            id: "ph-market",
            name: "Mile 1 Market",
            icon: "🛍️",
            type: "Trade",
            description: "Support a local seller and earn your keep.",
            jobs: [
                {
                    id: "mile-one",
                    title: "Help prepare orders",
                    description: "Sort items for customers and nearby deliveries.",
                    pay: 7000,
                    energy: 13,
                    xp: 11,
                    rep: 1
                }
            ]
        },
        {
            id: "ph-transport",
            name: "Waterfront Link",
            icon: "🚐",
            type: "Transport",
            description: "Help keep a local movement plan on track.",
            jobs: [
                {
                    id: "ph-route",
                    title: "Plan a delivery route",
                    description: "Arrange stops for a small delivery run.",
                    pay: 8000,
                    energy: 15,
                    xp: 14,
                    rep: 2
                }
            ]
        }
    ]
},
"benin-city": {
    name: "Benin City",
    icon: "🏺",
    mood: "Respect your roots. Create your path.",
    description: "A proud cultural city with local trade and creative possibilities.",
    status: "The Heart of Edo",
    image: "images/cities/benin-city.jpg",
    locations: [
        {
            id: "benin-home",
            name: "GRA Residence",
            icon: "🏠",
            type: "Rest",
            description: "Take a break and prepare for the next challenge.",
            jobs: []
        },
        {
            id: "benin-market",
            name: "Oba Market",
            icon: "🛍️",
            type: "Trade",
            description: "A lively market where local enterprise thrives.",
            jobs: [
                {
                    id: "oba-orders",
                    title: "Help a trader organise orders",
                    description: "Sort products and assist with a customer list.",
                    pay: 6200,
                    energy: 12,
                    xp: 10,
                    rep: 1
                }
            ]
        },
        {
            id: "benin-tech",
            name: "Creative Tech Desk",
            icon: "💻",
            type: "Tech",
            description: "Use your digital skills to solve a practical problem.",
            jobs: [
                {
                    id: "benin-web",
                    title: "Create a simple web update",
                    description: "Update information for a community project.",
                    pay: 9000,
                    energy: 16,
                    xp: 19,
                    rep: 2
                }
            ]
        },
        {
            id: "benin-business",
            name: "City Business Corner",
            icon: "🏢",
            type: "Business",
            description: "Build connections with people growing local businesses.",
            jobs: [
                {
                    id: "benin-client",
                    title: "Prepare a business flyer",
                    description: "Help a small business prepare a promo flyer brief.",
                    pay: 8500,
                    energy: 14,
                    xp: 16,
                    rep: 2
                }
            ]
        }
    ]
},
onitsha: {
    name: "Onitsha",
    icon: "🚢",
    mood: "Trade smart. Think ahead.",
    description: "A commercial powerhouse full of movement, trade, and ambition.",
    status: "The Trade Hub",
    image: "images/cities/onitsha.jpg",
    locations: [
        {
            id: "onitsha-home",
            name: "GRA Home",
            icon: "🏠",
            type: "Rest",
            description: "Rest and get ready for a new day.",
            jobs: []
        },
        {
            id: "onitsha-market",
            name: "Main Market",
            icon: "🛍️",
            type: "Trade",
            description: "A major commercial centre with many moving parts.",
            jobs: [
                {
                    id: "main-market",
                    title: "Support a shop owner",
                    description: "Help organise stock and a customer order list.",
                    pay: 8000,
                    energy: 15,
                    xp: 13,
                    rep: 2
                }
            ]
        },
        {
            id: "onitsha-transport",
            name: "River Transport Link",
            icon: "🚚",
            type: "Transport",
            description: "Coordinate movement and keep plans organised.",
            jobs: [
                {
                    id: "river-route",
                    title: "Organise a delivery route",
                    description: "Plan a practical route for local orders.",
                    pay: 8500,
                    energy: 15,
                    xp: 15,
                    rep: 2
                }
            ]
        },
        {
            id: "onitsha-tech",
            name: "Digital Services Desk",
            icon: "💻",
            type: "Tech",
            description: "Help a business take a step into the digital space.",
            jobs: [
                {
                    id: "onitsha-digital",
                    title: "Help a shop go digital",
                    description: "Organise product details for an online catalogue.",
                    pay: 10000,
                    energy: 17,
                    xp: 20,
                    rep: 2
                }
            ]
        }
    ]
}

};

const characters = {
lagos: [
{ name: “Tomi”, role: “Junior developer”, icon: “👩🏽‍💻”, line: “Keep learning. One good project can open a door.” },
{ name: “Chuka”, role: “Dispatch coordinator”, icon: “🧑🏽‍💼”, line: “Planning the route saves time and stress.” },
{ name: “Aunty Bisi”, role: “Market trader”, icon: “👩🏾‍🍳”, line: “Treat people well and they will remember you.” }
],

abuja: [
    { name: "Zainab", role: "Project assistant", icon: "👩🏽‍💼", line: "Be organised. People trust people who follow through." },
    { name: "Musa", role: "Small business owner", icon: "🧑🏾‍💼", line: "A clear plan makes a hard task feel possible." },
    { name: "Nneka", role: "Digital creator", icon: "👩🏾‍💻", line: "Your skills grow each time you use them." }
],
ibadan: [
    { name: "Tunde", role: "Student entrepreneur", icon: "🧑🏽‍🎓", line: "Start small, but start with intention." },
    { name: "Kemi", role: "Shop manager", icon: "👩🏽‍💼", line: "Consistency is more powerful than one big day." },
    { name: "Seyi", role: "Web designer", icon: "🧑🏾‍💻", line: "Build a portfolio that shows what you can do." }
],
"port-harcourt": [
    { name: "Amaka", role: "Operations lead", icon: "👩🏾‍💼", line: "Communication keeps the whole team moving." },
    { name: "Dumo", role: "Local entrepreneur", icon: "🧑🏿‍💼", line: "Know your costs before you make a promise." },
    { name: "Ebi", role: "Creative freelancer", icon: "👩🏽‍🎨", line: "Good work and a good attitude travel together." }
],
"benin-city": [
    { name: "Osas", role: "Creative designer", icon: "🧑🏽‍🎨", line: "Let your work tell a clear story." },
    { name: "Efe", role: "Business owner", icon: "👩🏾‍💼", line: "A strong reputation is built one promise at a time." },
    { name: "Omoregie", role: "Tech learner", icon: "🧑🏾‍💻", line: "Ask questions and keep practising." }
],
onitsha: [
    { name: "Chidi", role: "Trader", icon: "🧑🏿‍💼", line: "Keep your records straight and your customers informed." },
    { name: "Ada", role: "Online seller", icon: "👩🏽‍💻", line: "Digital tools can help a small shop reach more people." },
    { name: "Ifeanyi", role: "Logistics planner", icon: "🧑🏾‍🚚", line: "Every good delivery starts with a realistic plan." }
]

};

function createNewGame() {
return {
cash: 25000,
energy: 100,
reputation: 0,
xp: 0,
japaFund: 0,
day: 1,
currentCity: “lagos”,
currentLocation: “home”,
completedJobs: [],
talkedTo: [],
missions: [],
logs: [],
missionSequence: 1
};
}

let game = createNewGame();
let messageTimer = null;

function money(amount) {
return new Intl.NumberFormat(“en-NG”, {
style: “currency”,
currency: “NGN”,
maximumFractionDigits: 0
}).format(Math.max(0, Math.round(amount)));
}

function getCity() {
return cities[game.currentCity] || cities.lagos;
}

function getLocation() {
const city = getCity();

return city.locations.find(location => location.id === game.currentLocation)
    || city.locations[0];

}

function setText(id, value) {
const element = document.getElementById(id);

if (element) {
    element.textContent = value;
}

}

function showMessage(message, type = “”) {
const box = document.getElementById(“message”);

if (!box) return;
box.textContent = message;
box.className = `message${type ? ` ${type}` : ""}`;
if (messageTimer) {
    clearTimeout(messageTimer);
}
messageTimer = setTimeout(() => {
    box.className = "message";
}, 4200);

}

function saveGame(showFeedback = false) {
try {
localStorage.setItem(SAVE_KEY, JSON.stringify(game));

    if (showFeedback) {
        showMessage("Your progress has been saved on this device.", "success");
    }
} catch (error) {
    console.warn("Could not save game:", error);
    if (showFeedback) {
        showMessage("Could not save progress in this browser.", "error");
    }
}

}

function loadGame() {
try {
const saved = localStorage.getItem(SAVE_KEY);

    if (!saved) return false;
    const data = JSON.parse(saved);
    if (!data || typeof data !== "object") return false;
    game = { ...createNewGame(), ...data };
    if (!cities[game.currentCity]) {
        game.currentCity = "lagos";
    }
    const validLocation = getCity().locations.some(
        location => location.id === game.currentLocation
    );
    if (!validLocation) {
        game.currentLocation = getCity().locations[0].id;
    }
    game.cash = Math.max(0, Number(game.cash) || 0);
    game.energy = Math.min(100, Math.max(0, Number(game.energy) || 0));
    game.reputation = Math.max(0, Number(game.reputation) || 0);
    game.xp = Math.max(0, Number(game.xp) || 0);
    game.japaFund = Math.min(FUND_GOAL, Math.max(0, Number(game.japaFund) || 0));
    game.day = Math.max(1, Number(game.day) || 1);
    return true;
} catch (error) {
    console.warn("Could not load saved game:", error);
    return false;
}

}

function log(message) {
game.logs.unshift({
day: game.day,
message
});

game.logs = game.logs.slice(0, 30);
saveGame();
renderLog();

}

function renderCityTheme() {
const city = getCity();

document.documentElement.dataset.theme = game.currentCity;
setText("mapTitle", `${city.name} City Map`);
setText("cityMood", city.mood);
setText("cityStatus", `● ${city.status}`);
document.title = `Japa Lifestyle — ${city.name}`;

}

function renderCityCards() {
const container = document.getElementById(“cityCards”);

if (!container) return;
container.innerHTML = "";
Object.entries(cities).forEach(([id, city]) => {
    const card = document.createElement("button");
    const isCurrent = game.currentCity === id;
    card.type = "button";
    card.className = `city-card${isCurrent ? " active" : ""}`;
    card.style.setProperty("--city-image", `url("${city.image}")`);
    card.setAttribute("aria-pressed", String(isCurrent));
    card.innerHTML = `
        <div class="city-card-top">
            <span class="city-card-icon">${city.icon}</span>
            <span class="city-card-badge">
                ${isCurrent ? "CURRENT CITY" : "EXPLORE"}
            </span>
        </div>
        <h3>${city.name}</h3>
        <p>${city.description}</p>
        <span class="city-card-action">
            ${isCurrent ? "You're here ✓" : "Travel here →"}
            <span>${isCurrent ? "" : "10 ⚡"}</span>
        </span>
    `;
    card.addEventListener("click", () => {
        if (isCurrent) {
            showMessage(`You're already in ${city.name}. Explore its locations.`);
            return;
        }
        travelToCity(id);
    });
    container.appendChild(card);
});

}

function renderStats() {
setText(“cash”, money(game.cash));
setText(“energy”, ${game.energy}%);
setText(“reputation”, String(game.reputation));
setText(“xp”, ${game.xp} XP);
setText(“day”, String(game.day));
setText(“fundAmount”, money(game.japaFund));

const energyBar = document.getElementById("energyBar");
if (energyBar) {
    energyBar.style.width = `${game.energy}%`;
    energyBar.style.background = game.energy < 25
        ? "var(--danger)"
        : "var(--success)";
}
const progress = Math.min(100, (game.japaFund / FUND_GOAL) * 100);
const fundProgress = document.getElementById("fundProgress");
if (fundProgress) {
    fundProgress.style.width = `${progress}%`;
}
setText("fundPercent", `${Math.floor(progress)}% of your goal`);
const saveButton = document.getElementById("saveButton");
if (saveButton) {
    saveButton.disabled = game.cash < 5000 || game.japaFund >= FUND_GOAL;
}
const restButton = document.getElementById("restButton");
if (restButton) {
    restButton.disabled = game.energy >= 100;
}

}

function makeButton(label, className, onClick) {
const button = document.createElement(“button”);

button.type = "button";
button.className = className;
button.textContent = label;
button.addEventListener("click", onClick);
return button;

}

function renderMap() {
const map = document.getElementById(“cityMap”);

if (!map) return;
map.innerHTML = "";
getCity().locations.forEach(location => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `place${game.currentLocation === location.id ? " active" : ""}`;
    button.setAttribute("aria-pressed", String(game.currentLocation === location.id));
    button.innerHTML = `
        <span class="place-icon">${location.icon}</span>
        <strong>${location.name}</strong>
        <small>${location.type}</small>
    `;
    button.addEventListener("click", () => moveToLocation(location.id));
    map.appendChild(button);
});

}

function renderLocation() {
const location = getLocation();

setText("currentLocationName", location.name);
setText("locationDescription", location.description);
const panel = document.getElementById("locationPanel");
if (!panel) return;
panel.innerHTML = "";
if (location.type === "Rest") {
    panel.appendChild(
        makeButton("Rest here (+25 energy)", "button button-secondary", () => rest(25))
    );
    panel.appendChild(
        makeButton("Save progress", "button button-ghost", () => saveGame(true))
    );
    return;
}
const availableJobs = location.jobs.filter(
    job => !game.completedJobs.includes(`${game.currentCity}:${job.id}`)
);
if (!availableJobs.length) {
    const note = document.createElement("p");
    note.className = "muted";
    note.textContent = "You've completed the available task here. Explore another location or city.";
    panel.appendChild(note);
    return;
}
availableJobs.forEach(job => {
    const wrapper = document.createElement("div");
    wrapper.className = "opportunity-item";
    wrapper.innerHTML = `
        <strong>${job.title}</strong>
        <p>${job.description}</p>
        <div class="reward-row">
            <span class="reward-tag">${money(job.pay)} · +${job.xp} XP</span>
        </div>
    `;
    const button = makeButton(
        "Accept & complete task",
        "button button-primary",
        () => completeJob(job)
    );
    button.style.marginTop = "10px";
    button.style.width = "100%";
    wrapper.appendChild(button);
    panel.appendChild(wrapper);
});

}

function renderAvailableJobs() {
const target = document.getElementById(“opportunity”);

if (!target) return;
const jobs = getCity().locations
    .flatMap(location => location.jobs.map(job => ({
        ...job,
        locationName: location.name,
        locationId: location.id
    })))
    .filter(job => !game.completedJobs.includes(`${game.currentCity}:${job.id}`))
    .slice(0, 3);
target.innerHTML = "";
if (!jobs.length) {
    target.innerHTML = `
        <div class="empty-state">
            You've completed the listed opportunities in ${getCity().name}.
            Travel to another city to discover new tasks.
        </div>
    `;
    return;
}
jobs.forEach(job => {
    const item = document.createElement("div");
    item.className = "opportunity-item";
    item.innerHTML = `
        <strong>${job.title}</strong>
        <p>${job.locationName} · ${job.description}</p>
        <div class="reward-row">
            <span class="reward-tag">${money(job.pay)} · +${job.xp} XP</span>
        </div>
    `;
    const button = makeButton("Go to task", "button button-secondary", () => {
        moveToLocation(job.locationId);
        document.getElementById("locationPanel")?.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });
    });
    button.style.marginTop = "10px";
    item.appendChild(button);
    target.appendChild(item);
});

}

function renderNPCs() {
const target = document.getElementById(“npcs”);

if (!target) return;
target.innerHTML = "";
(characters[game.currentCity] || []).forEach(person => {
    const key = `${game.currentCity}:${person.name}`;
    const alreadyTalked = game.talkedTo.includes(key);
    const card = document.createElement("div");
    card.className = "npc-card";
    const avatar = document.createElement("div");
    avatar.className = "npc-avatar";
    avatar.textContent = person.icon;
    const info = document.createElement("div");
    info.className = "npc-info";
    const name = document.createElement("strong");
    name.textContent = person.name;
    const role = document.createElement("small");
    role.textContent = person.role;
    info.append(name, role);
    const button = makeButton(
        alreadyTalked ? "Chatted ✓" : "Talk",
        `button ${alreadyTalked ? "button-ghost" : "button-secondary"}`,
        () => talkTo(person, key)
    );
    button.disabled = alreadyTalked;
    card.append(avatar, info, button);
    target.appendChild(card);
});

}

function renderMissions() {
const target = document.getElementById(“missions”);

if (!target) return;
target.innerHTML = "";
const activeMissions = game.missions.filter(mission => !mission.completed);
if (!activeMissions.length) {
    target.innerHTML = `
        <div class="empty-state">
            No active missions yet. Complete a task or talk to someone to begin.
        </div>
    `;
    return;
}
activeMissions.forEach(mission => {
    const card = document.createElement("div");
    card.className = "mission-card";
    const top = document.createElement("div");
    top.className = "mission-top";
    const heading = document.createElement("div");
    const title = document.createElement("h3");
    title.textContent = mission.title;
    const description = document.createElement("p");
    description.textContent = mission.description;
    heading.append(title, description);
    const reward = document.createElement("span");
    reward.className = "mission-reward";
    reward.textContent = `+${mission.rewardXp} XP`;
    top.append(heading, reward);
    const button = makeButton(
        "Complete mission",
        "button button-primary",
        () => completeMission(mission.id)
    );
    card.append(top, button);
    target.appendChild(card);
});

}

function renderLog() {
const target = document.getElementById(“journeyLog”);

if (!target) return;
target.innerHTML = "";
if (!game.logs.length) {
    const item = document.createElement("li");
    item.textContent = "Your story starts here. Explore a city and make your first move.";
    target.appendChild(item);
    return;
}
game.logs.slice(0, 10).forEach(entry => {
    const item = document.createElement("li");
    const day = document.createElement("span");
    day.className = "log-time";
    day.textContent = `DAY ${entry.day}`;
    const text = document.createElement("span");
    text.textContent = entry.message;
    item.append(day, text);
    target.appendChild(item);
});

}

function spendEnergy(amount) {
if (game.energy < amount) {
showMessage(“You’re low on energy. Rest before taking on more tasks.”, “error”);
return false;
}

game.energy -= amount;
return true;

}

function moveToLocation(locationId) {
const location = getCity().locations.find(item => item.id === locationId);

if (!location) return;
if (game.currentLocation === locationId) {
    showMessage(`You're already at ${location.name}.`);
    return;
}
if (!spendEnergy(3)) return;
game.currentLocation = locationId;
log(`You travelled to ${location.name} in ${getCity().name}.`);
showMessage(`You arrived at ${location.name}.`, "success");
render();

}

function travelToCity(cityId) {
const city = cities[cityId];

if (!city) return;
if (game.energy < TRAVEL_ENERGY) {
    showMessage("You need at least 10 energy to travel. Rest first.", "error");
    return;
}
game.energy -= TRAVEL_ENERGY;
game.currentCity = cityId;
game.currentLocation = city.locations[0].id;
log(`You travelled to ${city.name}. A new chapter begins.`);
showMessage(`Welcome to ${city.name}! Explore and find opportunities.`, "success");
render();

}

function completeJob(job) {
const key = ${game.currentCity}:${job.id};

if (game.completedJobs.includes(key)) {
    showMessage("You've already completed this task in this city.", "error");
    return;
}
if (!spendEnergy(job.energy)) return;
game.cash += job.pay;
game.xp += job.xp;
game.reputation += job.rep;
game.completedJobs.push(key);
game.missions.unshift({
    id: game.missionSequence++,
    title: `Reflect on: ${job.title}`,
    description: "Review what went well, then complete this mission for bonus experience.",
    rewardXp: 5,
    completed: false
});
log(`Completed "${job.title}" in ${getCity().name}: earned ${money(job.pay)}, +${job.xp} XP, and +${job.rep} reputation.`);
showMessage(`Nice work! You earned ${money(job.pay)}.`, "success");
render();

}

function talkTo(person, key) {
if (game.talkedTo.includes(key)) return;

game.talkedTo.push(key);
game.reputation += 1;
game.xp += 3;
log(`You spoke with ${person.name} (${person.role}) in ${getCity().name}. "${person.line}"`);
showMessage(`${person.name}: “${person.line}” (+3 XP, +1 reputation)`, "success");
render();

}

function completeMission(id) {
const mission = game.missions.find(item => item.id === id && !item.completed);

if (!mission) return;
mission.completed = true;
game.xp += mission.rewardXp;
game.reputation += 1;
log(`Mission completed: ${mission.title}. Bonus +${mission.rewardXp} XP and +1 reputation.`);
showMessage("Mission complete. Keep building your story!", "success");
render();

}

function saveToFund() {
if (game.japaFund >= FUND_GOAL) {
showMessage(“You’ve reached your fictional Japa Fund goal. Great work!”, “success”);
return;
}

if (game.cash < 5000) {
    showMessage("You need at least ₦5,000 cash to save that amount.", "error");
    return;
}
const amount = Math.min(5000, game.cash, FUND_GOAL - game.japaFund);
game.cash -= amount;
game.japaFund += amount;
log(`You saved ${money(amount)} in your fictional Japa Fund.`);
showMessage(`You saved ${money(amount)}. Small steps add up!`, "success");
render();

}

function rest(amount = 40) {
if (game.energy >= 100) {
showMessage(“Your energy is already full. You’re ready to go!”, “success”);
return;
}

const before = game.energy;
game.energy = Math.min(100, game.energy + amount);
const gained = game.energy - before;
game.day += 1;
log(`You rested and recovered ${gained} energy. It's now Day ${game.day}.`);
showMessage(`You recovered ${gained} energy. A new day, a fresh start.`, "success");
render();

}

function resetGame() {
const confirmed = window.confirm(
“Start a new game? This will erase your saved Japa Lifestyle progress on this device.”
);

if (!confirmed) return;
game = createNewGame();
game.logs.push({
    day: 1,
    message: "A new journey begins in Lagos. Make your first move!"
});
saveGame();
render();
showMessage("New game started. Welcome to Lagos!", "success");

}

function render() {
renderCityTheme();
renderCityCards();
renderStats();
renderMap();
renderLocation();
renderAvailableJobs();
renderNPCs();
renderMissions();
renderLog();

saveGame();

}

function initialise() {
const hadSave = loadGame();

if (!hadSave) {
    game.logs.push({
        day: 1,
        message: "Welcome to Japa Lifestyle. Your story starts in Lagos."
    });
}
document.getElementById("saveButton")
    ?.addEventListener("click", saveToFund);
document.getElementById("restButton")
    ?.addEventListener("click", () => rest(40));
document.getElementById("resetButton")
    ?.addEventListener("click", resetGame);
document.getElementById("clearLogButton")
    ?.addEventListener("click", () => {
        game.logs = [];
        saveGame();
        renderLog();
        showMessage("Journey log cleared.", "success");
    });
render();

}

document.addEventListener(“DOMContentLoaded”, initialise);

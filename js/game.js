const game = {

    cash: 25000,
    energy: 100,
    reputation: 0,
    xp: 0,
    japaFund: 0,
    day: 1,

    currentLocation: "home",

    missions: [],

    logs: []
};


const SAVE_KEY = "japaLifestyleSave";

// Save the current game to the browser
function saveGame() {
    try {
        localStorage.setItem(
            SAVE_KEY,
            JSON.stringify(game)
        );

        showMessage("Game progress saved!");

    } catch (error) {
        console.error("Could not save game:", error);
        showMessage("Unable to save. Check your browser settings.");
    }
}

// Load a previous save, if one exists
function loadGame() {
    try {
        const savedGame = localStorage.getItem(SAVE_KEY);

        if (!savedGame) {
            return false;
        }

        const parsedGame = JSON.parse(savedGame);

        // Basic validation before restoring the save
        if (
            typeof parsedGame !== "object" ||
            parsedGame === null ||
            !Number.isFinite(parsedGame.cash) ||
            !Number.isFinite(parsedGame.energy) ||
            !locations[parsedGame.currentLocation] ||
            !Array.isArray(parsedGame.missions) ||
            !Array.isArray(parsedGame.logs)
        ) {
            throw new Error("Invalid save data");
        }

        // Restore saved values into the existing game object
        Object.assign(game, parsedGame);

        return true;

    } catch (error) {
        console.error("Could not load saved game:", error);
        showMessage("The saved game could not be loaded.");
        return false;
    }
}
/* =========================
   CITY LOCATIONS
========================= */

const locations = {

    home: {
        name: "Home",
        icon: "🏠",
        description:
            "Your base. Rest, plan your day and manage your Japa fund."
    },

    market: {
        name: "Balogun Market",
        icon: "🛍️",
        description:
            "A busy trading area where sourcing and selling opportunities appear.",
        npc: "Mama Bisi",

        jobs: [
            {
                title: "Source 5 items for a trader",
                reward: 8500,
                energy: 18,
                xp: 25
            }
        ]
    },

    tech: {
        name: "Tech Hub",
        icon: "💻",
        description:
            "Developers, freelancers and businesses look for digital services here.",
        npc: "Tunde",

        jobs: [
            {
                title: "Fix a business landing page",
                reward: 14000,
                energy: 22,
                xp: 30
            },

            {
                title: "Create a product listing",
                reward: 8000,
                energy: 15,
                xp: 20
            }
        ]
    },

    transport: {
        name: "Transport Park",
        icon: "🚌",
        description:
            "Drivers, dispatch riders and logistics clients exchange jobs here.",
        npc: "Emeka",

        jobs: [
            {
                title: "Deliver a document across town",
                reward: 7500,
                energy: 18,
                xp: 25
            },

            {
                title: "Move a small parcel",
                reward: 9500,
                energy: 20,
                xp: 28
            }
        ]
    },

    food: {
        name: "Food Street",
        icon: "🍲",
        description:
            "Food vendors serve workers and occasionally need extra hands.",
        npc: "Aunty Kemi",

        jobs: [
            {
                title: "Help with a lunch order",
                reward: 6500,
                energy: 15,
                xp: 20
            },

            {
                title: "Deliver catering packs",
                reward: 9000,
                energy: 18,
                xp: 25
            }
        ]
    },

    business: {
        name: "Business District",
        icon: "🏢",
        description:
            "Companies post higher-value professional contracts here.",
        npc: "Sarah",

        jobs: [
            {
                title: "Prepare a company proposal",
                reward: 16000,
                energy: 25,
                xp: 35
            },

            {
                title: "Organise client data",
                reward: 12000,
                energy: 20,
                xp: 28
            }
        ]
    }
};


/* =========================
   NPCs
========================= */

const npcs = {

    "Mama Bisi": {
        icon: "👩🏾",
        role: "Trader",
        text:
            "I need reliable people who can source items quickly."
    },

    "Tunde": {
        icon: "🧑🏾‍💻",
        role: "Developer",
        text:
            "Small businesses need digital help every day."
    },

    "Emeka": {
        icon: "🧑🏾",
        role: "Logistics",
        text:
            "If you are dependable, there is always a delivery."
    },

    "Aunty Kemi": {
        icon: "👩🏾‍🍳",
        role: "Food vendor",
        text:
            "Good service brings repeat customers."
    },

    "Sarah": {
        icon: "👩🏾‍💼",
        role: "Business consultant",
        text:
            "Professional clients pay more, but they expect quality."
    }
};


/* =========================
   HELPERS
========================= */

function money(amount) {

    return "₦" + Math.round(amount).toLocaleString("en-NG");

}


function log(message) {

    game.logs.unshift(
        `Day ${game.day} — ${message}`
    );

    game.logs =
        game.logs.slice(0, 10);

}


function spendEnergy(amount) {

    if (game.energy < amount) {

        showMessage(
            "You don't have enough energy. Rest first."
        );

        return false;
    }

    game.energy -= amount;

    return true;
}


function showMessage(message) {

    document.getElementById(
        "message"
    ).textContent = message;

}


/* =========================
   RENDER MAP
========================= */

function renderMap() {

    const map =
        document.getElementById("cityMap");

    map.innerHTML = "";

    Object.entries(locations).forEach(
        ([id, location]) => {

            const button =
                document.createElement("button");

            button.className =
                "place";

            if (
                game.currentLocation === id
            ) {
                button.classList.add("active");
            }

            button.innerHTML = `
                <span class="place-icon">
                    ${location.icon}
                </span>

                <span class="place-name">
                    ${location.name}
                </span>

                <span class="place-small">
                    ${
                        game.currentLocation === id
                        ? "YOU ARE HERE"
                        : "Visit location"
                    }
                </span>
            `;

            button.onclick = () =>
                travelTo(id);

            map.appendChild(button);

        }
    );
}


/* =========================
   TRAVEL
========================= */

function travelTo(locationId) {

    if (
        game.currentLocation ===
        locationId
    ) {
        return;
    }

    if (!spendEnergy(5)) {
        return;
    }

    game.currentLocation =
        locationId;

    log(
        `Travelled to ${locations[locationId].name}.`
    );

    render();

}


/* =========================
   LOCATION PANEL
========================= */

function renderLocation() {

    const location =
        locations[game.currentLocation];

    document.getElementById(
        "locationText"
    ).textContent =
        `You are at ${location.name}.`;

    document.getElementById(
        "locationPanel"
    ).innerHTML = `

        <div class="location-title">

            ${location.icon}
            ${location.name}

        </div>

        <div class="location-description">

            ${location.description}

        </div>

    `;

}


/* =========================
   NPC SYSTEM
========================= */

function renderNPCs() {

    const location =
        locations[game.currentLocation];

    const container =
        document.getElementById("npcs");

    if (!location.npc) {

        container.innerHTML = `
            <p class="muted">
                No NPCs are currently available here.
            </p>
        `;

        return;
    }

    const npc =
        npcs[location.npc];

    container.innerHTML = `

        <div class="npc-card">

            <div class="npc-info">

                <div class="npc-avatar">
                    ${npc.icon}
                </div>

                <div>

                    <strong>
                        ${location.npc}
                    </strong>

                    <div class="npc-role">
                        ${npc.role}
                    </div>

                </div>

            </div>

            <button
                class="secondary-button"
                onclick="talkToNPC()"
            >
                Talk
            </button>

        </div>

    `;


    document.getElementById(
        "opportunity"
    ).innerHTML = `

        <div class="stat-card">

            <strong>
                ${location.npc}
            </strong>

            <p class="muted">
                ${npc.text}
            </p>

        </div>

    `;
}


/* =========================
   TALK TO NPC
========================= */

function talkToNPC() {

    const npc =
        locations[
            game.currentLocation
        ].npc;

    game.reputation += 2;

    game.day++;

    log(
        `You spoke with ${npc}. Reputation +2.`
    );

    showMessage(
        `${npc} appreciated the conversation.`
    );

    render();

}


/* =========================
   MISSIONS
========================= */

function renderAvailableJobs() {

    const location =
        locations[game.currentLocation];

    if (!location.jobs) {
        return;
    }

    const locationPanel =
        document.getElementById(
            "locationPanel"
        );

    const jobsHTML =
        location.jobs.map(
            (job, index) => `

                <div class="mission">

                    <div>

                        <div class="mission-title">
                            ${job.title}
                        </div>

                        <div class="mission-details">
                            Reward:
                            ${money(job.reward)}
                            • Energy:
                            ${job.energy}
                            • XP:
                            ${job.xp}
                        </div>

                    </div>

                    <button
                        class="mission-button"
                        onclick="acceptMission(${index})"
                    >
                        Accept
                    </button>

                </div>

            `
        ).join("");

    locationPanel.innerHTML +=
        `<div class="jobs">${jobsHTML}</div>`;
}


function acceptMission(index) {

    const location =
        locations[game.currentLocation];

    const job =
        location.jobs[index];

    if (
        game.energy <
        job.energy
    ) {

        showMessage(
            "You don't have enough energy for this mission."
        );

        return;
    }

    game.missions.push({

        title: job.title,

        reward: job.reward,

        energy: job.energy,

        xp: job.xp,

        reputation: 4

    });

    log(
        `Accepted: ${job.title}.`
    );

    showMessage(
        "Mission added to your active missions."
    );

    render();

}


/* =========================
   ACTIVE MISSIONS
========================= */

function renderMissions() {

    const container =
        document.getElementById(
            "missions"
        );

    if (
        game.missions.length === 0
    ) {

        container.innerHTML = `
            <p class="muted">
                No active missions.
                Visit a location to find work.
            </p>
        `;

        return;
    }

    container.innerHTML =
        game.missions.map(
            (mission, index) => `

                <div class="mission">

                    <div>

                        <div class="mission-title">
                            ${mission.title}
                        </div>

                        <div class="mission-details">

                            Reward:
                            ${money(mission.reward)}

                            • +${mission.reputation}
                            reputation

                        </div>

                    </div>

                    <button
                        class="mission-button"
                        onclick="completeMission(${index})"
                        ${
                            game.energy <
                            mission.energy
                            ? "disabled"
                            : ""
                        }
                    >
                        Complete
                    </button>

                </div>

            `
        ).join("");
}


/* =========================
   COMPLETE MISSION
========================= */

function completeMission(index) {

    const mission =
        game.missions[index];

    if (
        !spendEnergy(
            mission.energy
        )
    ) {
        return;
    }

    game.cash +=
        mission.reward;

    game.reputation +=
        mission.reputation;

    game.xp +=
        mission.xp;

    const savings =
        Math.round(
            mission.reward * 0.25
        );

    game.japaFund +=
        savings;

    game.missions.splice(
        index,
        1
    );

    game.day++;

    log(
        `Completed ${mission.title}. Earned ${money(mission.reward)} and saved ${money(savings)} toward Japa.`
    );

    showMessage(
        `Mission completed! You earned ${money(mission.reward)}.`
    );

    render();

}


/* =========================
   SAVE MONEY
========================= */

function saveMoney() {

    if (game.cash < 5000) {

        showMessage(
            "You don't have enough cash to save ₦5,000."
        );

        return;
    }

    game.cash -= 5000;

    game.japaFund += 5000;

    log(
        "Saved ₦5,000 into your Japa Fund."
    );

    showMessage(
        "₦5,000 added to your Japa Fund."
    );

    render();

}


/* =========================
   REST
========================= */

function rest() {

    game.energy =
        Math.min(
            100,
            game.energy + 45
        );

    game.day++;

    log(
        "You rested and recovered energy."
    );

    showMessage(
        "You feel refreshed."
    );

    render();

}


/* =========================
   UPDATE UI
========================= */

function renderStats() {

    document.getElementById(
        "cash"
    ).textContent =
        money(game.cash);

    document.getElementById(
        "energy"
    ).textContent =
        game.energy;

    document.getElementById(
        "reputation"
    ).textContent =
        game.reputation;

    document.getElementById(
        "xp"
    ).textContent =
        game.xp;

    document.getElementById(
        "japaFund"
    ).textContent =
        money(game.japaFund);

    document.getElementById(
        "day"
    ).textContent =
        game.day;

    document.getElementById(
        "fundAmount"
    ).textContent =
        money(game.japaFund);


    const progress =
        Math.min(
            100,
            (game.japaFund / 250000) * 100
        );

    document.getElementById(
        "fundProgress"
    ).style.width =
        progress + "%";
}


/* =========================
   JOURNEY LOG
========================= */

function renderLog() {

    const container =
        document.getElementById(
            "journeyLog"
        );

    container.innerHTML =
        game.logs.map(
            entry => `

                <div class="log-entry">
                    ${entry}
                </div>

            `
        ).join("");
}


/* =========================
   MAIN RENDER
========================= */

function render() {

    renderStats();

    renderMap();

    renderLocation();

    renderAvailableJobs();

    renderNPCs();

    renderMissions();

    renderLog();

    // Automatically save after the interface updates
    saveGame();
}


/* =========================
   BUTTONS
========================= */

document.getElementById(
    "saveButton"
).addEventListener(
    "click",
    saveMoney
);

document.getElementById(
    "restButton"
).addEventListener(
    "click",
    rest
);


/* =========================
   START GAME
========================= */

const hasSave = loadGame();

if (!hasSave) {
    log("You arrived in Lagos with ₦25,000. Your Japa story begins.");
}

render();

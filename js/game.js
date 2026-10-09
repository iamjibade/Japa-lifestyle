/* ==========================================
   JAPA LIFESTYLE — WORLD ALPHA
   Nigerian Life Simulation Game
   ========================================== */

/* ==========================================
   1. GAME STATE & SAVE SYSTEM
   ========================================== */

const SAVE_KEY = "japaLifestyleSave";
const FUND_TARGET = 250000;

const game = {
    cash: 25000,
    energy: 100,
    reputation: 0,
    xp: 0,
    japaFund: 0,
    day: 1,
    currentCity: "lagos",
    currentLocation: "home",
    missions: [],
    logs: []
};

let messageTimeout = null;

function saveGame(showFeedback = false) {
    try {
        localStorage.setItem(SAVE_KEY, JSON.stringify(game));

        if (showFeedback) {
            showMessage("Your game progress has been saved.");
        }

        return true;
    } catch (error) {
        console.error("Could not save game:", error);

        if (showFeedback) {
            showMessage("Unable to save. Check your browser settings.");
        }

        return false;
    }
}

function loadGame() {
    try {
        const saved = localStorage.getItem(SAVE_KEY);

        if (!saved) return false;

        const data = JSON.parse(saved);

        if (
            !data ||
            typeof data !== "object" ||
            !Number.isFinite(data.cash) ||
            !Number.isFinite(data.energy) ||
            !Array.isArray(data.missions) ||
            !Array.isArray(data.logs)
        ) {
            throw new Error("Invalid save data");
        }

        // Support older saves from the original Lagos prototype.
        const oldLocationAliases = {
            home: "home",
            market: "market",
            tech: "tech",
            transport: "transport",
            food: "food",
            business: "business"
        };

        const migratedLocation =
            oldLocationAliases[data.currentLocation] ||
            data.currentLocation;

        if (!locations[migratedLocation]) {
            data.currentCity = "lagos";
            data.currentLocation = "home";
        } else {
            data.currentLocation = migratedLocation;
        }

        if (!cities[data.currentCity]) {
            data.currentCity = "lagos";
        }

        // Restore only recognised numeric values.
        for (const key of [
            "cash", "energy", "reputation",
            "xp", "japaFund", "day"
        ]) {
            if (Number.isFinite(data[key])) {
                game[key] = Math.max(0, data[key]);
            }
        }

        game.energy = Math.min(100, game.energy);
        game.day = Math.max(1, Math.floor(game.day));

        game.currentCity = data.currentCity;
        game.currentLocation = data.currentLocation;

        // Ignore malformed mission entries.
        game.missions = data.missions
            .filter(mission =>
                mission &&
                typeof mission.title === "string" &&
                Number.isFinite(mission.reward) &&
                Number.isFinite(mission.energy) &&
                Number.isFinite(mission.xp) &&
                Number.isFinite(mission.reputation)
            )
            .map(mission => ({ ...mission }));

        game.logs = data.logs
            .filter(entry => typeof entry === "string")
            .slice(0, 20);

        // Keep city and neighbourhood consistent.
        if (locations[game.currentLocation].city !== game.currentCity) {
            game.currentCity = locations[game.currentLocation].city;
        }

        return true;

    } catch (error) {
        console.error("Could not load saved game:", error);
        return false;
    }
}

/* ==========================================
   2. CITY CONFIGURATION
   ========================================== */

const cities = {
    lagos: {
        name: "Lagos",
        icon: "🌆",
        mood: "The Hustle",
        description: "Bigger dreams, same Naija spirit.",
        status: "🚌 Traffic: Moderate",
        mapTitle: "Lagos City Map",
        startLocation: "home"
    },

    abuja: {
        name: "Abuja",
        icon: "🏙️",
        mood: "The Ambition",
        description: "Think bigger. Build your future.",
        status: "🏢 The city of opportunity",
        mapTitle: "Abuja City Map",
        startLocation: "abuja-home"
    },

    ibadan: {
        name: "Ibadan",
        icon: "🌄",
        mood: "The Grind",
        description: "Slow beginnings. Big possibilities.",
        status: "🤝 Community and enterprise",
        mapTitle: "Ibadan City Map",
        startLocation: "ibadan-home"
    },

    "port-harcourt": {
        name: "Port Harcourt",
        icon: "🌴",
        mood: "The River City",
        description: "Find your lane. Make your move.",
        status: "🌧️ Tropical atmosphere",
        mapTitle: "Port Harcourt City Map",
        startLocation: "ph-home"
    },

    "benin-city": {
        name: "Benin City",
        icon: "🏺",
        mood: "The Heritage",
        description: "Rooted in history. Ready for tomorrow.",
        status: "🏺 Heritage meets hustle",
        mapTitle: "Benin City Map",
        startLocation: "benin-home"
    },

    onitsha: {
        name: "Onitsha",
        icon: "🛍️",
        mood: "The Marketplace",
        description: "Business moves. Opportunities multiply.",
        status: "📦 Trading district",
        mapTitle: "Onitsha City Map",
        startLocation: "onitsha-home"
    }
};

/* ==========================================
   3. LOCATIONS, NPCS & JOBS

   All rewards are fictional in-game currency.
   ========================================== */

const locations = {
    /* LAGOS */

    home: {
        city: "lagos",
        name: "Home",
        icon: "🏠",
        description: "Your base. Rest, plan your day and manage your Japa fund.",
        npc: null,
        jobs: []
    },

    market: {
        city: "lagos",
        name: "Balogun Market",
        icon: "🛍️",
        description: "A busy trading area full of sourcing and selling opportunities.",
        npc: "Mama Bisi",
        jobs: [
            {
                title: "Source 5 items for a trader",
                reward: 8500,
                energy: 18,
                xp: 25,
                reputation: 4
            },
            {
                title: "Organise a stock list",
                reward: 6000,
                energy: 12,
                xp: 18,
                reputation: 3
            }
        ]
    },

    tech: {
        city: "lagos",
        name: "Tech Hub",
        icon: "💻",
        description: "Developers and small businesses need digital services.",
        npc: "Tunde",
        jobs: [
            {
                title: "Fix a business landing page",
                reward: 14000,
                energy: 22,
                xp: 30,
                reputation: 5
            },
            {
                title: "Create a product listing",
                reward: 8000,
                energy: 15,
                xp: 20,
                reputation: 3
            }
        ]
    },

    transport: {
        city: "lagos",
        name: "Transport Park",
        icon: "🚌",
        description: "Drivers, dispatch riders and logistics clients exchange jobs here.",
        npc: "Emeka",
        jobs: [
            {
                title: "Deliver a document across town",
                reward: 7500,
                energy: 18,
                xp: 25,
                reputation: 4
            },
            {
                title: "Move a small parcel",
                reward: 9500,
                energy: 20,
                xp: 28,
                reputation: 4
            }
        ]
    },

    food: {
        city: "lagos",
        name: "Food Street",
        icon: "🍲",
        description: "Food vendors serve workers and occasionally need extra hands.",
        npc: "Aunty Kemi",
        jobs: [
            {
                title: "Help with a lunch order",
                reward: 6500,
                energy: 15,
                xp: 20,
                reputation: 3
            },
            {
                title: "Deliver catering packs",
                reward: 9000,
                energy: 18,
                xp: 25,
                reputation: 4
            }
        ]
    },

    business: {
        city: "lagos",
        name: "Business District",
        icon: "🏢",
        description: "Companies post higher-value professional contracts here.",
        npc: "Sarah",
        jobs: [
            {
                title: "Prepare a company proposal",
                reward: 16000,
                energy: 25,
                xp: 35,
                reputation: 6
            },
            {
                title: "Organise client data",
                reward: 12000,
                energy: 20,
                xp: 28,
                reputation: 5
            }
        ]
    },

    /* ABUJA */

    "abuja-home": {
        city: "abuja",
        name: "Garki Residence",
        icon: "🏠",
        description: "Settle in, plan your finances and prepare for new opportunities.",
        npc: null,
        jobs: []
    },

    "abuja-business": {
        city: "abuja",
        name: "Central Business District",
        icon: "🏢",
        description: "Professional services, corporate contracts and ambitious projects.",
        npc: "Zainab",
        jobs: [
            {
                title: "Prepare a client presentation",
                reward: 18000,
                energy: 22,
                xp: 35,
                reputation: 6
            },
            {
                title: "Organise a business report",
                reward: 12500,
                energy: 17,
                xp: 25,
                reputation: 4
            }
        ]
    },

    "abuja-market": {
        city: "abuja",
        name: "Wuse Market",
        icon: "🛍️",
        description: "Meet traders and help local businesses improve their operations.",
        npc: "Hauwa",
        jobs: [
            {
                title: "Update a shop inventory",
                reward: 8000,
                energy: 15,
                xp: 22,
                reputation: 3
            },
            {
                title: "Arrange a customer order",
                reward: 9500,
                energy: 18,
                xp: 25,
                reputation: 4
            }
        ]
    },

    "abuja-tech": {
        city: "abuja",
        name: "Innovation Hub",
        icon: "💻",
        description: "Build digital skills and meet people working on new ideas.",
        npc: "David",
        jobs: [
            {
                title: "Build a portfolio page",
                reward: 15000,
                energy: 22,
                xp: 35,
                reputation: 5
            },
            {
                title: "Test a website on mobile",
                reward: 9000,
                energy: 15,
                xp: 25,
                reputation: 4
            }
        ]
    },

    /* IBADAN */

    "ibadan-home": {
        city: "ibadan",
        name: "Mokola Home",
        icon: "🏠",
        description: "Start your day and plan your next move in the city of brown rooftops.",
        npc: null,
        jobs: []
    },

    "ibadan-market": {
        city: "ibadan",
        name: "Bodija Market",
        icon: "🧺",
        description: "Help traders, organise goods and find practical work.",
        npc: "Mama Ronke",
        jobs: [
            {
                title: "Help a trader sort stock",
                reward: 6500,
                energy: 15,
                xp: 20,
                reputation: 4
            },
            {
                title: "Record daily sales",
                reward: 8000,
                energy: 16,
                xp: 24,
                reputation: 4
            }
        ]
    },

    "ibadan-tech": {
        city: "ibadan",
        name: "Creative Workspace",
        icon: "💻",
        description: "Local entrepreneurs need websites and help with digital tools.",
        npc: "Femi",
        jobs: [
            {
                title: "Create a business flyer",
                reward: 7000,
                energy: 14,
                xp: 22,
                reputation: 3
            },
            {
                title: "Set up a business webpage",
                reward: 12000,
                energy: 21,
                xp: 30,
                reputation: 5
            }
        ]
    },

    "ibadan-transport": {
        city: "ibadan",
        name: "Mokola Junction",
        icon: "🚌",
        description: "A busy connection point for commuters and local deliveries.",
        npc: "Bayo",
        jobs: [
            {
                title: "Coordinate a local delivery",
                reward: 7000,
                energy: 16,
                xp: 22,
                reputation: 4
            },
            {
                title: "Record parcel dispatches",
                reward: 8500,
                energy: 18,
                xp: 25,
                reputation: 4
            }
        ]
    },

    /* PORT HARCOURT */

    "ph-home": {
        city: "port-harcourt",
        name: "GRA Residence",
        icon: "🏠",
        description: "Plan your day in the Garden City and prepare for new work.",
        npc: null,
        jobs: []
    },

    "ph-business": {
        city: "port-harcourt",
        name: "Business District",
        icon: "🏢",
        description: "Explore professional services and business support opportunities.",
        npc: "Amaka",
        jobs: [
            {
                title: "Prepare an operations report",
                reward: 15000,
                energy: 22,
                xp: 32,
                reputation: 5
            },
            {
                title: "Organise customer records",
                reward: 10500,
                energy: 18,
                xp: 26,
                reputation: 4
            }
        ]
    },

    "ph-market": {
        city: "port-harcourt",
        name: "Mile 1 Market",
        icon: "🛍️",
        description: "Support traders with stock, sales and customer orders.",
        npc: "Chika",
        jobs: [
            {
                title: "Record market sales",
                reward: 7500,
                energy: 15,
                xp: 22,
                reputation: 3
            },
            {
                title: "Arrange a wholesale order",
                reward: 11000,
                energy: 19,
                xp: 28,
                reputation: 4
            }
        ]
    },

    "ph-transport": {
        city: "port-harcourt",
        name: "Waterfront Logistics",
        icon: "🚚",
        description: "Help coordinate parcel movement and logistics tasks.",
        npc: "Tamuno",
        jobs: [
            {
                title: "Track a parcel delivery",
                reward: 8500,
                energy: 17,
                xp: 24,
                reputation: 4
            },
            {
                title: "Prepare a dispatch schedule",
                reward: 11500,
                energy: 20,
                xp: 29,
                reputation: 5
            }
        ]
    },

    /* BENIN CITY */

    "benin-home": {
        city: "benin-city",
        name: "Ring Road Home",
        icon: "🏠",
        description: "Begin your day surrounded by the city's history and enterprise.",
        npc: null,
        jobs: []
    },

    "benin-market": {
        city: "benin-city",
        name: "New Benin Market",
        icon: "🛍️",
        description: "Work with merchants and find opportunities in local trade.",
        npc: "Osas",
        jobs: [
            {
                title: "Update a merchant's stock list",
                reward: 7000,
                energy: 15,
                xp: 22,
                reputation: 3
            },
            {
                title: "Prepare customer orders",
                reward: 9000,
                energy: 17,
                xp: 25,
                reputation: 4
            }
        ]
    },

    "benin-tech": {
        city: "benin-city",
        name: "Digital Skills Centre",
        icon: "💻",
        description: "Help growing businesses establish their digital presence.",
        npc: "Efe",
        jobs: [
            {
                title: "Design a business homepage",
                reward: 12500,
                energy: 21,
                xp: 30,
                reputation: 5
            },
            {
                title: "Create an online product catalogue",
                reward: 10000,
                energy: 18,
                xp: 27,
                reputation: 4
            }
        ]
    },

    "benin-business": {
        city: "benin-city",
        name: "Commercial District",
        icon: "🏢",
        description: "Help businesses organise their records and serve customers.",
        npc: "Osayande",
        jobs: [
            {
                title: "Organise a customer database",
                reward: 11000,
                energy: 19,
                xp: 28,
                reputation: 4
            },
            {
                title: "Prepare a sales summary",
                reward: 9500,
                energy: 17,
                xp: 25,
                reputation: 4
            }
        ]
    },

    /* ONITSHA */

    "onitsha-home": {
        city: "onitsha",
        name: "Onitsha Residence",
        icon: "🏠",
        description: "Get ready for another day of deals, trade and opportunity.",
        npc: null,
        jobs: []
    },

    "onitsha-market": {
        city: "onitsha",
        name: "Main Market",
        icon: "🛍️",
        description: "A commercial powerhouse full of stock, sales and merchant tasks.",
        npc: "Mr. Okeke",
        jobs: [
            {
                title: "Prepare a stock inventory",
                reward: 9000,
                energy: 17,
                xp: 25,
                reputation: 4
            },
            {
                title: "Coordinate a customer order",
                reward: 11500,
                energy: 20,
                xp: 29,
                reputation: 5
            }
        ]
    },

    "onitsha-transport": {
        city: "onitsha",
        name: "Transport Terminal",
        icon: "🚌",
        description: "Help coordinate goods moving between customers and traders.",
        npc: "Chinedu",
        jobs: [
            {
                title: "Prepare a dispatch record",
                reward: 8500,
                energy: 17,
                xp: 24,
                reputation: 4
            },
            {
                title: "Coordinate a parcel movement",
                reward: 12000,
                energy: 21,
                xp: 30,
                reputation: 5
            }
        ]
    },

    "onitsha-tech": {
        city: "onitsha",
        name: "Business Tech Corner",
        icon: "💻",
        description: "Help traders use websites and digital tools to reach more customers.",
        npc: "Adaeze",
        jobs: [
            {
                title: "Create a product catalogue",
                reward: 11000,
                energy: 19,
                xp: 28,
                reputation: 4
            },
            {
                title: "Set up a business webpage",
                reward: 14500,
                energy: 23,
                xp: 33,
                reputation: 5
            }
        ]
    }
};

/* ==========================================
   4. NPC DIRECTORY
   ========================================== */

const npcs = {
    "Mama Bisi": {
        icon: "👩🏾‍🦱",
        role: "Trader",
        text: "I need reliable people who can source items quickly."
    },

    "Tunde": {
        icon: "🧑🏾‍💻",
        role: "Developer",
        text: "Small businesses need digital help every day."
    },

    "Emeka": {
        icon: "🧑🏾",
        role: "Logistics",
        text: "If you are dependable, there is always a delivery."
    },

    "Aunty Kemi": {
        icon: "👩🏾‍🍳",
        role: "Food vendor",
        text: "Good service brings repeat customers."
    },

    "Sarah": {
        icon: "👩🏾‍💼",
        role: "Business consultant",
        text: "Professional clients pay more, but they expect quality."
    },

    "Zainab": {
        icon: "👩🏾‍💼",
        role: "Business analyst",
        text: "Good preparation makes a professional stand out."
    },

    "Hauwa": {
        icon: "👩🏾‍🦱",
        role: "Market trader",
        text: "Accurate stock records help a business grow."
    },

    "David": {
        icon: "🧑🏾‍💻",
        role: "Tech founder",
        text: "A good portfolio can open doors to better projects."
    },

    "Mama Ronke": {
        icon: "👩🏾‍🦱",
        role: "Trader",
        text: "Every business needs someone who can be trusted."
    },

    "Femi": {
        icon: "🧑🏾‍🎨",
        role: "Digital creative",
        text: "Local businesses need better ways to reach customers."
    },

    "Bayo": {
        icon: "🧑🏾",
        role: "Transport coordinator",
        text: "Planning ahead makes deliveries run more smoothly."
    },

    "Amaka": {
        icon: "👩🏾‍💼",
        role: "Operations specialist",
        text: "Good records make difficult work easier."
    },

    "Chika": {
        icon: "👩🏾‍🦱",
        role: "Market trader",
        text: "Customers remember businesses that serve them well."
    },

    "Tamuno": {
        icon: "🧑🏾",
        role: "Logistics coordinator",
        text: "Reliable updates help customers trust a delivery service."
    },

    "Osas": {
        icon: "🧑🏾",
        role: "Merchant",
        text: "Organised stock helps me serve customers faster."
    },

    "Efe": {
        icon: "🧑🏾‍💻",
        role: "Web designer",
        text: "Digital skills can help small businesses grow."
    },

    "Osayande": {
        icon: "🧑🏾‍💼",
        role: "Business manager",
        text: "A clear sales report helps us make better decisions."
    },

    "Mr. Okeke": {
        icon: "🧑🏾",
        role: "Wholesaler",
        text: "Trade moves faster when everyone knows what is in stock."
    },

    "Chinedu": {
        icon: "🧑🏾",
        role: "Dispatch coordinator",
        text: "Every parcel needs the right record and destination."
    },

    "Adaeze": {
        icon: "👩🏾‍💻",
        role: "Digital consultant",
        text: "Let's help more local businesses get online."
    }
};

/* ==========================================
   5. HELPERS
   ========================================== */

function money(amount) {
    return "₦" + Math.round(amount).toLocaleString("en-NG");
}

function currentCity() {
    return cities[game.currentCity] || cities.lagos;
}

function currentLocation() {
    return locations[game.currentLocation] || locations.home;
}

function cityLocations() {
    return Object.entries(locations).filter(
        ([, location]) => location.city === game.currentCity
    );
}

function log(message) {
    game.logs.unshift(`Day ${game.day} — ${message}`);
    game.logs = game.logs.slice(0, 20);
}

function showMessage(message) {
    const element = document.getElementById("message");

    if (!element) return;

    element.textContent = message;
}

function spendEnergy(amount) {
    if (game.energy < amount) {
        showMessage("You're low on energy. Rest before taking on more work.");
        return false;
    }

    game.energy -= amount;
    return true;
}

/* ==========================================
   6. CITY THEMING
   ========================================== */

function renderCityTheme() {
    const city = currentCity();

    document.body.dataset.theme = game.currentCity;
    document.documentElement.dataset.theme = game.currentCity;

    document.getElementById("cityName").textContent = city.name;
    document.getElementById("cityIcon").textContent = city.icon;
    document.getElementById("cityMood").textContent =
        `${city.mood} · ${city.description}`;

    document.getElementById("mapTitle").textContent = city.mapTitle;
    document.getElementById("cityStatus").textContent = city.status;

    const themeColors = {
        lagos: "#101815",
        abuja: "#111b18",
        ibadan: "#211613",
        "port-harcourt": "#0c1b21",
        "benin-city": "#201513",
        onitsha: "#171912"
    };

    const metaTheme = document.querySelector('meta[name="theme-color"]');

    if (metaTheme) {
        metaTheme.content = themeColors[game.currentCity] || themeColors.lagos;
    }

    const selector = document.getElementById("citySelector");

    if (selector) {
        selector.value = game.currentCity;
    }
}

function setupCitySelector() {
    const identity = document.querySelector(".city-identity");

    if (!identity || document.getElementById("citySelector")) return;

    const wrapper = document.createElement("label");
    wrapper.className = "city-selector-wrap";
    wrapper.htmlFor = "citySelector";

    const select = document.createElement("select");
    select.id = "citySelector";
    select.setAttribute("aria-label", "Travel to another city");

    Object.entries(cities).forEach(([id, city]) => {
        const option = document.createElement("option");
        option.value = id;
        option.textContent = city.name;
        select.appendChild(option);
    });

    const label = document.createElement("span");
    label.className = "eyebrow";
    label.textContent = "TRAVEL TO";

    wrapper.append(label, select);
    identity.appendChild(wrapper);

    select.value = game.currentCity;

    select.addEventListener("change", () => {
        travelToCity(select.value);
    });
}

function travelToCity(cityId) {
    if (!cities[cityId] || cityId === game.currentCity) return;

    if (!spendEnergy(10)) {
        document.getElementById("citySelector").value = game.currentCity;
        return;
    }

    game.currentCity = cityId;
    game.currentLocation = cities[cityId].startLocation;
    game.day++;

    log(`Travelled to ${cities[cityId].name}.`);

    showMessage(
        `Welcome to ${cities[cityId].name}! ${cities[cityId].mood} awaits.`
    );

    render();
}

/* ==========================================
   7. CITY MAP
   ========================================== */

function renderMap() {
    const map = document.getElementById("cityMap");
    map.innerHTML = "";

    cityLocations().forEach(([id, location]) => {
        const button = document.createElement("button");

        button.type = "button";
        button.className = "place";

        if (game.currentLocation === id) {
            button.classList.add("active");
            button.setAttribute("aria-current", "location");
        }

        button.innerHTML = `
            <span class="place-icon">${location.icon}</span>
            <span class="place-name">${location.name}</span>
            <span class="place-small">
                ${game.currentLocation === id ? "YOU ARE HERE" : "Explore"}
            </span>
        `;

        button.addEventListener("click", () => travelTo(id));

        map.appendChild(button);
    });
}

/* ==========================================
   8. TRAVEL BETWEEN NEIGHBOURHOODS
   ========================================== */

function travelTo(locationId) {
    const destination = locations[locationId];

    if (!destination || destination.city !== game.currentCity) return;
    if (game.currentLocation === locationId) return;

    if (!spendEnergy(5)) return;

    game.currentLocation = locationId;
    game.day++;

    log(`Travelled to ${destination.name} in ${currentCity().name}.`);

    showMessage(`You arrived at ${destination.name}.`);

    render();
}

/* ==========================================
   9. LOCATION PANEL & AVAILABLE JOBS
   ========================================== */

function renderLocation() {
    const location = currentLocation();
    const panel = document.getElementById("locationPanel");

    document.getElementById("locationText").textContent =
        `You are at ${location.name}, ${currentCity().name}.`;

    panel.innerHTML = `
        <div class="location-title">
            ${location.icon} ${location.name}
        </div>
        <div class="location-description">
            ${location.description}
        </div>
    `;
}

function renderAvailableJobs() {
    const location = currentLocation();
    const panel = document.getElementById("locationPanel");

    if (!location.jobs || location.jobs.length === 0) {
        panel.insertAdjacentHTML("beforeend", `
            <div class="jobs">
                <p class="muted">No jobs available here right now. Explore another location.</p>
            </div>
        `);
        return;
    }

    const jobsHTML = location.jobs.map((job, index) => `
        <div class="mission">
            <div>
                <div class="mission-title">${job.title}</div>
                <div class="mission-details">
                    Reward: ${money(job.reward)}
                    · Energy: ${job.energy}
                    · XP: ${job.xp}
                </div>
            </div>
            <button class="mission-button" data-job-index="${index}">
                Accept
            </button>
        </div>
    `).join("");

    panel.insertAdjacentHTML("beforeend", `
        <div class="jobs">
            <h3>Available Jobs</h3>
            ${jobsHTML}
        </div>
    `);

    panel.querySelectorAll("[data-job-index]").forEach(button => {
        button.addEventListener("click", () => {
            acceptMission(Number(button.dataset.jobIndex));
        });
    });
}

/* ==========================================
   10. NPC SYSTEM
   ========================================== */

function renderNPCs() {
    const location = currentLocation();
    const container = document.getElementById("npcs");
    const opportunity = document.getElementById("opportunity");

    if (!location.npc || !npcs[location.npc]) {
        container.innerHTML = `
            <p class="muted">Enjoy the neighbourhood. Visit another spot to meet people.</p>
        `;

        opportunity.innerHTML = `
            <p class="muted">Explore the city to discover your next opportunity.</p>
        `;

        return;
    }

    const npc = npcs[location.npc];

    container.innerHTML = `
        <div class="npc-card">
            <div class="npc-info">
                <div class="npc-avatar">${npc.icon}</div>
                <div>
                    <strong>${location.npc}</strong>
                    <div class="npc-role">${npc.role}</div>
                    <p>${npc.text}</p>
                </div>
            </div>

            <button id="talkButton" class="secondary-button">
                Talk
            </button>
        </div>
    `;

    document.getElementById("talkButton").addEventListener(
        "click",
        talkToNPC
    );

    opportunity.innerHTML = `
        <div class="opportunity-card">
            <strong>${npc.role} opportunity</strong>
            <p class="muted">${npc.text}</p>
            <p class="mission-details">
                Visit the Available Jobs section to find work.
            </p>
        </div>
    `;
}

function talkToNPC() {
    const location = currentLocation();

    if (!location.npc || !npcs[location.npc]) return;

    game.reputation += 2;

    log(`You spoke with ${location.npc}. Reputation +2.`);

    showMessage(
        `${location.npc}: "${npcs[location.npc].text}" Reputation +2.`
    );

    render();
}

/* ==========================================
   11. ACCEPT MISSIONS
   ========================================== */

function acceptMission(index) {
    const location = currentLocation();
    const job = location.jobs?.[index];

    if (!job) {
        showMessage("That job is no longer available.");
        return;
    }

    // Prevent repeatedly accepting the same job while it is active.
    const alreadyAccepted = game.missions.some(
        mission =>
            mission.title === job.title &&
            mission.locationId === game.currentLocation
    );

    if (alreadyAccepted) {
        showMessage("You've already accepted this job. Complete it first.");
        return;
    }

    if (game.energy < job.energy) {
        showMessage("Not enough energy for this job. Rest first.");
        return;
    }

    game.missions.push({
        title: job.title,
        reward: job.reward,
        energy: job.energy,
        xp: job.xp,
        reputation: job.reputation,
        locationId: game.currentLocation,
        city: game.currentCity
    });

    log(`Accepted "${job.title}" in ${location.name}.`);

    showMessage(`Mission accepted: ${job.title}.`);

    render();
}

/* ==========================================
   12. ACTIVE MISSIONS
   ========================================== */

function renderMissions() {
    const container = document.getElementById("missions");

    if (game.missions.length === 0) {
        container.innerHTML = `
            <p class="muted">
                No active missions yet. Explore a location and accept a job.
            </p>
        `;
        return;
    }

    container.innerHTML = game.missions.map((mission, index) => `
        <div class="mission">
            <div>
                <div class="mission-title">${mission.title}</div>
                <div class="mission-details">
                    ${cities[mission.city]?.name || "Nigeria"}
                    · Reward: ${money(mission.reward)}
                    · +${mission.reputation} reputation
                    · +${mission.xp} XP
                </div>
            </div>

            <button class="mission-button"
                data-complete-index="${index}"
                ${game.energy < mission.energy ? "disabled" : ""}>
                Complete
            </button>
        </div>
    `).join("");

    container.querySelectorAll("[data-complete-index]").forEach(button => {
        button.addEventListener("click", () => {
            completeMission(Number(button.dataset.completeIndex));
        });
    });
}

function completeMission(index) {
    const mission = game.missions[index];

    if (!mission) {
        showMessage("Mission not found.");
        return;
    }

    if (!spendEnergy(mission.energy)) return;

    game.cash += mission.reward;
    game.reputation += mission.reputation;
    game.xp += mission.xp;

    // In-game savings bonus: 25% of the mission reward.
    const savings = Math.round(mission.reward * 0.25);

    game.japaFund += savings;
    game.missions.splice(index, 1);
    game.day++;

    log(
        `Completed "${mission.title}". Earned ${money(mission.reward)} and added ${money(savings)} to the Japa Fund.`
    );

    showMessage(
        `Mission complete! ${money(mission.reward)} earned; ${money(savings)} added to your Japa Fund.`
    );

    render();
}

/* ==========================================
   13. JAPA SAVINGS
   ========================================== */

function saveMoney() {
    const amount = 5000;

    if (game.cash < amount) {
        showMessage("You need at least ₦5,000 in your wallet to save.");
        return;
    }

    game.cash -= amount;
    game.japaFund += amount;

    log(`Saved ${money(amount)} toward your Japa Fund.`);

    showMessage(`${money(amount)} moved into your Japa Fund.`);

    render();
}

/* ==========================================
   14. REST & ENERGY
   ========================================== */

function rest() {
    if (game.energy >= 100) {
        showMessage("You're already fully rested. Time to explore!");
        return;
    }

    const recovered = Math.min(45, 100 - game.energy);

    game.energy += recovered;
    game.day++;

    log(`Rested and recovered ${recovered} energy.`);

    showMessage(`You rested and recovered ${recovered} energy.`);

    render();
}

/* ==========================================
   15. PLAYER STATS & FUND PROGRESS
   ========================================== */

function renderStats() {
    document.getElementById("cash").textContent = money(game.cash);
    document.getElementById("energy").textContent = game.energy;
    document.getElementById("reputation").textContent = game.reputation;
    document.getElementById("xp").textContent = game.xp;
    document.getElementById("japaFund").textContent = money(game.japaFund);
    document.getElementById("day").textContent = game.day;
    document.getElementById("fundAmount").textContent = money(game.japaFund);

    const progress = Math.min(
        100,
        (game.japaFund / FUND_TARGET) * 100
    );

    const progressBar = document.querySelector(".progress-bar");
    const progressFill = document.getElementById("fundProgress");

    progressFill.style.width = `${progress}%`;

    if (progressBar) {
        progressBar.setAttribute("aria-valuenow", String(
            Math.min(FUND_TARGET, game.japaFund)
        ));
        progressBar.setAttribute("aria-valuemax", String(FUND_TARGET));
    }
}

/* ==========================================
   16. JOURNEY LOG
   ========================================== */

function renderLog() {
    const container = document.getElementById("journeyLog");

    if (game.logs.length === 0) {
        container.innerHTML = `
            <p class="muted">Your journey starts here. Make your first move.</p>
        `;
        return;
    }

    container.replaceChildren();

    game.logs.forEach(entry => {
        const element = document.createElement("div");
        element.className = "log-entry";
        element.textContent = entry;
        container.appendChild(element);
    });
}

/* ==========================================
   17. MAIN RENDER
   ========================================== */

function render() {
    renderCityTheme();
    renderStats();
    renderMap();
    renderLocation();
    renderAvailableJobs();
    renderNPCs();
    renderMissions();
    renderLog();

    // Autosave quietly. Do not overwrite the player's message.
    saveGame();
}

/* ==========================================
   18. BUTTONS & STARTUP
   ========================================== */

document.getElementById("saveButton").addEventListener(
    "click",
    saveMoney
);

document.getElementById("restButton").addEventListener(
    "click",
    rest
);

// Restore saved progress before showing the game.
const hasSave = loadGame();

if (!hasSave) {
    log("You arrived in Lagos with ₦25,000. Your Japa story begins.");
}

setupCitySelector();
render();

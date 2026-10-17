"use strict";

/* ==========================================
   JAPA LIFESTYLE — WORLD ALPHA
   Nigerian Life Simulation Game
   Powered by Ibrish Digital
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
    totalExpensesPaid: 0,
    day: 1,
    currentCity: "lagos",
    currentLocation: "home",
    missions: [],
    logs: []
};

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

        const cityId = cities[data.currentCity]
            ? data.currentCity
            : "lagos";

        let locationId = data.currentLocation;

        if (
            !locations[locationId] ||
            locations[locationId].city !== cityId
        ) {
            locationId = cities[cityId].startLocation;
        }

        game.cash = Math.max(0, data.cash);
        game.energy = Math.max(0, Math.min(100, data.energy));
        game.reputation = Math.max(0, Number(data.reputation) || 0);
        game.xp = Math.max(0, Number(data.xp) || 0);
        game.japaFund = Math.max(0, Number(data.japaFund) || 0);
       game.totalExpensesPaid = Math.max(0, Number(data.totalExpensesPaid) || 0);
        game.day = Math.max(1, Math.floor(Number(data.day) || 1));
        game.currentCity = cityId;
        game.currentLocation = locationId;

        game.missions = data.missions
            .filter(mission =>
                mission &&
                typeof mission.title === "string" &&
                Number.isFinite(mission.reward) &&
                Number.isFinite(mission.energy) &&
                Number.isFinite(mission.xp) &&
                Number.isFinite(mission.reputation)
            )
            .map(mission => ({
                ...mission,
                city: cities[mission.city] ? mission.city : cityId,
                locationId: locations[mission.locationId]
                    ? mission.locationId
                    : locationId
            }));

        game.logs = data.logs
            .filter(entry => typeof entry === "string")
            .slice(0, 20);

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
        startLocation: "home",
        image: "lagos.jpg",
        themeColor: "#101815"
    },

    abuja: {
        name: "Abuja",
        icon: "🏙️",
        mood: "The Ambition",
        description: "Think bigger. Build your future.",
        status: "🏢 The city of opportunity",
        mapTitle: "Abuja City Map",
        startLocation: "abuja-home",
        image: "abuja.jpg",
        themeColor: "#111b18"
    },

    ibadan: {
        name: "Ibadan",
        icon: "🌄",
        mood: "The Grind",
        description: "Slow beginnings. Big possibilities.",
        status: "🤝 Community and enterprise",
        mapTitle: "Ibadan City Map",
        startLocation: "ibadan-home",
        image: "ibadan.jpg",
        themeColor: "#211613"
    },

    "port-harcourt": {
        name: "Port Harcourt",
        icon: "🌴",
        mood: "The River City",
        description: "Find your lane. Make your move.",
        status: "🌧️ Tropical atmosphere",
        mapTitle: "Port Harcourt City Map",
        startLocation: "ph-home",
        image: "port-harcourt.jpg",
        themeColor: "#0c1b21"
    },

    "benin-city": {
        name: "Benin City",
        icon: "🏺",
        mood: "The Heritage",
        description: "Rooted in history. Ready for tomorrow.",
        status: "🏺 Heritage meets hustle",
        mapTitle: "Benin City Map",
        startLocation: "benin-home",
        image: "benin-city.jpg",
        themeColor: "#201513"
    },

    onitsha: {
        name: "Onitsha",
        icon: "🛍️",
        mood: "The Marketplace",
        description: "Business moves. Opportunities multiply.",
        status: "📦 Trading district",
        mapTitle: "Onitsha City Map",
        startLocation: "onitsha-home",
        image: "onitsha.jpg",
        themeColor: "#171912"
    }
};

/* ==========================================
   3. LOCATIONS, JOBS & REWARDS
   ========================================== */

function makeJob(title, reward, energy, xp, reputation) {
    return { title, reward, energy, xp, reputation };
}

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
            makeJob("Source 5 items for a trader", 8500, 18, 25, 4),
            makeJob("Organise a stock list", 6000, 12, 18, 3)
        ]
    },

    tech: {
        city: "lagos",
        name: "Tech Hub",
        icon: "💻",
        description: "Developers and small businesses need digital services.",
        npc: "Tunde",
        jobs: [
            makeJob("Fix a business landing page", 14000, 22, 30, 5),
            makeJob("Create a product listing", 8000, 15, 20, 3)
        ]
    },

    transport: {
        city: "lagos",
        name: "Transport Park",
        icon: "🚌",
        description: "Drivers, dispatch riders and logistics clients exchange jobs here.",
        npc: "Emeka",
        jobs: [
            makeJob("Deliver a document across town", 7500, 18, 25, 4),
            makeJob("Move a small parcel", 9500, 20, 28, 4)
        ]
    },

    food: {
        city: "lagos",
        name: "Food Street",
        icon: "🍲",
        description: "Food vendors serve workers and occasionally need extra hands.",
        npc: "Aunty Kemi",
        jobs: [
            makeJob("Help with a lunch order", 6500, 15, 20, 3),
            makeJob("Deliver catering packs", 9000, 18, 25, 4)
        ]
    },

    business: {
        city: "lagos",
        name: "Business District",
        icon: "🏢",
        description: "Companies post higher-value professional contracts here.",
        npc: "Sarah",
        jobs: [
            makeJob("Prepare a company proposal", 16000, 25, 35, 6),
            makeJob("Organise client data", 12000, 20, 28, 5)
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
            makeJob("Prepare a client presentation", 18000, 22, 35, 6),
            makeJob("Organise a business report", 12500, 17, 25, 4)
        ]
    },

    "abuja-market": {
        city: "abuja",
        name: "Wuse Market",
        icon: "🛍️",
        description: "Meet traders and help local businesses improve their operations.",
        npc: "Hauwa",
        jobs: [
            makeJob("Update a shop inventory", 8000, 15, 22, 3),
            makeJob("Arrange a customer order", 9500, 18, 25, 4)
        ]
    },

    "abuja-tech": {
        city: "abuja",
        name: "Innovation Hub",
        icon: "💻",
        description: "Build digital skills and meet people working on new ideas.",
        npc: "David",
        jobs: [
            makeJob("Build a portfolio page", 15000, 22, 35, 5),
            makeJob("Test a website on mobile", 9000, 15, 25, 4)
        ]
    },

    /* IBADAN */

    "ibadan-home": {
        city: "ibadan",
        name: "Mokola Home",
        icon: "🏠",
        description: "Start your day in the city of brown rooftops.",
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
            makeJob("Help a trader sort stock", 6500, 15, 20, 4),
            makeJob("Record daily sales", 8000, 16, 24, 4)
        ]
    },

    "ibadan-tech": {
        city: "ibadan",
        name: "Creative Workspace",
        icon: "💻",
        description: "Local entrepreneurs need websites and digital tools.",
        npc: "Femi",
        jobs: [
            makeJob("Create a business flyer", 7000, 14, 22, 3),
            makeJob("Set up a business webpage", 12000, 21, 30, 5)
        ]
    },

    "ibadan-transport": {
        city: "ibadan",
        name: "Mokola Junction",
        icon: "🚌",
        description: "A busy connection point for commuters and local deliveries.",
        npc: "Bayo",
        jobs: [
            makeJob("Coordinate a local delivery", 7000, 16, 22, 4),
            makeJob("Record parcel dispatches", 8500, 18, 25, 4)
        ]
    },

    /* PORT HARCOURT */

    "ph-home": {
        city: "port-harcourt",
        name: "GRA Residence",
        icon: "🏠",
        description: "Plan your day in the Garden City.",
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
            makeJob("Prepare an operations report", 15000, 22, 32, 5),
            makeJob("Organise customer records", 10500, 18, 26, 4)
        ]
    },

    "ph-market": {
        city: "port-harcourt",
        name: "Mile 1 Market",
        icon: "🛍️",
        description: "Support traders with stock, sales and customer orders.",
        npc: "Chika",
        jobs: [
            makeJob("Record market sales", 7500, 15, 22, 3),
            makeJob("Arrange a wholesale order", 11000, 19, 28, 4)
        ]
    },

    "ph-transport": {
        city: "port-harcourt",
        name: "Waterfront Logistics",
        icon: "🚚",
        description: "Help coordinate parcel movement and logistics tasks.",
        npc: "Tamuno",
        jobs: [
            makeJob("Track a parcel delivery", 8500, 17, 24, 4),
            makeJob("Prepare a dispatch schedule", 11500, 20, 29, 5)
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
            makeJob("Update a merchant's stock list", 7000, 15, 22, 3),
            makeJob("Prepare customer orders", 9000, 17, 25, 4)
        ]
    },

    "benin-tech": {
        city: "benin-city",
        name: "Digital Skills Centre",
        icon: "💻",
        description: "Help growing businesses establish their digital presence.",
        npc: "Efe",
        jobs: [
            makeJob("Design a business homepage", 12500, 21, 30, 5),
            makeJob("Create an online product catalogue", 10000, 18, 27, 4)
        ]
    },

    "benin-business": {
        city: "benin-city",
        name: "Commercial District",
        icon: "🏢",
        description: "Help businesses organise records and serve customers.",
        npc: "Osayande",
        jobs: [
            makeJob("Organise a customer database", 11000, 19, 28, 4),
            makeJob("Prepare a sales summary", 9500, 17, 25, 4)
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
            makeJob("Prepare a stock inventory", 9000, 17, 25, 4),
            makeJob("Coordinate a customer order", 11500, 20, 29, 5)
        ]
    },

    "onitsha-transport": {
        city: "onitsha",
        name: "Transport Terminal",
        icon: "🚌",
        description: "Help coordinate goods moving between customers and traders.",
        npc: "Chinedu",
        jobs: [
            makeJob("Prepare a dispatch record", 8500, 17, 24, 4),
            makeJob("Coordinate a parcel movement", 12000, 21, 30, 5)
        ]
    },

    "onitsha-tech": {
        city: "onitsha",
        name: "Business Tech Corner",
        icon: "💻",
        description: "Help traders use websites and digital tools to reach more customers.",
        npc: "Adaeze",
        jobs: [
            makeJob("Create a product catalogue", 11000, 19, 28, 4),
            makeJob("Set up a business webpage", 14500, 23, 33, 5)
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
    Tunde: {
        icon: "🧑🏾‍💻",
        role: "Developer",
        text: "Small businesses need digital help every day."
    },
    Emeka: {
        icon: "🧑🏾",
        role: "Logistics",
        text: "If you are dependable, there is always a delivery."
    },
    "Aunty Kemi": {
        icon: "👩🏾‍🍳",
        role: "Food vendor",
        text: "Good service brings repeat customers."
    },
    Sarah: {
        icon: "👩🏾‍💼",
        role: "Business consultant",
        text: "Professional clients pay more, but they expect quality."
    },
    Zainab: {
        icon: "👩🏾‍💼",
        role: "Business analyst",
        text: "Good preparation makes a professional stand out."
    },
    Hauwa: {
        icon: "👩🏾‍🦱",
        role: "Market trader",
        text: "Accurate stock records help a business grow."
    },
    David: {
        icon: "🧑🏾‍💻",
        role: "Tech founder",
        text: "A good portfolio can open doors to better projects."
    },
    "Mama Ronke": {
        icon: "👩🏾‍🦱",
        role: "Trader",
        text: "Every business needs someone who can be trusted."
    },
    Femi: {
        icon: "🧑🏾‍🎨",
        role: "Digital creative",
        text: "Local businesses need better ways to reach customers."
    },
    Bayo: {
        icon: "🧑🏾",
        role: "Transport coordinator",
        text: "Planning ahead makes deliveries run more smoothly."
    },
    Amaka: {
        icon: "👩🏾‍💼",
        role: "Operations specialist",
        text: "Good records make difficult work easier."
    },
    Chika: {
        icon: "👩🏾‍🦱",
        role: "Market trader",
        text: "Customers remember businesses that serve them well."
    },
    Tamuno: {
        icon: "🧑🏾",
        role: "Logistics coordinator",
        text: "Reliable updates help customers trust a delivery service."
    },
    Osas: {
        icon: "🧑🏾",
        role: "Merchant",
        text: "Organised stock helps me serve customers faster."
    },
    Efe: {
        icon: "🧑🏾‍💻",
        role: "Web designer",
        text: "Digital skills can help small businesses grow."
    },
    Osayande: {
        icon: "🧑🏾‍💼",
        role: "Business manager",
        text: "A clear sales report helps us make better decisions."
    },
    "Mr. Okeke": {
        icon: "🧑🏾",
        role: "Wholesaler",
        text: "Trade moves faster when everyone knows what is in stock."
    },
    Chinedu: {
        icon: "🧑🏾",
        role: "Dispatch coordinator",
        text: "Every parcel needs the right record and destination."
    },
    Adaeze: {
        icon: "👩🏾‍💻",
        role: "Digital consultant",
        text: "Let's help more local businesses get online."
    }
};

/* ==========================================
   5. GENERAL HELPERS
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

    if (element) {
        element.textContent = message;
    }
}

function spendEnergy(amount) {
    if (game.energy < amount) {
        showMessage("You're low on energy. Rest before taking on more work.");
        return false;
    }

    game.energy -= amount;
    return true;
   const DAILY_EXPENSES = {
    food: 1000,
    transport: 500,
    accommodation: 1000
};

function getDailyExpenses() {
    return Object.values(DAILY_EXPENSES).reduce(
        (total, amount) => total + amount,
        0
    );
}

function advanceDay() {
    game.day++;

    const expenses = getDailyExpenses();
    const amountPaid = Math.min(game.cash, expenses);

    game.cash -= amountPaid;
    game.totalExpensesPaid += amountPaid;

    log(
        `Daily expenses: ${money(amountPaid)} paid ` +
        `for food, transport and accommodation.`
    );

    if (amountPaid < expenses) {
        log(
            `You couldn't cover ${money(expenses - amountPaid)} ` +
            `of today's expenses.`
        );
    }
}

function getPlayerLevel() {
    return Math.floor(game.xp / 100) + 1;
}

function getLevelProgress() {
    return game.xp % 100;
}
}

function getElement(id) {
    return document.getElementById(id);
}

/* ==========================================
   6. CITY THEME & HEADER
   ========================================== */

function renderCityTheme() {
    const city = currentCity();

    document.body.dataset.theme = game.currentCity;
    document.documentElement.dataset.theme = game.currentCity;

    const cityName = getElement("cityName");
    const cityIcon = getElement("cityIcon");
    const cityMood = getElement("cityMood");
    const mapTitle = getElement("mapTitle");
    const cityStatus = getElement("cityStatus");
    const locationText = getElement("locationText");

    if (cityName) cityName.textContent = city.name;
    if (cityIcon) cityIcon.textContent = city.icon;

    if (cityMood) {
        cityMood.textContent = `${city.mood} · ${city.description}`;
    }

    if (mapTitle) mapTitle.textContent = city.mapTitle;
    if (cityStatus) cityStatus.textContent = city.status;

    if (locationText) {
        locationText.textContent =
            `You are at ${currentLocation().name}, ${city.name}.`;
    }

    const metaTheme = document.querySelector('meta[name="theme-color"]');

    if (metaTheme) {
        metaTheme.content = city.themeColor;
    }

    const selector = getElement("citySelector");

    if (selector) {
        selector.value = game.currentCity;
    }
}

/* ==========================================
   7. CITY DROPDOWN
   ========================================== */

function setupCitySelector() {
    const identity = document.querySelector(".city-identity");

    if (!identity || getElement("citySelector")) return;

    const wrapper = document.createElement("label");
    wrapper.className = "city-selector-wrap";
    wrapper.htmlFor = "citySelector";

    const label = document.createElement("span");
    label.className = "eyebrow";
    label.textContent = "TRAVEL TO";

    const select = document.createElement("select");
    select.id = "citySelector";
    select.setAttribute("aria-label", "Travel to another city");

    Object.entries(cities).forEach(([id, city]) => {
        const option = document.createElement("option");
        option.value = id;
        option.textContent = city.name;
        select.appendChild(option);
    });

    wrapper.append(label, select);
    identity.appendChild(wrapper);

    select.value = game.currentCity;

    select.addEventListener("change", () => {
        travelToCity(select.value);
    });
}

/* ==========================================
   8. CLICKABLE CITY CARDS
   ========================================== */

function renderCityCards() {
    const container = getElement("cityCards");

    // This allows the script to work even if the cards
    // section has not yet been added to the HTML.
    if (!container) return;

    container.replaceChildren();

    Object.entries(cities).forEach(([id, city]) => {
        const isCurrent = game.currentCity === id;

        const card = document.createElement("button");
        card.type = "button";
        card.className = "city-card";

        if (isCurrent) {
            card.classList.add("active");
        }

        card.setAttribute(
            "aria-label",
            isCurrent ? `${city.name}, current city` : `Travel to ${city.name}`
        );

        card.setAttribute("aria-pressed", String(isCurrent));

        // The images must exist in images/cities/.
        card.style.setProperty(
            "--city-image",
            `url("images/cities/${city.image}")`
        );

        const top = document.createElement("div");
        top.className = "city-card-top";

        const icon = document.createElement("span");
        icon.className = "city-card-icon";
        icon.textContent = city.icon;

        const badge = document.createElement("span");
        badge.className = "city-card-badge";
        badge.textContent = isCurrent ? "CURRENT CITY" : "EXPLORE";

        top.append(icon, badge);

        const content = document.createElement("div");
        content.className = "city-card-content";

        const heading = document.createElement("h3");
        heading.textContent = city.name;

        const description = document.createElement("p");
        description.textContent = `${city.mood} · ${city.description}`;

        const action = document.createElement("span");
        action.className = "city-card-action";
        action.textContent = isCurrent ? "You're here ✓" : "Travel here →";

        content.append(heading, description, action);
        card.append(top, content);

        card.addEventListener("click", () => {
            if (game.currentCity !== id) {
                travelToCity(id);
            }
        });

        container.appendChild(card);
    });
}

/* ==========================================
   9. TRAVEL BETWEEN CITIES
   ========================================== */

function travelToCity(cityId) {
    if (!cities[cityId] || cityId === game.currentCity) return;

    if (!spendEnergy(10)) {
        const selector = getElement("citySelector");

        if (selector) {
            selector.value = game.currentCity;
        }

        return;
    }

   game.currentCity = cityId;
game.currentLocation = cities[cityId].startLocation;
advanceDay();

    log(`Travelled to ${cities[cityId].name}.`);

    showMessage(
        `Welcome to ${cities[cityId].name}! ${cities[cityId].mood} awaits.`
    );

    render();
}

/* ==========================================
   10. CITY MAP
   ========================================== */

function renderMap() {
    const map = getElement("cityMap");

    if (!map) return;

    map.replaceChildren();

    cityLocations().forEach(([id, location]) => {
        const button = document.createElement("button");

        button.type = "button";
        button.className = "place";

        if (game.currentLocation === id) {
            button.classList.add("active");
            button.setAttribute("aria-current", "location");
        }

        const icon = document.createElement("span");
        icon.className = "place-icon";
        icon.textContent = location.icon;

        const name = document.createElement("span");
        name.className = "place-name";
        name.textContent = location.name;

        const small = document.createElement("span");
        small.className = "place-small";
        small.textContent =
            game.currentLocation === id ? "YOU ARE HERE" : "Explore";

        button.append(icon, name, small);
        button.addEventListener("click", () => travelTo(id));

        map.appendChild(button);
    });
}

/* ==========================================
   11. TRAVEL BETWEEN NEIGHBOURHOODS
   ========================================== */

function travelTo(locationId) {
    const destination = locations[locationId];

    if (!destination || destination.city !== game.currentCity) return;
    if (game.currentLocation === locationId) return;

    if (!spendEnergy(5)) return;

    game.currentLocation = locationId;
advanceDay();

    log(`Travelled to ${destination.name} in ${currentCity().name}.`);

    showMessage(`You arrived at ${destination.name}.`);

    render();
}

/* ==========================================
   12. LOCATION PANEL & AVAILABLE JOBS
   ========================================== */

function renderLocation() {
    const location = currentLocation();
    const panel = getElement("locationPanel");

    if (!panel) return;

    const locationText = getElement("locationText");

    if (locationText) {
        locationText.textContent =
            `You are at ${location.name}, ${currentCity().name}.`;
    }

    panel.replaceChildren();

    const title = document.createElement("div");
    title.className = "location-title";
    title.textContent = `${location.icon} ${location.name}`;

    const description = document.createElement("div");
    description.className = "location-description";
    description.textContent = location.description;

    panel.append(title, description);
}

function renderAvailableJobs() {
    const location = currentLocation();
    const panel = getElement("locationPanel");

    if (!panel) return;

    const jobsContainer = document.createElement("div");
    jobsContainer.className = "jobs";

    if (!location.jobs || location.jobs.length === 0) {
        const empty = document.createElement("p");
        empty.className = "muted";
        empty.textContent =
            "No jobs available here right now. Explore another location.";

        jobsContainer.appendChild(empty);
        panel.appendChild(jobsContainer);
        return;
    }

    const heading = document.createElement("h3");
    heading.textContent = "Available Jobs";
    jobsContainer.appendChild(heading);

    location.jobs.forEach((job, index) => {
        const row = document.createElement("div");
        row.className = "mission";

        const details = document.createElement("div");

        const title = document.createElement("div");
        title.className = "mission-title";
        title.textContent = job.title;

        const info = document.createElement("div");
        info.className = "mission-details";
        info.textContent =
            `Reward: ${money(job.reward)} · Energy: ${job.energy} · XP: ${job.xp}`;

        details.append(title, info);

        const button = document.createElement("button");
        button.type = "button";
        button.className = "mission-button";
        button.textContent = "Accept";

        button.addEventListener("click", () => acceptMission(index));

        row.append(details, button);
        jobsContainer.appendChild(row);
    });

    panel.appendChild(jobsContainer);
}

/* ==========================================
   13. NPC SYSTEM
   ========================================== */

function renderNPCs() {
    const location = currentLocation();
    const container = getElement("npcs");
    const opportunity = getElement("opportunity");

    if (!container || !opportunity) return;

    container.replaceChildren();
    opportunity.replaceChildren();

    if (!location.npc || !npcs[location.npc]) {
        const message = document.createElement("p");
        message.className = "muted";
        message.textContent =
            "Enjoy the neighbourhood. Visit another spot to meet people.";

        container.appendChild(message);

        const hint = document.createElement("p");
        hint.className = "muted";
        hint.textContent =
            "Explore the city to discover your next opportunity.";

        opportunity.appendChild(hint);
        return;
    }

    const npc = npcs[location.npc];

    const card = document.createElement("div");
    card.className = "npc-card";

    const info = document.createElement("div");
    info.className = "npc-info";

    const avatar = document.createElement("div");
    avatar.className = "npc-avatar";
    avatar.textContent = npc.icon;

    const text = document.createElement("div");

    const name = document.createElement("strong");
    name.textContent = location.npc;

    const role = document.createElement("div");
    role.className = "npc-role";
    role.textContent = npc.role;

    const dialogue = document.createElement("p");
    dialogue.textContent = npc.text;

    text.append(name, role, dialogue);
    info.append(avatar, text);

    const talkButton = document.createElement("button");
    talkButton.type = "button";
    talkButton.id = "talkButton";
    talkButton.className = "secondary-button";
    talkButton.textContent = "Talk";
    talkButton.addEventListener("click", talkToNPC);

    card.append(info, talkButton);
    container.appendChild(card);

    const opportunityCard = document.createElement("div");
    opportunityCard.className = "opportunity-card";

    const opportunityTitle = document.createElement("strong");
    opportunityTitle.textContent = `${npc.role} opportunity`;

    const opportunityText = document.createElement("p");
    opportunityText.className = "muted";
    opportunityText.textContent = npc.text;

    const opportunityHint = document.createElement("p");
    opportunityHint.className = "mission-details";
    opportunityHint.textContent =
        "Visit the Available Jobs section to find work.";

    opportunityCard.append(
        opportunityTitle,
        opportunityText,
        opportunityHint
    );

    opportunity.appendChild(opportunityCard);
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
   14. ACCEPT MISSIONS
   ========================================== */

function acceptMission(index) {
    const location = currentLocation();
    const job = location.jobs?.[index];

    if (!job) {
        showMessage("That job is no longer available.");
        return;
    }

    const alreadyAccepted = game.missions.some(
        mission =>
            mission.title === job.title &&
            mission.locationId === game.currentLocation &&
            mission.city === game.currentCity
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
   15. ACTIVE MISSIONS
   ========================================== */

function renderMissions() {
    const container = getElement("missions");

    if (!container) return;

    container.replaceChildren();

    if (game.missions.length === 0) {
        const empty = document.createElement("p");
        empty.className = "muted";
        empty.textContent =
            "No active missions yet. Explore a location and accept a job.";

        container.appendChild(empty);
        return;
    }

    game.missions.forEach((mission, index) => {
        const row = document.createElement("div");
        row.className = "mission";

        const details = document.createElement("div");

        const title = document.createElement("div");
        title.className = "mission-title";
        title.textContent = mission.title;

        const info = document.createElement("div");
        info.className = "mission-details";
        info.textContent =
            `${cities[mission.city]?.name || "Nigeria"} · ` +
            `Reward: ${money(mission.reward)} · ` +
            `+${mission.reputation} reputation · +${mission.xp} XP`;

        details.append(title, info);

        const button = document.createElement("button");
        button.type = "button";
        button.className = "mission-button";
        button.textContent = "Complete";
        button.disabled = game.energy < mission.energy;

        button.addEventListener("click", () => completeMission(index));

        row.append(details, button);
        container.appendChild(row);
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

    // 25% of each job reward goes to the Japa Fund.
    const savings = Math.round(mission.reward * 0.25);
    game.japaFund += savings;

    game.missions.splice(index, 1);
advanceDay();

    log(
        `Completed "${mission.title}". Earned ${money(mission.reward)} and added ${money(savings)} to the Japa Fund.`
    );

    showMessage(
        `Mission complete! ${money(mission.reward)} earned; ` +
        `${money(savings)} added to your Japa Fund.`
    );

    render();
}

/* ==========================================
   16. JAPA SAVINGS
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
   17. REST & ENERGY
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
   18. PLAYER STATS & FUND PROGRESS
   ========================================== */

function renderStats() {
    const values = {
        cash: money(game.cash),
        energy: game.energy,
        reputation: game.reputation,
        xp: game.xp,
        japaFund: money(game.japaFund),
        day: game.day,
        fundAmount: money(game.japaFund)
    };

    Object.entries(values).forEach(([id, value]) => {
        const element = getElement(id);

        if (element) {
            element.textContent = value;
        }
    });

    const progress = Math.min(
        100,
        (game.japaFund / FUND_TARGET) * 100
    );

    const progressBar = document.querySelector(".progress-bar");
    const progressFill = getElement("fundProgress");

    if (progressFill) {
        progressFill.style.width = `${progress}%`;
    }

    if (progressBar) {
        progressBar.setAttribute(
            "aria-valuenow",
            String(Math.min(FUND_TARGET, game.japaFund))
        );

        progressBar.setAttribute("aria-valuemax", String(FUND_TARGET));
        progressBar.setAttribute("aria-valuemin", "0");
    }
}

/* ==========================================
   19. JOURNEY LOG
   ========================================== */

function renderLog() {
    const container = getElement("journeyLog");

    if (!container) return;

    container.replaceChildren();

    if (game.logs.length === 0) {
        const empty = document.createElement("p");
        empty.className = "muted";
        empty.textContent =
            "Your journey starts here. Make your first move.";

        container.appendChild(empty);
        return;
    }

    game.logs.forEach(entry => {
        const element = document.createElement("div");
        element.className = "log-entry";
        element.textContent = entry;
        container.appendChild(element);
    });
}

/* ==========================================
   20. MAIN RENDER
   ========================================== */

function render() {
    renderCityTheme();

    // Update the clickable city cards every time
    // the player changes city or game state.
    renderCityCards();

    renderStats();
    renderMap();
    renderLocation();
    renderAvailableJobs();
    renderNPCs();
    renderMissions();
    renderLog();

    // Quiet autosave preserves the current message.
    saveGame();
}

/* ==========================================
   21. BUTTONS & STARTUP
   ========================================== */

function initialiseGame() {
    const saveButton = getElement("saveButton");
    const restButton = getElement("restButton");

    if (saveButton) {
        saveButton.addEventListener("click", saveMoney);
    }

    if (restButton) {
        restButton.addEventListener("click", rest);
    }

    const hasSave = loadGame();

    if (!hasSave) {
        log("You arrived in Lagos with ₦25,000. Your Japa story begins.");
    }

    setupCitySelector();
    render();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialiseGame);
} else {
    initialiseGame();
}

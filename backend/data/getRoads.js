const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "roads.json");
const metadataPath = path.join(__dirname, "roads.metadata.json");

// Covers Thane and Navi Mumbai. Keep this value in the cache metadata
// so a previous, smaller roads.json is never accidentally reused.
const coverage = {
    name: "Thane - Navi Mumbai",
    bounds: [19.00, 72.82, 19.36, 73.18]
};

// Smaller requests are more reliable than one large Overpass request.
// The areas overlap slightly so that routes can cross regional boundaries.
const downloadAreas = [
    [19.13, 72.82, 19.36, 73.12], // Thane
    [19.00, 72.90, 19.22, 73.18]  // Navi Mumbai / Airoli / Belapur
];

const overpassServers = [
    "https://overpass.kumi.systems/api/interpreter",
    "https://overpass-api.de/api/interpreter"
];

function makeQuery(bounds) {

    const [south, west, north, east] = bounds;

    return `
[out:json][timeout:180];
way["highway"~"^(motorway|trunk|primary|secondary|tertiary|unclassified|residential|service|living_street)$"]
(${south},${west},${north},${east});
out geom;
`;
}

function hasCurrentCoverage() {

    if (!fs.existsSync(metadataPath)) {
        return false;
    }

    try {

        const metadata = JSON.parse(
            fs.readFileSync(metadataPath, "utf-8")
        );

        return JSON.stringify(metadata.bounds) ===
            JSON.stringify(coverage.bounds);

    } catch (error) {

        return false;

    }
}

async function getRoads() {

    // Check if local data already exists
    if (fs.existsSync(filePath) && hasCurrentCoverage()) {

        const fileData = fs.readFileSync(
            filePath,
            "utf-8"
        );

        const roads = JSON.parse(fileData);

        if (roads.length > 0) {

            console.log(
                `Loading ${coverage.name} road data from local file...`
            );

            console.log(
                "Number of roads:",
                roads.length
            );

            return roads;
        }
    }

    // Download from Overpass
    try {

        console.log(
            `Downloading road data for ${coverage.name}...`
        );

        const roadsById = new Map();

        for (const area of downloadAreas) {

            let data = null;

            for (const url of overpassServers) {

                try {

                    const response = await fetch(url, {

                        method: "POST",

                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                            "User-Agent": "RouteOptimizationProject/1.0"
                        },

                        body: `data=${encodeURIComponent(makeQuery(area))}`
                    });

                    console.log("Overpass status:", response.status);

                    if (response.ok) {
                        data = await response.json();
                        break;
                    }

                    console.log(
                        "Overpass server failed. Trying next server..."
                    );

                } catch (error) {

                    console.log(
                        "Overpass request failed:",
                        error.message
                    );

                    console.log(
                        "Trying next Overpass server..."
                    );
                }
            }

            if (!data) {
                throw new Error("Unable to download one or more map regions.");
            }

            for (const road of data.elements) {
                roadsById.set(road.id, road);
            }
        }

        const roads = [...roadsById.values()];

        console.log(
            "Road data received!"
        );

        console.log(
            "Number of roads:",
            roads.length
        );

        // Save locally
        fs.writeFileSync(
            filePath,
            JSON.stringify(
                roads,
                null,
                2
            )
        );

        fs.writeFileSync(
            metadataPath,
            JSON.stringify(
                {
                    ...coverage,
                    downloadedAt: new Date().toISOString()
                },
                null,
                2
            )
        );

        console.log("Road data and coverage metadata saved.");

        return roads;

    } catch (error) {

        console.error(
            "Error getting road data:"
        );

        console.error(error);

        return null;
    }
}

module.exports = getRoads;

const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "roads.json");

const query = `
[out:json][timeout:120];

way["highway"]
(19.04,72.96,19.12,73.06);

out geom;
`;

async function getRoads() {

    // Check if local data already exists
    if (fs.existsSync(filePath)) {

        const fileData = fs.readFileSync(
            filePath,
            "utf-8"
        );

        const roads = JSON.parse(fileData);

        if (roads.length > 0) {

            console.log("Loading road data from local file...");

            console.log(
                "Number of roads:",
                roads.length
            );

            return roads;
        }
    }

    // Download from Overpass
    try {

        console.log("Downloading road data from Overpass...");

        const url =
            "https://overpass.kumi.systems/api/interpreter";

        const response = await fetch(url, {

            method: "POST",

            headers: {
                "Content-Type":
                    "application/x-www-form-urlencoded",

                "User-Agent":
                    "RouteOptimizationProject/1.0"
            },

            body:
                `data=${encodeURIComponent(query)}`
        });

        console.log(
            "Status:",
            response.status
        );

        if (!response.ok) {

            const errorText =
                await response.text();

            console.log(
                "Response:",
                errorText
            );

            return null;
        }

        const data =
            await response.json();

        const roads =
            data.elements;

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

        console.log(
            "Road data saved to roads.json"
        );

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
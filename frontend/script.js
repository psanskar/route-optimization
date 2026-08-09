console.log("Frontend JavaScript loaded!");

// ==========================================
// CUSTOM MAP ICONS
// ==========================================

const sourceIcon = L.divIcon({
    className: "custom-marker",
    html: `
        <div class="source-pin">
            S
        </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18]
});


const destinationIcon = L.divIcon({
    className: "custom-marker",
    html: `
        <div class="destination-pin">
            D
        </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18]
});

let routeLine = null;

const map = L.map("map").setView(
    [19.0330, 73.0297],
    13
);

L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        attribution: "© OpenStreetMap contributors"
    }
).addTo(map);


// ===============================
// MARKERS
// ===============================

let sourceMarker = null;
let destinationMarker = null;

let source = null;
let destination = null;


// ===============================
// MAP CLICK
// ===============================

map.on("click", function(event) {

    const latitude = event.latlng.lat;
    const longitude = event.latlng.lng;


    // First click = Source
    if (sourceMarker === null) {

        source = [latitude, longitude];

        sourceMarker = L.marker(source, {
            icon: sourceIcon
        })
            .addTo(map)
            .bindPopup("Starting Point")
            .openPopup();

        document.getElementById("source").value =
            `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;

        document.getElementById("routeStatus").textContent =
            "Starting point selected. Now select your destination.";

        console.log("Source:", source);

    }

    // Second click = Destination
    else if (destinationMarker === null) {

        destination = [latitude, longitude];

        destinationMarker = L.marker(destination, {
            icon: destinationIcon
        })
            .addTo(map)
            .bindPopup("Destination")
            .openPopup();

        document.getElementById("destination").value =
            `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;

        document.getElementById("routeStatus").textContent =
            "Destination selected. Click Find Route to calculate the optimal path.";

        console.log("Destination:", destination);

    }

});


// ===============================
// FIND ROUTE
// ===============================

async function findRoute() {

    if (!source || !destination) {

        alert("Please select source and destination.");

        return;
    }


    const findButton =
        document.getElementById("findRoute");


    findButton.disabled = true;
    findButton.textContent = "Finding Route...";


    try {

        console.log("Finding route...");


        // Get selected algorithm
        const algorithm =
            document.getElementById("algorithm").value;


        console.log(
            "Selected algorithm:",
            algorithm
        );


        // Send request to backend
        const response = await fetch(
            "/api/route",
            {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    source: source,

                    destination: destination,

                    algorithm: algorithm

                })

            }
        );


        const data = await response.json();


        console.log(
            "Route result:",
            data
        );


        // Check backend error
        if (data.error) {

            alert(data.error);

            return;
        }


        // ===============================
        // ROUTE INFORMATION
        // ===============================

        document.getElementById(
            "nodesExplored"
        ).textContent =
            data.nodesExplored;


        document.getElementById(
            "executionTime"
        ).textContent =
            data.executionTime.toFixed(2) + " ms";


        // Distance
        const distanceKm =
            data.distance / 1000;


        document.getElementById(
            "distance"
        ).textContent =
            distanceKm.toFixed(2) + " km";


        // ETA
        const averageSpeed = 30;

        const timeHours =
            distanceKm / averageSpeed;

        const timeMinutes =
            timeHours * 60;


        document.getElementById(
            "eta"
        ).textContent =
            Math.ceil(timeMinutes) + " min";


        // Display selected algorithm
        document.getElementById(
            "selectedAlgorithm"
        ).textContent =
            algorithm === "astar"
                ? "A*"
                : "Dijkstra";


        // ===============================
        // DRAW ROUTE
        // ===============================

        if (routeLine !== null) {

            map.removeLayer(routeLine);

        }


        const routeCoordinates =
            data.path
                .filter(
                    point =>
                        point !== null &&
                        point !== undefined
                )
                .map(point => {

                    const parts =
                        point.split(",");

                    return [

                        Number(parts[0]),

                        Number(parts[1])

                    ];

                });


        console.log(
            "Route coordinates:",
            routeCoordinates
        );


        if (routeCoordinates.length === 0) {

            alert("No route found.");

            return;
        }


        routeLine = L.polyline(
            routeCoordinates,
            {
                weight: 6,
                opacity: 0.8
            }
        ).addTo(map);


        map.fitBounds(
            routeLine.getBounds()
        );

        document.getElementById("routeStatus").textContent =
            "Route calculated successfully.";


    } catch (error) {

        console.error(
            "Error finding route:",
            error
        );

        alert(
            "Could not find route."
        );


    } finally {

        findButton.disabled = false;

        findButton.textContent =
            "Find Route";

    }

}


// ===============================
// COMPARE ALGORITHMS
// ===============================

async function compareAlgorithms() {

    if (!source || !destination) {

        alert(
            "Please select source and destination."
        );

        return;
    }


    const compareButton =
        document.getElementById(
            "compareAlgorithms"
        );


    compareButton.disabled = true;

    compareButton.textContent =
        "Comparing...";


    try {

        console.log(
            "Starting algorithm comparison..."
        );


        // =================================
        // RUN DIJKSTRA
        // =================================

        console.log(
            "Running Dijkstra..."
        );


        const dijkstraResponse =
            await fetch(
                "/api/route",
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        source: source,

                        destination:
                            destination,

                        algorithm:
                            "dijkstra"

                    })

                }
            );


        const dijkstraData =
            await dijkstraResponse.json();


        // =================================
        // RUN A*
        // =================================

        console.log(
            "Running A*..."
        );


        const astarResponse =
            await fetch(
                "/api/route",
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        source: source,

                        destination:
                            destination,

                        algorithm:
                            "astar"

                    })

                }
            );


        const astarData =
            await astarResponse.json();


        console.log(
            "Dijkstra result:",
            dijkstraData
        );

        console.log(
            "A* result:",
            astarData
        );


        // =================================
        // DISPLAY DIJKSTRA RESULTS
        // =================================

        document.getElementById(
            "dijkstraNodes"
        ).textContent =
            dijkstraData.nodesExplored;


        document.getElementById(
            "dijkstraTime"
        ).textContent =
            dijkstraData.executionTime.toFixed(2)
            + " ms";


        document.getElementById(
            "dijkstraDistance"
        ).textContent =
            (dijkstraData.distance / 1000)
                .toFixed(2)
            + " km";


        // =================================
        // DISPLAY A* RESULTS
        // =================================

        document.getElementById(
            "astarNodes"
        ).textContent =
            astarData.nodesExplored;


        document.getElementById(
            "astarTime"
        ).textContent =
            astarData.executionTime.toFixed(2)
            + " ms";


        document.getElementById(
            "astarDistance"
        ).textContent =
            (astarData.distance / 1000)
                .toFixed(2)
            + " km";


        // =================================
        // CALCULATE IMPROVEMENT
        // =================================

        const nodeReduction =
            (
                (
                    dijkstraData.nodesExplored -
                    astarData.nodesExplored
                )
                /
                dijkstraData.nodesExplored
            ) * 100;


        const timeReduction =
            (
                (
                    dijkstraData.executionTime -
                    astarData.executionTime
                )
                /
                dijkstraData.executionTime
            ) * 100;


        // =================================
        // DISPLAY COMPARISON
        // =================================

        const comparisonResult =
            document.getElementById(
                "comparisonResult"
            );

        let winner;

        if (astarData.executionTime < dijkstraData.executionTime) {

            winner = "A* is faster for this route.";

        } else if (
            dijkstraData.executionTime <
            astarData.executionTime
        ) {

            winner = "Dijkstra is faster for this route.";

        } else {

            winner = "Both algorithms took the same time.";

        }


        comparisonResult.innerHTML = `

            <h3>Performance Comparison</h3>

            <p>
                <strong>Nodes Reduction:</strong>
                A* explored
                ${nodeReduction.toFixed(2)}%
                fewer nodes.
            </p>

            <p>
                <strong>Time Difference:</strong>
                A* was
                ${Math.abs(timeReduction).toFixed(2)}%
                ${timeReduction >= 0 ? "faster" : "slower"}
                than Dijkstra.
            </p>

            <p>
                <strong>Result:</strong>
                ${winner}
            </p>

        `;


        console.log(
            "Comparison completed."
        );


    } catch (error) {

        console.error(
            "Error comparing algorithms:",
            error
        );

        alert(
            "Could not compare algorithms."
        );


    } finally {

        compareButton.disabled = false;

        compareButton.textContent =
            "Compare Algorithms";

    }

}


// ===============================
// FIND ROUTE BUTTON
// ===============================

document
    .getElementById("findRoute")
    .addEventListener(
        "click",
        findRoute
    );


// ===============================
// COMPARE BUTTON
// ===============================

document
    .getElementById("compareAlgorithms")
    .addEventListener(
        "click",
        compareAlgorithms
    );


// ===============================
// RESET
// ===============================

document
    .getElementById("resetRoute")
    .addEventListener(
        "click",
        function() {


            // Remove source marker
            if (sourceMarker !== null) {

                map.removeLayer(
                    sourceMarker
                );

            }


            // Remove destination marker
            if (destinationMarker !== null) {

                map.removeLayer(
                    destinationMarker
                );

            }


            // Remove route
            if (routeLine !== null) {

                map.removeLayer(
                    routeLine
                );

            }


            // Reset variables
            sourceMarker = null;

            destinationMarker = null;

            source = null;

            destination = null;

            routeLine = null;


            // Clear inputs
            document.getElementById(
                "source"
            ).value = "";

            document.getElementById(
                "destination"
            ).value = "";


            // Reset route information
            document.getElementById(
                "distance"
            ).textContent = "--";


            document.getElementById(
                "eta"
            ).textContent = "--";


            document.getElementById(
                "selectedAlgorithm"
            ).textContent =
                "Dijkstra";


            document.getElementById(
                "nodesExplored"
            ).textContent = "--";


            document.getElementById(
                "executionTime"
            ).textContent = "--";


            // Reset comparison
            document.getElementById(
                "dijkstraNodes"
            ).textContent = "--";


            document.getElementById(
                "dijkstraTime"
            ).textContent = "--";


            document.getElementById(
                "dijkstraDistance"
            ).textContent = "--";


            document.getElementById(
                "astarNodes"
            ).textContent = "--";


            document.getElementById(
                "astarTime"
            ).textContent = "--";


            document.getElementById(
                "astarDistance"
            ).textContent = "--";


            document.getElementById(
                "comparisonResult"
            ).innerHTML =
                "Select source and destination, then compare.";


            // Reset algorithm dropdown
            document.getElementById(
                "algorithm"
            ).value = "dijkstra";


            console.log(
                "Route reset."
            );

        }
    );
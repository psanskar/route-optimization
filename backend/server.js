const express = require("express");
const path = require("path");

const buildGraph = require("./data/buildGraph");
const findNearestNode = require("./utils/nearestNode");

const dijkstra = require("./algorithms/dijkstra");
const astar = require("./algorithms/astar");

const app = express();
const PORT = 3000;


// ==========================================
// MIDDLEWARE
// ==========================================

app.use(express.json());

app.use(
    express.static(
        path.join(__dirname, "../frontend")
    )
);


// ==========================================
// HOME PAGE
// ==========================================

app.get("/", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "../frontend/index.html"
        )
    );

});


// ==========================================
// GLOBAL GRAPH
// ==========================================

// The graph will be built ONCE
// when the server starts.

let graph = null;


// ==========================================
// ROUTE API
// ==========================================

app.post("/api/route", async (req, res) => {

    try {

        const {
            source,
            destination,
            algorithm
        } = req.body;


        // Check source and destination
        if (!source || !destination) {

            return res.status(400).json({

                error:
                    "Source and destination are required"

            });

        }


        // Check if graph is ready
        if (!graph) {

            return res.status(503).json({

                error:
                    "Graph is still loading. Please try again."

            });

        }


        // ==========================================
        // FIND NEAREST GRAPH NODES
        // ==========================================

        const sourceNode =
            findNearestNode(
                graph.adjacencyList,
                source[0],
                source[1]
            );


        const destinationNode =
            findNearestNode(
                graph.adjacencyList,
                destination[0],
                destination[1]
            );


        console.log("\nRoute request:");
        console.log(
            "Algorithm:",
            algorithm
        );

        console.log(
            "Source node:",
            sourceNode
        );

        console.log(
            "Destination node:",
            destinationNode
        );


        // ==========================================
        // RUN ALGORITHM
        // ==========================================

        let result;


        if (algorithm === "astar") {

            console.log("Running A*...");

            result = astar(
                graph.adjacencyList,
                sourceNode.node,
                destinationNode.node
            );

        } else {

            console.log("Running Dijkstra...");

            result = dijkstra(
                graph.adjacencyList,
                sourceNode.node,
                destinationNode.node
            );

        }


        // ==========================================
        // SEND RESULT TO FRONTEND
        // ==========================================

        res.json(result);


    } catch (error) {

        console.error(
            "Error calculating route:",
            error
        );


        res.status(500).json({

            error:
                "Error calculating route"

        });

    }

});


// ==========================================
// START SERVER
// ==========================================

async function startServer() {

    try {

        console.log(
            "Building road graph..."
        );


        // Build graph ONLY ONCE
        graph = await buildGraph();


        if (!graph) {

            console.error(
                "Could not build graph."
            );

            return;

        }


        console.log(
            "Graph loaded successfully!"
        );


        console.log(
            "Number of nodes:",
            Object.keys(
                graph.adjacencyList
            ).length
        );


        // Start server only after graph
        // has been successfully built.

        app.listen(
            PORT,
            () => {

                console.log(
                    `Server running at http://localhost:${PORT}`
                );

            }
        );


    } catch (error) {

        console.error(
            "Error starting server:",
            error
        );

    }

}


startServer();
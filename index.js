const express = require("express");
const { MongoClient } = require("mongodb");

const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ihos6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

async function run() {
    try {
        await client.connect();
        const database = client.db("tourisent");
        const packagesCollection = database.collection("packages");

        // Get API
        app.get("/packages", async (req, res) => {
            const cursor = packagesCollection.find({});
            const packages = await cursor.toArray();
            res.send(packages);
        });
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("Tourisent server is running");
});

app.listen(port, () => {
    console.log("Server is running at port " + port);
});

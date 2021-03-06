const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;

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
        const ordersCollection = database.collection("orders");

        // Get packages API
        app.get("/packages", async (req, res) => {
            const cursor = packagesCollection.find({});
            const packages = await cursor.toArray();
            res.send(packages);
        });

        // Get MyOrder collection
        app.get("/myorders", async (req, res) => {
            const cursor = ordersCollection.find({});
            const myOrders = await cursor.toArray();
            res.send(myOrders);
        });

        // Delete users from myorders
        app.delete("/myorders/delete/:id", async (req, res) => {
            const id = req.params.id;
            const item = { _id: ObjectId(id) };
            const result = await ordersCollection.deleteOne(item);
            res.send(result.acknowledged);
        });
        // Delete users from manage orders
        app.delete("/manageorders/delete/:id", async (req, res) => {
            const id = req.params.id;
            const item = { _id: ObjectId(id) };
            const result = await ordersCollection.deleteOne(item);
            res.send(result.acknowledged);
        });

        // Get Manage All Order collection
        app.get("/manageOrders", async (req, res) => {
            const cursor = ordersCollection.find({});
            const manageOrders = await cursor.toArray();
            res.send(manageOrders);
        });

        // Post Packages API
        app.post("/packages", async (req, res) => {
            const singlePackage = req.body;
            console.log(singlePackage);
            const result = await packagesCollection.insertOne(singlePackage);
            console.log(result);
            res.json(result);
        });

        // Post Place Order API
        app.post("/orders", async (req, res) => {
            const singleOrder = req.body;
            console.log(singleOrder);
            const result = await ordersCollection.insertOne(singleOrder);
            console.log(result);
            res.json(result);
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

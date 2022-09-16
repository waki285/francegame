require("dotenv").config();

const express = require("express");
const app = express();
const path = require("node:path");
const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    point: Number
});

const DB = mongoose.createConnection(process.env.MONGO);

const model = DB.model("pointSchema", schema);

app.use(express.static(path.join(__dirname, "..", "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "..", "public", "index.html")));

app.route("/api/average")
    .get(async (req, res) => {
        const all = await model.find({});
        const points = all.map(x => x.point);
        const average = points.reduce((a, b) => a + b) / points.length;
        res.json({ average });
    })
    .post(async (req, res) => {
        if (req.body.point === undefined) return res.send("No point specified");
        const n = new model({ point: req.body.point });
        await n.save();
        res.json({ status: true });
    });

app.post("/api/reset", async (req, res) => {
  if (req.body.password === "italy") {
    await model.deleteMany({ __v: 0 });
    res.send("Succees");
  }
})

app.listen(8080, () => console.log("Running5"));
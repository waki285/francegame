require("dotenv").config();

const express = require("express");
const app = express();
const path = require("node:path");
const mongoose = require("mongoose");
require("./ws");

const schema = new mongoose.Schema({
    point: Number,
    username: String
});

const DB = mongoose.createConnection(process.env.NODE_ENV === "production" ? process.env.MONGO:"mongodb+srv://1:1@cluster0.jqtuvzr.mongodb.net/?retryWrites=true&w=majority");

const model = DB.model("pointSchema", schema);

app.use(express.static(path.join(__dirname, "..", "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "..", "public", "index.html")));

app.route("/api/average")
    .get(async (req, res) => {
        const all = await model.find({});
        if (all.length === 0) return res.json({ average: 0 });
        const points = all.map(x => x.point);
        const average = points.reduce((a, b) => a + b) / points.length;
        res.json({ average });
    })
    .post(async (req, res) => {
        if (req.body.point === undefined) return res.send("No point specified");
        const n = new model({ point: req.body.point, username: req.body.username || "匿名" });
        await n.save();
        res.json({ status: true });
    });

app.post("/api/reset", async (req, res) => {
  if (req.body.password === "italy") {
    await model.deleteMany({ __v: 0 });
    res.send("Success");
    return;
  } else {
    res.send("no");
    return;
  }
});

app.get("/api/count", async (req, res) => {
  const bo = await model.find({});
  res.json({ count: bo.length });
});

app.get("/api/all-average", async (req, res) => {
  const bo = await model.find({});
  res.json(bo.map(x => String(x.point) + " " + x.username));
})

app.listen(8080, () => console.log("Running5"));
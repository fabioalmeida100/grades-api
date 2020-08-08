import express from "express";
import {promises as fs} from "fs";

const { readFile, writeFile } = fs;
global.dataBaseFile = "./db/grades.json";

const app = express();
app.use(express.json());

app.get("/test", (req, res) => {
    res.status(200).send("API is OK");
    res.end();
})

app.listen(3001, async () => {
   console.log("API Started!")
})





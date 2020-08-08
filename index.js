import express from "express";
import gradesRoute from "./routes/grades.js"

global.dataBaseFile = "./db/grades.json";
const app = express();
app.use(express.json());

app.get("/test", (req, res) => {
    res.status(200).send("API is OK");
    res.end();
})

app.use('/grades', gradesRoute);

app.listen(3001, async () => {
   console.log("API Started!")
})





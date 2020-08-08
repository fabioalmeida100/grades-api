import express from "express"
import {promises as fs} from "fs";

const { readFile, writeFile } = fs;
const router = express.Router();

router.post('/create', async (req, res) => {
    try {
      const grade = req.body;
      const dbJson = JSON.parse(await readFile(global.dataBaseFile));
      
      let newGrade = {
        id: dbJson.nextId++,
        student: grade.student,
        subject: grade.subject,
        type: grade.type,
        value: grade.value,
        timestamp: new Date()
      };
      
      dbJson.grades.push(newGrade);
      await writeFile(global.dataBaseFile, JSON.stringify(dbJson, null, 2));

      res.send(newGrade);
    } catch (error) {
      res.status(400).send({"error": error});
    }
})

export default router;
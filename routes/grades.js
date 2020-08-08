import express from "express"
import {promises as fs} from "fs";

const { readFile, writeFile } = fs;
const router = express.Router();

router.post('/create', async (req, res) => {
    try {
      const grade = req.body;
      const dbJson = JSON.parse(await readFile(global.dataBaseFile));
      
      let gradeNew = {
        id: dbJson.nextId++,
        student: grade.student,
        subject: grade.subject,
        type: grade.type,
        value: grade.value,
        timestamp: new Date()
      };
      
      dbJson.grades.push(gradeNew);
      await writeFile(global.dataBaseFile, JSON.stringify(dbJson, null, 2));

      res.send(gradeNew);
    } catch (error) {
      res.status(400).send({"error": error.message});
    }
});

router.patch("/update", async (req, res) => {
    try {
      const grade = req.body;
      const dbJson = JSON.parse(await readFile(global.dataBaseFile));
              
      const index = dbJson.grades.findIndex(a => a.id === grade.id);
      if (index === -1) {
          throw new Error("Registro não encontrado.");
      }

      let gradeUpdated = {
        id: dbJson.grades[index].id,
        student: grade.student,
        subject: grade.subject,
        type: grade.type,
        value: grade.value,
        timestamp: dbJson.grades[index].timestamp
      };

      dbJson.grades[index] = gradeUpdated;

      await writeFile(global.dataBaseFile, JSON.stringify(dbJson, null, 2));

      res.send(dbJson.grades[index]);
    } catch (error) {
      res.status(400).send({"error": error.message});
    }
});

export default router;
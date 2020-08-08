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

router.get("/getById/:id", async (req, res) => {
  try {
    const dbJson = JSON.parse(await readFile(global.dataBaseFile));

    let grade = dbJson.grades.find((grade) => {
      return grade.id === parseInt(req.params.id);
    });

    res.send(grade);

  } catch (err) {
    res.status(400).send({"error": error.message}); 
  }
});

router.get("/getSum/:student/:subject", async (req, res) => {
  try {
    const dbJson = JSON.parse(await readFile(global.dataBaseFile));

    let gradeList = dbJson.grades.filter((grade) => {
      return  (grade.student === req.params.student) && (grade.subject === req.params.subject);
    });

    let totalValue = gradeList.reduce((accumulator, current) => {
      return accumulator + current.value;
    }, 0);

    res.send({total: totalValue});
    
  } catch (err) {
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

router.delete("/delete/:id", async (req, res) => {
    try {
      const dbJson = JSON.parse(await readFile(global.dataBaseFile));

      let gradesUpdated = dbJson.grades.filter(grade => {
        return grade.id != req.params.id;
      })

      dbJson.grades = gradesUpdated;

      await writeFile(global.dataBaseFile, JSON.stringify(dbJson, null, 2));

      res.send(dbJson);

    } catch (error) {
      res.status(400).send({"error": error.message});
    }
});

export default router;
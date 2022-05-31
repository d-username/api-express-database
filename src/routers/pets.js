const express = require("express");
const router = express.Router();
const db = require("../../db");

//get pets by type
router.get("/", async (req, res) => {
  const type = req.query.type;
  let sqlString = "SELECT * FROM 'pets' ";

  if (type) {
    sqlString = ` SELECT * FROM "pets" WHERE type = '${type}'`;
  }

  const result = await db.query(sqlString);
  const pets = result.rows;
  res.json({ pets: pets });
});

//get pet by ID
router.get("/:id", async (req, res) => {
  console.log("req.params.id: ", req.params.id);
  const id = req.params.id;
  const result = await db.query(`SELECT * FROM pets WHERE id = ${id};`);
  console.log("RESULT: ", result.rows[0]);
  const pet = result.rows[0];
  res.json({ pet: pet });
});

//post pet
router.post("/", async (req, res) => {
  console.log("REQ.BODY: ", req.body);

  const result = await db.query(
    `INSERT INTO pets (name, age, type, breed, microchip) 
    VALUES ('${req.body.name}', '${req.body.age}', '${req.body.type}', '${req.body.breed}', '${req.body.microchip}' ) returning *`
  );
  res.json({ pet: result.rows[0] });
});

module.exports = router;

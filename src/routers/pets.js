const express = require("express");
const router = express.Router();
const db = require("../../db");

//get pets by type
router.get("/", async (req, res) => {
  console.log("REQ.QUERY:, ", req.query);
  const type = req.query.type;
  const microchip = req.query.microchip;

  let sqlString = "SELECT * FROM 'pets' ";

  if (type && microchip) {
    sqlString = ` SELECT * FROM "pets" WHERE type = '${type}' AND microchip = '${microchip}'`;
  } else if (type) {
    sqlString = ` SELECT * FROM "pets" WHERE type = '${type}'`;
  }

  const result = await db.query(sqlString);
  const pets = result.rows;
  res.json({ pets: pets });
});

//get pet by ID
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const result = await db.query(`SELECT * FROM pets WHERE id = ${id};`);
  const pet = result.rows[0];
  res.json({ pet: pet });
});

//post pet
router.post("/", async (req, res) => {
  const result = await db.query(
    `INSERT INTO pets (name, age, type, breed, microchip) 
    VALUES ('${req.body.name}', '${req.body.age}', '${req.body.type}', '${req.body.breed}', '${req.body.microchip}' ) returning *`
  );
  res.json({ pet: result.rows[0] });
});

//update pets by ID
router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const result = await db.query(
    `UPDATE pets SET name = '${req.body.name}', age = '${req.body.age}', type = '${req.body.type}', breed = '${req.body.breed}', microchip = '${req.body.microchip}' WHERE id = '${id}' RETURNING * `
  );
  res.json({ pet: result.rows[0] });
});

//delete pets by ID
router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const result = await db.query(
    `DELETE FROM pets WHERE id = ${id} RETURNING * `
  );
  const pet = result.rows[0];
  res.json({ pet: pet });
});

module.exports = router;

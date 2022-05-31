const express = require("express");
const router = express.Router();
const db = require("../../db");

//get books by type and topic
router.get("/", async (req, res) => {
  const type = req.query.type;
  const topic = req.query.topic;
  let sqlString = "SELECT * FROM books ";

  if (type && topic) {
    sqlString = ` SELECT * FROM "books" WHERE type = '${type}' AND topic = '${topic}';`;
  } else if (type) {
    sqlString = ` SELECT * FROM "books" WHERE type = '${type}';`;
  } else if (topic) {
    sqlString = ` SELECT * FROM "books" WHERE topic = '${topic}';`;
  }

  const result = await db.query(sqlString);
  const books = result.rows;
  res.json({ books: books });
});

//get book by ID
router.get("/:id", async (req, res) => {
  console.log("req.params.id: ", req.params.id);
  const id = req.params.id;
  const result = await db.query(`SELECT * FROM books WHERE id = ${id};`);
  console.log("RESULT: ", result.rows[0]);
  const book = result.rows[0];
  res.json({ book: book });
});

//post books
router.post("/", async (req, res) => {
  console.log("REQ.BODY: ", req.body);

  const result = await db.query(
    `INSERT INTO books (title, type, author, topic, publicationDate, pages) 
    VALUES ('${req.body.title}', '${req.body.type}', '${req.body.author}', '${req.body.topic}', '${req.body.publicationDate}', ${req.body.pages} ) returning *`
  );
  res.json({ book: result.rows[0] });
});

module.exports = router;

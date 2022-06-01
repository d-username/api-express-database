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
  const id = req.params.id;
  const result = await db.query(`SELECT * FROM books WHERE id = ${id};`);
  const book = result.rows[0];
  res.json({ book: book });
});

//post books
router.post("/", async (req, res) => {
  const result = await db.query(
    `INSERT INTO books (title, type, author, topic, publicationDate, pages) 
    VALUES ('${req.body.title}', '${req.body.type}', '${req.body.author}', '${req.body.topic}', '${req.body.publicationDate}', ${req.body.pages} ) returning *`
  );
  res.json({ book: result.rows[0] });
});

//update books by ID
router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const result = await db.query(
    `UPDATE books SET title = '${req.body.title}', type = '${req.body.type}', author = '${req.body.author}', topic = '${req.body.topic}', publicationDate = '${req.body.publicationDate}' WHERE id = '${id}' RETURNING * `
  );
  res.json({ book: result.rows[0] });
});

//delete books by ID
router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const result = await db.query(
    `DELETE FROM books WHERE id = ${id} RETURNING * `
  );
  const book = result.rows[0];
  res.json({ book: book });
});

module.exports = router;

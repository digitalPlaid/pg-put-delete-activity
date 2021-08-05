const express = require('express');
const router = express.Router();

const pool = require('../modules/pool');

// Get all books
router.get('/', (req, res) => {
  let queryText = 'SELECT * FROM "books" ORDER BY "title";';
  pool.query(queryText).then(result => {
    // Sends back the results in an object
    res.send(result.rows);
  })
  .catch(error => {
    console.log('error getting books', error);
    res.sendStatus(500);
  });
});

// Adds a new book to the list of awesome reads
// Request body must be a book object with a title and author.
router.post('/',  (req, res) => {
  let newBook = req.body;
  console.log(`Adding book`, newBook);

  let queryText = `INSERT INTO "books" ("author", "title")
                   VALUES ($1, $2);`;
  pool.query(queryText, [newBook.author, newBook.title])
    .then(result => {
      res.sendStatus(201);
    })
    .catch(error => {
      console.log(`Error adding new book`, error);
      res.sendStatus(500);
    });
});

// TODO - PUT
// Updates a book to show that it has been read
// Request must include a parameter indicating what book to update - the id
// Request body must include the content to update - the status
router.put('/:id', (req, res) => {
    let id = req.params.id;
    let status = req.body.status;
    let sqlQuery = `
    UPDATE "books"
    SET "isRead" = $2
    WHERE "id" = $1;
      `;
    let sqlParams = [id, status];
    pool.query(sqlQuery, sqlParams).then(dbResponse => {
      console.log('Succeeded in update');
      s
    })
});



// TODO - DELETE 
// Removes a book to show that it has been read
// Request must include a parameter indicating what book to update - the id
router.delete('/:id', (req, res) => {
  // collect id of book we want to delete
  let id = req.params.id
  let sqlQuery = `
      DELETE FROM "books"
      WHERE "id" = $1
  `;
  pool.query(sqlQuery, [id]).then((dbResponse) => {
    console.log('successfully deleted item: ', id)
    res.sendStatus(204);
  }).catch(error => {
    console.log('DB couldn\'t delete book: ', error);
    res.sendStatus(500);
  })
});

module.exports = router;

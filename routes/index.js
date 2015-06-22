var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://localhost/todo';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;

router.post('/api/v1/todos', function(req, res) {

  var results = [];

  // Grab data from http request
  var data = {text: req.body.text, complete: false};

  // Get a Postgres client from the connection pool
  pg.connect(connectionString, function(err, client, done) {

    console.log(client);

    // SQL Query > Insert Data
    client.query("INSERT INTO items(text, complete) values($1, $2)", [data.text, data.complete]);

    // SQL Query > Select Data
    var query = client.query("SELECT * FROM items ORDER BY id ASC");

    // Stream results back one row at a time
    query.on('row', function(row) {
      results.push(row);
    });

    // After all data is returned, close connection and return results
    query.on('end', function() {
      client.end();
      return res.json(results);
    });

    // Handle errors
    if (err) {
      console.log(err);
    }
  });
});

router.get('/api/v1/todos', function(req, res) {

  var results = [];

  // Get a connection client from the connection pool
  pg.connect(connectionString, function(err, client, done){

    // SQL query > Select Data
    var query = client.query("SELECT * FROM items ORDER BY id ASC");

    // Stream results back one row at a time
    query.on('row', function(row) {
      results.push(row);
    });

    // After all data is returned, close connection and return results
    query.on('end', function() {
      client.end();
      return res.json(results);
    });

    // Handle errors
    if (err) {
      console.log(err);
    }
  });
});

router.put('/api/v1/todos/:todo_id', function(req, res) {

  var results = [];

  // Grab data from the URL parameters
  var id = req.params.todo_id;

  // Grab data from http request
  var data = {text: req.body.text, complete: req.body.complete};

  // Get a connection client from the connection pool
  pg.connect(connectionString, function(err, client, done){

    // SQL query > Update Data
    client.query("UPDATE items SET text=($1), complete=($2) WHERE id=($3)", [data.text, data.complete, id]);

    // SQL query > Select Data
    var query = client.query("SELECT * FROM items ORDER BY id ASC");

    // Stream results back one row at a time
    query.on('row', function(row) {
      results.push(row);
    });

    // After all data is returned, close connection and return results
    query.on('end', function() {
      client.end();
      return res.json(results);
    });

    // Handle errors
    if (err) {
      console.log(err);
    }
  });
});

router.delete('/api/v1/todos/:todo_id', function(req, res) {

  var results = [];

  // Grab data from the URL parameters
  var id = req.params.todo_id;

  // Get a connection client from the connection pool
  pg.connect(connectionString, function(err, client, done){

    // SQL query > Delete Data
    client.query("DELETE FROM items WHERE id=($1)", [id]);

    // SQL query > Select Data
    var query = client.query("SELECT * FROM items ORDER BY id ASC");

    // Stream results back one row at a time
    query.on('row', function(row) {
      results.push(row);
    });

    // After all data is returned, close connection and return results
    query.on('end', function() {
      client.end();
      return res.json(results);
    });

    // Handle errors
    if (err) {
      console.log(err);
    }
  });
});
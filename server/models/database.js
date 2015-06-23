var pg = require('pg');
var path = require('path');
var config = require(path.join(__dirname, '../', '../', 'config'));

var client = new pg.Client(config.connectionString);
client.connect();
var query = client.query('CREATE TABLE items(id SERIAL PRIMARY KEY, text varchar(40) not null, complete BOOLEAN)');
query.on('end', function() { client.end(); });
var express = require('express');
var app = express();

// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 8080;

const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { 
    rejectUnauthorized: false
  }
});
// set the view engine to ejs
app.set('view engine', 'ejs');

// make express look in the public directory for assets (css/js/img)
app.use(express.static(__dirname + '/public'));

// set the home page route
app.get('/', function(req, res) {

    // ejs render automatically looks in the views folder
    res.render('index');
});

function filter(data, companyname) {
  var result = [];
  if (companyname)
      result = data.filter(function (item) { return item.companyname == companyname });
  return result;
}
app.get('/search', async (req, res) => {
  var search = req.param('query');
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM test1' );
    
    const results = { 'results': (result) ? result.rows : null};
    var ob = JSON.parse(results);
    var fresult = filter(ob,search);
    console.log(fresult);
    res.render('db', fresult);
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

app.get("/aboutus", function(req,res){
    //ejs render automatically looks in the views folder
    res.render('aboutus');
});
app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});




var   express           = require('express'),
	    PORT              = process.env.PORT || 3002,
	    server            = express(),
	    MONGOURI          = process.env.MONGOLAB_URI || "mongodb://localhost:27017",
	    dbname            = "same_name",
	    mongoose          = require('mongoose'),
      bodyParser        = require('body-parser'),
      ejs               = require('ejs'),
      expressEjsLayouts = require('express-ejs-layouts'),
      methodOverride    = require('method-override');
      // morgan            = require('morgan');

server.set('views', './views');
server.set('view engine', 'ejs');

// server.use(morgan('dev'));
server.use(express.static('./public'));

server.use(expressEjsLayouts);

server.get('/', function(req, res) {
	res.render('welcome');
});

mongoose.connect(MONGOURI + "/" + dbname);

server.listen(PORT, function () {
	console.log("Up", PORT);
})

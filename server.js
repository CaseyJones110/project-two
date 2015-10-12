var   express           = require('express'),
	    PORT              = process.env.PORT || 3002,
	    server            = express(),
	    MONGOURI          = process.env.MONGOLAB_URI || "mongodb://localhost:27017",
	    dbname            = "same_name",
	    mongoose          = require('mongoose'),
      Schema            = mongoose.Schema,
      bodyParser        = require('body-parser'),
      ejs               = require('ejs'),
      expressEjsLayouts = require('express-ejs-layouts'),
      methodOverride    = require('method-override'),
      morgan            = require('morgan');

var articleSchema = new Schema({
  author: String,
  categories: String,
  body: String
}, {collection: 'articles', strict: false});

var article = mongoose.model('article', articleSchema);

server.set('views', './views');
server.set('view engine', 'ejs');

server.use(morgan('dev'));
server.use(express.static('./public'));
server.use(bodyParser.urlencoded({ extended: true}));
server.use(methodOverride('_method'));
server.use(expressEjsLayouts);

server.get('/', function(req, res) {
	res.render('welcome');
});

server.get('/new', function (req, res) {
  res.render('new_article');
});

mongoose.connect(MONGOURI + "/" + dbname);

server.listen(PORT, function () {
	console.log("Up", PORT);
})

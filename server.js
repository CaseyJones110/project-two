var   express           = require('express'),
	    PORT              = process.env.PORT || 3002,
	    server            = express(),
	    MONGOURI          = process.env.MONGOLAB_URI || "mongodb://localhost:27017",
	    dbname            = "wiki",
	    mongoose          = require('mongoose'),
      Schema            = mongoose.Schema,
      bodyParser        = require('body-parser'),
      ejs               = require('ejs'),
      expressEjsLayouts = require('express-ejs-layouts'),
      methodOverride    = require('method-override'),
      morgan            = require('morgan');

var articleSchema = new Schema({
  title: String,
  author: String,
  categories: [String],
  body: String,
  date: { type: Date, default: Date.now }
}, {collection: 'articles', strict: false});

var Article = mongoose.model('article', articleSchema);

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

server.get('/articles/new', function (req, res) {
  res.render('new_article');
});

server.post('/articles', function (req, res) {
  var article = new Article (req.body.article);
  article.save(function (err, article) {
    if (err) {
      res.redirect(302, '/articles/new');
    } else {
      res.redirect(302, '/articles');
    }
  });
});

server.get('/articles', function (req, res) {
  Article.find({}, function (err, allArticles) {
    if (err) {
      console.log("ERROR ==" + err);
    } else {
      res.render('index', {
        articles: allArticles
      });
    }
  });
});

server.get('/articles/:title', function (req, res) {
  var articleTitle = req.params.title;
  Article.findOne({
    title: articleTitle
  }, function (err, specificArticle) {
    if (err) {
      console.log(err);
    } else {
      res.render('show_one', {
        title: articleTitle,
        article: specificArticle
      });
    }
  });
});

server.get('/articles/:id/edit', function (req, res) {
  var articleID = req.params.id;
  Article.findOne({
    _id: articleID
  }, function (err, specificArticle) {
    if (err) {
      console.log(err);
    } else {
      res.render('edit', {
        article: specificArticle
      });
    }
  });
});

server.patch('/articles/:id', function (req, res) {
  console.log("Patch found");
  var articleID = req.params.id;
  Article.findOne({
    _id: articleID
  }, function (err, specificArticle) {
    if (err) {
      console.log(err);
    } else {
      specificArticle.update(req.body.article, function (errTwo, article) {
        if (errTwo) {
          console.log(errTwo);
        } else {
          res.redirect(302, '/articles');
          console.log("updated!");
        }
      });
    }
  });
});

server.delete('/articles/:id', function (req, res) {
  var articleID = req.params.id;
  Article.remove({
    _id: articleID
  }, function (err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect(302, '/articles');
    }
  });
});

mongoose.connect(MONGOURI + "/" + dbname);

server.listen(PORT, function () {
  console.log("Up", PORT);
})

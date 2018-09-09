const express = require('express');
const router = express.Router();
const orm     = require('orm');
const builder = require('xmlbuilder');
const fs     = require('fs');

const dirPath = __dirname + "/../public/xmlfiles/booksxml.xml";

router.use(orm.express("mysql://root:@localhost:/dbbookstore", {
  define: function (db, models, next) {
    models.book = db.define("tbl_books", { 
    name      : String,                
    price     : Number,
    author    : String, 
    category  : String,
    language  : String,
    ISBN      : String, 
    publish_date : Date 
    });
    next();
  }

}));

/* GET home page. */

router.get('/', function(req, res, next) {
    const xml = builder.create('bookstore');
    const result = req.models.book.find({
      }, function(error, books){
        if(error) throw error;
          for(const i=0; i< books.length; i++){
            xml.ele('book')
                .ele('name', {'lang': books[i]['language']}, books[i]['name']).up()
                .ele('price', books[i]['price']).up()
                .ele('category', books[i]['category']).up()
                .ele('author', books[i]['author']).up()
                .ele('ISBN', books[i]['ISBN']).up()
                .ele('publish_date', books[i]['publish_date']).end();
            }
            const xmldoc = xml.toString({ pretty: true }); 
            fs.writeFile(dirPath, xmldoc, function(err) {
                if(err) { return console.log(err); } 
                console.log("The file was saved!");
                res.render('index', { title: 'Generate XML using NodeJS' });
              }); 
        });
  });

module.exports = router;

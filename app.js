var express = require("express");
var routes = require("./routes/index");
var contactlist = require("./api/contacts");
var shop = require("./api/shop");
var library = require("./api/library");

var http = require('http');
var path = require('path');
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'public'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.bodyParser());
//app.use(express.limit('32kb'));

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
    		title: "Site error",
            message: err.message,
            error: err
        });
    });
};

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
    	title: "Site error",
        message: err.message,
        error: {}
    });
});

//routes
app.get("/", routes.index);
app.get("/:name", routes.view);


//contacts api
app.get("/api/contacts", contactlist.getcontactlist);
app.post("/api/contacts", contactlist.postcontactlist);
app.del("/api/contacts", contactlist.deletecontactlist);
app.put("/api/contacts", contactlist.updatecontacts)

//shop api
app.get("/api/getcategories", shop.getcategories);
app.get("/api/getallproducts", shop.getallproducts);
app.get("/api/getproductsbycategory", shop.getproductsbycategory);
app.get("/api/getproductbyid", shop.getproductbyid);
app.get("/api/getuniquebyproperty", shop.getuniquebyproperty);

//library api
app.get("/api/getfileinfo", library.getfileinfo);


http.createServer(app).listen(app.get("port"), function () {
	console.log("listening on port " + app.get("port"));
});


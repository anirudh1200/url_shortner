const express = require('express'),
			bodyParser    = require('body-parser'),
			mongoose = require('mongoose'),
			Url = require('./urlSchema');

const app = express();

//=======================
// MIDDLEWARE
//=======================

app.use(bodyParser.urlencoded({ extended: false }));

//=======================
// DATABASE CONFIG
//=======================

const db = 'mongodb://localhost/url_shortner';
mongoose.connect(db, { useNewUrlParser: true })
    .then(() => console.log("Database connected"))
    .catch(console.log);

//=======================
// ROUTES
//=======================

app.post('/api/shorten', async (req, res) => {
	const originalUrl = req.body.url;
	const shortUrl = req.body.short;
	if(!originalUrl || !shortUrl){
		res.json({success: false, error: "Please send two keys: url and short"})
	} else {
		const result = await Url.find({shortUrl});
		if(result.length > 0){
			res.json({success: false, error: 'url already exists'});
		} else {
			const newUrl = new Url({
				originalUrl,
				shortUrl
			});
			newUrl.save()
			.then(a => res.json({success: true, newUrl: req.headers.host+'/'+shortUrl}))
			.catch(err => res.json({success: false, error: err}));
		}
	}
});

app.get('/:url', async (req, res) => {
	const shortUrl = req.params.url;
	const result = await Url.findOne({shortUrl});
	if(result){
		res.redirect(result.originalUrl);
	} else {
		res.json({success: false, error: 'no such url'});
	}
});

//=======================
// STARTING THE SERVER
//=======================

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log('App listening on port ' + port);
});
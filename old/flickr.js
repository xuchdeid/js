requirejs.config({
  paths: {
  	ramda: './lib/ramda-0.17.1.min',
  	jquery: './lib/jquery-2.1.4.min'
  }
});

require([
	'ramda',
	'jquery'
	],
	function(_, $) {
		var trace = _.curry(function(tag, x) {
			console.log(tag, x);
			return x;
		});
	// app goes here
	var Impure = {
		getJSON: _.curry(function(callback, url) {
			$.getJSON(url, callback);
		}),

		setHtml: _.curry(function(sel, html) {
			$(sel).html(html);
		})
	};

	var url = function(term) {
		return 'https://api.flickr.com/services/feeds/photos_public.gne?tags=' + term + '&format=json&jsoncallback=?';
	};

	var img = function(url) {
		return $('<img />', {src: url});
	};

	var mediaUrl = _.compose(_.prop('m'), _.prop('media'));

	//var srcs = _.compose(_.map(mediaUrl), _.prop('items'));
	var mediaToImg = _.compose(img, mediaUrl);

	var images = _.compose(_.map(mediaToImg), _.prop('items'));

	var renderImages = _.compose(Impure.setHtml("body"), images);

	var app = _.compose(Impure.getJSON(renderImages), url);

	app("cats");
});


Parse.Cloud.define('getPhotos', function(req, res){
  var Image = require("parse-image");
  Parse.Cloud.httpRequest({ url: req.params.url }).then(function(response) {
    res.success(response);
  }, function(err){
      res.error(err);
  });
});
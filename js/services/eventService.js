app.service('eventService', ['$http', '$q', function($http, $q) {

  var event;

  this.createEvent = function(event) {
    var dfr = $q.defer();
    var EventObject = Parse.Object.extend("Event");
    var eventObject = new EventObject();

    eventObject.set("name", event.name);
    eventObject.set("key", event.key);
    eventObject.set("eventDate", event.eventDate);
    eventObject.set("fbAdmin", event.fbAdmin);
    eventObject.set("instaAdmin", event.instaAdmin);
    eventObject.set("createdAt", event.date);

    eventObject.save(null, {
      success: function(addEvent) {
        dfr.resolve(addEvent);
      },
      error: function(addEvent, error) {
        console.log('Failed to create new object, with error code: ' + error.message);
      }
    });
    return dfr.promise;
  };

  this.getEventWithId = function(id) {
    var dfr = $q.defer();
    var Event = Parse.Object.extend("Event");
    var query = new Parse.Query(Event);
    query.equalTo("objectId", id);
    query.find({
      success: function(results) {
        event = results;
        dfr.resolve(results);
      },
      error: function(error) {
        console.log("Error: " + error.code + " " + error.message);
      }
    });
    return dfr.promise;
  };

  this.getEvent = function(id) {
    var dfr = $q.defer();
    var Event = Parse.Object.extend("Event");
    var query = new Parse.Query(Event);
    query.equalTo("key", id);
    query.find({
      success: function(results) {
        event = results;
        dfr.resolve(results);
      },
      error: function(error) {
        console.log("Error: " + error.code + " " + error.message);
      }
    });
    return dfr.promise;
  };

  this.sendEvent = function() {
    return event;
  };

  this.getPhotos = function(id) {
    var i;
    var dfr = $q.defer();
    var Event = Parse.Object.extend("Event");
    var query = new Parse.Query(Event);
    query.equalTo("objectId", id);
    query.include('photos');
    query.find({
      success: function(event) {

        var Photos = Parse.Object.extend("Photo");
        var photoQuery = new Parse.Query(Photos);
        var eventId = event[0].id;
        photoQuery.equalTo("event", {
          "__type": "Pointer",
          "className": "Event",
          "objectId": eventId
        })
        photoQuery.find({
          success: function(photoResult) {
            dfr.resolve(photoResult);
          }
        })
      },
      error: function(error) {
        console.log("Error: ", error);
      }
    });
    return dfr.promise;
  };

  this.sendEvent = function() {
    return this.event;
  };

  this.deleteEvent = function(id) {
    var dfr = $q.defer();
    var eventId = id;
    var Event = Parse.Object.extend("Event");
    var query = new Parse.Query(Event);
    query.get(id, {
      success: function(eventObj) {
        var str = "It was deleted";
        var photosToDelete = eventObj.attributes.photos || []
        for (var i = 0; i < photosToDelete.length; i++) {

          thisPhoto = photosToDelete[i];
          thisPhoto.destroy({});
        }
        eventObj.destroy({});
        dfr.resolve(str);

      },
      error: function(object, error) {
        dfr.resolve(error);
      }
    });
    return dfr.promise;
  };

  this.deletePhotos = function(selectedPhotos) {
    var dfr = $q.defer();
    for (var i = 0; i < selectedPhotos.length; i += 1) {
      var Photo = Parse.Object.extend("Photo");
      var query = new Parse.Query(Photo);
      query.get(selectedPhotos[i], {
        success: function(eventObj) {
          var str = "It was deleted";
          eventObj.destroy({});
          dfr.resolve(str);
        },
        error: function(object, error) {
          dfr.resolve(error);
        }
      });
    }
    return dfr.promise;
  };

  this.getZipPhotos = function(eventId, photoIdArray) {

    var dfd = $q.defer();
    var promiseArray = [];
    var Photo = Parse.Object.extend("Photo");
    var query = new Parse.Query(Photo);
    var notifyLength = photoIdArray.length;
    var count = 1;

    photoIdArray.forEach(function(val, i, arr) {

      promiseArray.push(query.get(val).then(function(res) {
        var dfdd = $q.defer();
        var photoId = res.attributes.midResolutionImage.url().replace('http', 'https');

        Parse.Cloud.run('getPhotos', {
          url: photoId
        }).then(function(worked) {
          dfdd.resolve(worked);
          dfd.notify((count / notifyLength) * 100);
          count++;
        }, function(notworked) {
          dfdd.reject(notworked);
        });

        return dfdd.promise;
      }));
    });

    $q.all(promiseArray).then(function(res) {
      dfd.resolve(res);
    }, function(err) {
      dfd.reject(err);
    });

    return dfd.promise;

  };

}]); //End AdminCtrl

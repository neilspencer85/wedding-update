app.controller('EventCtrl', ['$scope', '$stateParams', 'eventService', '$location', 'isAuthed', '$mdDialog', 'Lightbox',
    function($scope, $stateParams, eventService, $location, isAuthed, $mdDialog, Lightbox) {

    if(!isAuthed) {
        $location.path('/login');
    }


    // run an IIFE to get the event from the database. Event comes to this controller as "res" in the callback funtion.
    // You have routed here, so you have access to the eventId via $stateParams.eventId -see app.js
    // This is the Id you will use to query the database for that id.
    // Then set whatever you need to the $scope object so you can call it in the html with {{ }}.
    (function getEvent() {
        eventService.getEventWithId($stateParams.eventId).then(function(res){
            $scope.event = res[0].attributes.key;
            $scope.eventId = res[0].id;
        });
    }());

    $scope.openLightboxModal = function (index) {
        Lightbox.openModal($scope.imageUrls, index);
    };

    $scope.getPhotos =function() {
        // console.log('StateParamsId', $stateParams.eventId)
        eventService.getPhotos($stateParams.eventId).then(function(res) {
            // console.log("GetPhotos: ", res);
            $scope.photos = res || [];
            $scope.numberOfPhotos = $scope.photos.length;
            $scope.originalImages = [];
            $scope.images = [];
            $scope.imageUrls = [];
            for(var i = 0; i < $scope.photos.length; i += 1) {
                var imageObj = {};
                if($scope.photos[i].attributes.thumbnailImage._url) {
                    imageObj.thumbImage = $scope.photos[i].attributes.thumbnailImage._url;
                }
                if ($scope.photos[i].attributes.originalImage) {
                    var photoId = $scope.photos[i].id;
                    var photoUrl = $scope.photos[i].attributes.originalImage._url;
                    $scope.imageUrls[i] = photoUrl;
                    $scope.originalImages.push(photoId);
                    imageObj.url = photoId;
                } else {
                    var photoId2 = $scope.photos[i].id;
                    var photoUrl2 = $scope.photos[i].attributes.midResolutionImage ? $scope.photos[i].attributes.midResolutionImage._url : $scope.photos[i].attributes.thumbnailImage._url;
                    $scope.imageUrls[i] = photoUrl2;
                    $scope.originalImages.push(photoId2);
                    imageObj.url = photoId2;
                }
                $scope.images.push(imageObj);
            }
            // console.log($scope.originalImages, $scope.images);
        });
    };

    $scope.getPhotos();

    $scope.openPhotoModal = function (i) {
        // console.log(i);
        $scope.modalPhoto = $scope.photos[i].attributes.thumbnailImage._url;
        $mdDialog.show({
	        controller: DialogController,
	        scope: $scope,
	        preserveScope: true,
	        parent: angular.element(document.body),
	        clickOutsideToClose: true,
	        title: 'Photo',
	        templateUrl: 'views/modalPhotoDialog.html'
	  	}).then(function(res) {
	  	    // console.log("dialog res: ", res);
	  	});
    };

    var selectedPhotos = [];

    $scope.checked = true;

    $scope.imgSelect = function(index) {
        // console.log("index from checkbox: ", index);
        // console.log("indexOf: ", selectedPhotos.indexOf(index));
        if (selectedPhotos.indexOf(index) === -1) {
            selectedPhotos.push(index);
            // console.log("Photos array after push: ", selectedPhotos);
        }
        else {
            selectedPhotos.splice((selectedPhotos.indexOf(index)), 1);
        }
        // console.log("Photos array after splice: ", selectedPhotos);
    };

    $scope.exists = function (index) {
        return (!$scope.checked);
    };

    $scope.logout = function() {
        Parse.User.logOut();
        // console.log("logout");
        $location.path('/login');
    };

    $scope.deleteEvent = function(ev) {
        // console.log("delete event clicked");
	    $mdDialog.show({
	        controller: DialogController,
	        scope: $scope,
	        preserveScope: true,
	        parent: angular.element(document.body),
	        clickOutsideToClose: true,
	        title: 'Delete Event',
	        templateUrl: 'views/deleteEventDialog.html',
	        targetEvent: ev
	  	}).then(function(res) {
	  	    // console.log("dialog res: ", res);
	  	});
    };

    $scope.deletePhotos = function(ev) {
        // console.log("deletePhotos clicked");
        if (selectedPhotos.length > 0) {
            $mdDialog.show({
    	        controller: DialogController,
    	        scope: $scope,
    	        preserveScope: true,
    	        parent: angular.element(document.body),
    	        clickOutsideToClose: true,
    	        title: 'Delete Photos',
    	        templateUrl: 'views/deletePhotosDialog.html',
    	        targetEvent: ev
    	  	}).then(function(res) {
    	  	    // console.log("dialog res: ", res);
                // eventService.deletePhotos(selectedPhotos).then(function(res) {
                //     console.log("deletePhotos res: ", res);
                //     $scope.getPhotos();
                //     $scope.checkbox = false;
                //     angular.forEach($scope.photos, function (photo) {
                //         photo.selected = $scope.checkbox;
                //     });
                // });
    	  	}, function(err) {
    	  	   console.log(err);
    	  	});
        } else {
            $mdDialog.show({
    	        controller: DialogController,
    	        scope: $scope,
    	        preserveScope: true,
    	        parent: angular.element(document.body),
    	        clickOutsideToClose: true,
    	        title: 'Delete Event',
    	        templateUrl: 'views/deletePhotosDialogError.html',
    	        targetEvent: ev
    	  	}).then(function(res) {
    	  	    // console.log("dialog res: ", res);
                // eventService.deletePhotos(selectedPhotos).then(function(res) {
                //     console.log("deletePhotos res: ", res);
                //     $scope.getPhotos();
                //     $scope.checkbox = false;
                //     angular.forEach($scope.photos, function (photo) {
                //         photo.selected = $scope.checkbox;
                //     });
                // });
    	  	}, function(err) {
    	  	   console.log(err);
    	  	});
        }
    };


    function DialogController($scope, $mdDialog) {

          $scope.deleteEventDialog = function() {
            // console.log("deleteEvent inside dialog clicked");
		  	$mdDialog.hide();
		  	eventService.deleteEvent($scope.eventId).then(function(res) {
		  	    // console.log("it was deleted");
                if (res === "It was deleted") {
                    $location.path('/admin');
                }
            });
		  };

		  $scope.deletePhotoSelection = function() {
            // console.log('Delete Photos button clicked')
            $mdDialog.hide();
		    eventService.deletePhotos(selectedPhotos).then(function(res) {
            //   console.log("deletePhotos res: ", res);
              $scope.getPhotos();
              $scope.checkbox = false;
              angular.forEach($scope.photos, function (photo) {
                photo.selected = $scope.checkbox;
              });
            });
		  };


		  // closes Dialog - called from all Dialogs
		  $scope.closeDialog = function() {
		    $mdDialog.hide();
		  };

    }

    $scope.exportPhotos = function(ev) {
        $scope.progress;
        $mdDialog.show({
	        controller: DialogController,
	        scope: $scope,
	        preserveScope: true,
	        parent: angular.element(document.body),
	        clickOutsideToClose: false,
	        title: 'Delete Event',
	        templateUrl: 'views/exportPhotosModal.html',
	        targetEvent: ev
	  	}).finally(function() {
          $mdDialog.hide();
	  	});
        var zip = new JSZip();
        // var photoZip = zip.folder("Event Images");
        eventService.getZipPhotos($stateParams.eventId, $scope.originalImages).then(function(res) {
            // console.log("res: ", res);
            res.forEach(function(val, i, arr){
                zip.file(("Event Photo " + (i + 1)) + '.jpg', val.buffer, { base64: true });
                // console.log(file);
            });
            var zipper = zip.generate({type: "blob"});
            saveAs(zipper, "photos.zip");
        }, function(err){
            console.log(err);
        }, function(notify){
            $scope.progress = Math.floor(notify);
        });
    };

    // $scope.btnScroll = function() {
    //   function fixDiv() {
    //     var $cache = $('#eventBtns');
    //     if ($(window).scrollTop() > 100)
    //       $cache.css({
    //         'position': 'fixed',
    //         'top': '10px'
    //       });
    //     else
    //       $cache.css({
    //         'position': 'relative',
    //       });
    //   }
    //   $(window).scroll(fixDiv);
    //   fixDiv();
    // };

    // $scope.btnScroll();



}]); //End EventCtrl

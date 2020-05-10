    var map;
    var markerlist = [];
    var markers = [];
    var temp;
    var line;
      function initialize() {
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 1.347203, lng: 103.781975},
          zoom: 12,
          gestureHandling: 'cooperative'
        });
        DeleteMenu.prototype = new google.maps.OverlayView(); 
        var drawingManager = new google.maps.drawing.DrawingManager({
          markerOptions: {
            editable: true,
            draggable: true
          }
        });
        drawingManager.setMap(map);
        drawingManager.setOptions({
          drawingControlOptions: {
            position: google.maps.ControlPosition.BOTTOM_LEFT,
            drawingModes: ['marker']
          }
        });
        line = new google.maps.Polyline({
          draggable: true,
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 3
        });
        line.setMap(map);

        var deleteMenu = new DeleteMenu();

        google.maps.event.addListener(drawingManager, 'markercomplete', function(marker) {
          markers.push(marker.getPosition());
          markerlist.push(marker);
          line.setPath(markers);
          google.maps.event.addListener(marker, 'dragstart', function(e){
              temp = markers.indexOf(e.latLng);
          });
          google.maps.event.addListener(marker, 'dragend', function(e){
              markers[temp] = e.latLng;
              line.setPath(markers);
          });
          google.maps.event.addListener(marker, 'rightclick', function(e) {
            deleteMenu.open(map, marker.getPosition(), e.vertex);
          });
        });
      }
      function deleteMarkers() {
        for (var i = 0; i < markerlist.length; i++) {
          markerlist[i].setMap(null);
        }
        markerlist = [];
        markers = [];
        line.setPath(markers);
      }
      /**
       * A menu that lets a user delete a selected marker.
       * @constructor
       */

      function DeleteMenu() {
        this.div_ = document.createElement('div');
        this.div_.className = 'delete-menu';
        this.div_.innerHTML = 'Delete';

        var menu = this;
        google.maps.event.addDomListener(this.div_, 'click', function(e) {
          menu.removeVertex();
          e.stopPropagation();
        });
        this.onAdd = function() {
          var deleteMenu = this;
          var map = this.getMap();
          this.getPanes().floatPane.appendChild(this.div_);

          // mousedown anywhere on the map except on the menu div will close the
          // menu.
          this.divListener_ = google.maps.event.addDomListener(map.getDiv(), 'mousedown', function(e) {
            if (e.target != deleteMenu.div_) {
              deleteMenu.close();
            }
          }, true);
        }
        this.onRemove = function() {
          google.maps.event.removeListener(this.divListener_);
          this.div_.parentNode.removeChild(this.div_);
          this.set('position');
          this.set('vertex');
        }

        this.close = function() {
          this.setMap(null);
        }

        this.draw = function() {
          var position = this.get('position');
          var projection = this.getProjection();

          if (!position || !projection) {
            return;
          }

          var point = projection.fromLatLngToDivPixel(position);
          this.div_.style.top = point.y + 'px';
          this.div_.style.left = point.x + 'px';
      }

        /**
         * Opens the menu at the position of a marker.
         */
      this.open = function(map, position, vertex) {
          this.set('position', position);
          this.set('vertex', vertex);
          this.setMap(map);
          this.draw();
          return;
      }

        /**
         * Deletes the marker from the map.
         */
      this.removeVertex = function() {
          var position = this.get('position');
          temp = markers.indexOf(position);
          markerlist[temp].setMap(null);
          markers.splice(temp,1);
          markerlist.splice(temp,1);
          line.setPath(markers);
          this.close();
        }
      }
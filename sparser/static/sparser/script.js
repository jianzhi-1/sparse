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
        var heatMapData = [
          {location: new google.maps.LatLng(1.3471, 103.66), weight: 0.5},
          new google.maps.LatLng(1.3471, 103.65),
          {location: new google.maps.LatLng(1.3471, 103.676), weight: 2},
          {location: new google.maps.LatLng(1.34724, 103.655), weight: 3},
          {location: new google.maps.LatLng(1.3474, 103.673), weight: 2},
          new google.maps.LatLng(1.3469, 103.653),
          {location: new google.maps.LatLng(1.3472, 103.661), weight: 0.5},
          {location: new google.maps.LatLng(1.3476, 103.672), weight: 3},
          {location: new google.maps.LatLng(1.3474, 103.663), weight: 2},
          new google.maps.LatLng(1.3476, 103.666),
          {location: new google.maps.LatLng(1.347, 103.668), weight: 0.5},
          new google.maps.LatLng(1.3472, 103.658),
          {location: new google.maps.LatLng(1.3471, 103.66), weight: 2},
          {location: new google.maps.LatLng(1.3476, 103.663), weight: 3}
        ];
        var heatmap = new google.maps.visualization.HeatmapLayer({
          data: heatMapData
        });
        heatmap.setMap(map);
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
          //deleteMenu.open(map, line.getPath(), line.getPath().length - 1);
          markers.push(marker.getPosition());
          markerlist.push(marker);
          line.setPath(markers);
          google.maps.event.addListener(marker, 'dragstart', function(evt){
              temp = markers.indexOf(evt.latLng);
          });
          google.maps.event.addListener(marker, 'dragend', function(evt){
              markers[temp] = evt.latLng;
              line.setPath(markers);
          });
          google.maps.event.addListener(marker, 'rightclick', function(e) {
            // Check if click was on a vertex control point
            //if (e.vertex == undefined) {
              //return;
            //}
            deleteMenu.open(map, marker.getPosition(), e.vertex);
          });
        });
      }
      function deleteMarkers() {
        setMapOnAll(null);
        markerlist = [];
      }
      /**
       * A menu that lets a user delete a selected vertex of a path.
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

          // clean up
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
         * Opens the menu at a vertex of a given path.
         */
      this.open = function(map, position, vertex) {
          this.set('position', position);
          this.set('vertex', vertex);
          this.setMap(map);
          this.draw();
          return;
        }

        /**
         * Deletes the vertex from the path.
         */
      this.removeVertex = function() {
          var position = this.get('position');
          var vertex = this.get('vertex');
          temp = markers.indexOf(position);
          markerlist[temp].setMap(null);
          markers.splice(temp,1);
          line.setPath(markers);
          this.close();
        }
      }
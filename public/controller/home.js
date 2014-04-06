angular.module('letsjs.controllers').controller('HomeController', function($scope, $interval, socket) {
  socket.on('state', function(state) {
    $scope.objects = state;
  });
  
  $scope.flap = function(id) {
    console.log('flap ' + id);
    socket.emit('flap', id);
  };

  var t0 = new Date().getTime();

  $interval(extrapolate, 10);
  function extrapolate() {
    var current = new Date().getTime(); // get current time
    var t = (current - t0) / 1000.0; // calculate time passed since last execution (in seconds)
    t0 = current; // save current time for next execution
    $scope.objects.forEach(function(object) {
      newton(t,object);
    });
  };

  function newton(t, obj) {
    var coords = ['x', 'y'];
    var bounds = {x: 600, y: 500}; 
    coords.forEach(function(coord) {
      // update position
      obj.p[coord] += obj.v[coord] * t;    
      // update velocity
      obj.v[coord] += obj.a[coord] * t;
      if(obj.p[coord] < 0) {
        obj.p[coord] = 0;
        obj.v[coord] = - obj.v[coord];
      }
      if(obj.p[coord] > bounds[coord]) {
        obj.p[coord] = bounds[coord];
        obj.v[coord] = - obj.v[coord];
      }
    });
  };
});

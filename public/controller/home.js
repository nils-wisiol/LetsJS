angular.module('letsjs.controllers').controller('HomeController', function($scope, $interval, socket) {
  socket.on('state', function(state) {
    $scope.objects = state;
  });

  socket.on('die', function() {
    $scope.leaveGame();
  });

  $scope.playerid = socket.id;
  $scope.state = 0;  

  $scope.flap = function(id) {
    socket.emit('flap', id);
  };

  $scope.setupPlayer = function(nick) {
    socket.emit('join', { nick: nick });
    $scope.state=1;
  }

  $scope.leaveGame = function() {
    socket.emit('leave');
    $scope.state=0;
  }

  var t0 = new Date().getTime();

  var myInterval = $interval(extrapolate, 10);

  $scope.$on("$destroy", function(){
    $interval.cancel(myInterval);

    if($scope.state == 1) {
      socket.emit('leave');
    }
  });

  function extrapolate() {
    var current = new Date().getTime(); // get current time
    var t = (current - t0) / 1000.0; // calculate time passed since last execution (in seconds)
    t0 = current; // save current time for next execution
    Object.keys($scope.objects || {}).forEach(function(id) {
      newton(t,$scope.objects[id]);
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
    });
  };
});

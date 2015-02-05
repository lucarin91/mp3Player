var app = angular.module('mp3Player', []);
var Player = require('player');
var fs = require('fs');

app.controller('playerController', function ($scope) {
  $scope.test = "ciao!";
  var player = null;
  var path = ['home','luca','media','Musica','Music'];
  var getPath = function(){return '/'+path.join('/')};

  var changeFolder = function(path){
    fs.readdir(path, function(err,files){
      //console.log(files);
      //files = files.filter(function(file){
      //  return file[0]!='.' && (file.search(/.mp3/i) != -1 || fs.statSync(getPath()+"/"+file).isDirectory())});
      $scope.listFolder = files.map(function(file){
        //console.log(file);
        //console.log("isdir" + fs.statSync(path+"/"+file).isDirectory());
        if (file[0]!='.' && (file.search(/.mp3/i) != -1 || fs.statSync(getPath()+"/"+file).isDirectory()))
          return {'name':file, 'dir':fs.statSync(getPath()+"/"+file).isDirectory()};
      });
      $scope.$apply();
    });
  }
  console.log(getPath());
  changeFolder(getPath());
  //console.log($scope.listFolder);


  //$scope.listFolder = ['asd','asd','ddddd'];

  $scope.openFolder = function(item){
    if (item.dir){
      path.push(item.name);
      changeFolder(getPath());
    }
  };

  $scope.backFolder = function(){
    path.splice(path.length-1,1);
    console.log('path '+ path);
    changeFolder(getPath());
  };

  var musicList = [];
  var getMusicList = function(path){
    var files = fs.readdirSync(path);
    files.forEach(function(file){
      var newPath = path+"/"+file;
      if (fs.statSync(newPath).isDirectory())
        getMusicList(newPath);
      else if (file.search(/.mp3/i) != -1)
        musicList.push(newPath);
    });
  };

  function shuffle(o){ //v1.0
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
  };

  $scope.play = function(){
    if (player != null){
      player.stop();
      delete player;
    }
    musicList = [];
    getMusicList(getPath());
    musicList = shuffle(musicList);
    console.log(musicList);
    player = new Player(musicList);
    player.on('playing',function(item){
      $scope.nowPlaying = item.src;
      $scope.$apply();
    });
    player.play();
  }

  $scope.stop = function(){
    if (player!= null){
      player.stop();
      player = null;
      $scope.nowPlaying = '';
    }
  }

  $scope.next = function(){
    if (player!=null)
      player.next();
  }
});

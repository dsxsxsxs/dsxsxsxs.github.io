function make_kagami(width, height, mikan) {
  var points = [];
  points.push(new THREE.Vector3(0, 0, 0));
  points.push(new THREE.Vector3(width, 0, 0));
  _.each(_.range(36), function(i){
    points.push(new THREE.Vector3(
      width+height/2.0*Math.cos(Math.PI*i/36.0-(Math.PI/2)),
      0,
      height/2.0+height/2.0*Math.sin(Math.PI*i/36.0-(Math.PI/2))));
  });
  points.push(new THREE.Vector3(width, 0, height));
  points.push(new THREE.Vector3(0, 0, height));
  points.push(new THREE.Vector3(0, 0, 0));

  var geometry = new THREE.LatheGeometry(points, 36, 0, 2*Math.PI)
  var material;
  if(mikan === undefined){
    material = new THREE.MeshLambertMaterial({ color: 0xffffff });
  }else{
    material = new THREE.MeshLambertMaterial({ color: 0xFF8C00 });
  }
  var kagami = new THREE.Mesh(geometry, material);

  return kagami;
}

function hanoi(n, src, tmp, dst)
{
  var works = [];

  if(n>=2) works = works.concat(hanoi(n-1, src, dst, tmp));

  works.push({src:src, dst:dst});

  if(n>=2) works = works.concat(hanoi(n-1, tmp, src, dst));

  return works;
}

function draw_disk(rods, n)
{
  _.each(rods, function(rod, rod_n) {
    _.each(rod, function(kagami, index){
      kagami.position.x = (rod_n-1)*(n*40+100);
      kagami.position.z = index * 25;
    });
  });
}

$(function(){
  var n = 7;
  var step = 50;

  var width  = $(window).width()-10;
  var height = $(window).height()-10;
  var fov    = 30;
  var aspect = width / height;
  var near   = 1;
  var far    = 5000;

  var camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, -160*n, 160*n);
  camera.lookAt({x:0, y:0, z:0});

  var controls = new THREE.TrackballControls(camera);

  var scene = new THREE.Scene();

  var directionalLight = new THREE.DirectionalLight(0xffffff);
  directionalLight.position.set(0, 0, 1);
  scene.add(directionalLight);

  var renderer = new THREE.WebGLRenderer();
  renderer.setSize(width, height);
  document.body.appendChild(renderer.domElement);
  renderer.render(scene, camera);

  // 床
  var geometry = new THREE.PlaneGeometry(10000, 10000);
  var material = new THREE.MeshPhongMaterial({color: 0x7F7F7F});
  var ground = new THREE.Mesh(geometry, material);
  scene.add(ground);

  // ハノイの棒
  var rods = [[], [], []];

  // 鏡餅
  _.each(_.range(n), function(i){
    var kagami;
    if(n-1 - i == 0) {
      kagami = make_kagami((n-1-i) * 20, 20, true)
    } else {
      kagami = make_kagami((n-1-i) * 20, 20)
    }
    rods[0].push(kagami);
    scene.add(kagami);
  });
  draw_disk(rods, n);

  // 動かす順番
  var works = hanoi(n, 0, 1, 2);

  // アニメーション用変数
  var shifting = false;
  var shift_state;
  var work;
  var working_kagami;

  function rendering(){
    if(shifting) {
      var target_x = (work.dst-1)*(n*40+100);
      var target_z = (rods[work.dst].length)*25

      var target_height = (Math.max(rods[0].length, rods[1].length, rods[2].length))*25
      if(shift_state == 0){ //UP
        working_kagami.position.z += step;
        if(working_kagami.position.z > target_height){
          working_kagami.position.z = target_height;
          shift_state = 1;
        }
      }else if(shift_state == 1){ // LEFT OR RIGHT MOVE
        if(work.dst < work.src){
          working_kagami.position.x -= step;
          if(working_kagami.position.x < target_x){
            working_kagami.position.x = target_x;
            shift_state = 2;
          }
        }else{
          working_kagami.position.x += step;
          if(working_kagami.position.x > target_x){
            working_kagami.position.x = target_x;
            shift_state = 2;
          }
        }
      }else{ //DOWN
        working_kagami.position.z -= step;
        if(working_kagami.position.z < target_z){
          working_kagami.position.z = target_z;
          shifting = false;
          rods[work.dst].push(working_kagami);
        }
      }
    }else{
      work = works.shift();

      if(work !== undefined) {
        working_kagami = rods[work.src].pop();

        shifting = true;
        shift_state = 0;
      }else{
        // $("#harunoumi")[0].pause();
        // $("#enda")[0].play();
      }
    }
    draw_disk(rods, n);

    renderer.render(scene, camera);
    controls.update();

    setTimeout(rendering, 30);
  }
  rendering();
});

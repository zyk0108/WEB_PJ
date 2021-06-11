<template>
  <div>
    <ChatRoom ref="chatRoom"></ChatRoom>
    <section id="loading-screen">
      <div id="loader"></div>
      <h1 class="begin-text">Wait a moment, loading models will take some time...</h1>
    </section>

    <div id="blocker">
      <div id="instructions" @click="clickTheScene()">
        <span style="font-size:40px">Click to Start (Continue)</span>
        <br/>
        (W, A, S, D = Move, MOUSE = Look around)
      </div>
    </div>
    <canvas id="theCanvas"></canvas>
  </div>
</template>

<script>
  import * as THREE from "three"
  import {PointerLockControls} from 'three/examples/jsm/controls/PointerLockControls'
  import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader'
  import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader'
  import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
  import ChatRoom from './Chat'
  import JWT from 'jwt-decode'
  export default {
    name: "ThreeMapDemo",
    data(){
      return{
        theName: JWT(this.$store.state.token).sub,
        camera: null,
        webglScene: null,
        renderer: null,
        controls: null,
        objects: [],
        tanksArr: [],
        root: null,
        blocker: null,
        instructions: null,
        moveForward: false,
        moveBackward: false,
        moveLeft: false,
        moveRight: false,
        moveUp: false, //相机升空
        moveDown: false, //相机降空
        prevTime: performance.now(),
        velocity: null,//加速度
        direction: null,
        wallCollider: [],//碰撞
        wallMaterial: null,
        infoMaterial: null,

        //for videos
        videoObj: [],

        floorUrl: "../../static/img/floor01.jpg",
        wallUrl: "../../static/img/wall.jpg",
        roofUrl: "../../static/img/roof01.jpg",
        frontUrl1: '../../static/fronts/Open_Sans_Bold.json',
        sizeInfo: {w: 20, h: 14, d: 0.5},//for indicators
        SHADOW_MAP_WIDTH: 2048,
        SHADOW_MAP_HEIGHT: 2048,
        videoWidth: null,
        videoHeight: null,

        loadingManager: null,
        composer: null,

        //walls array
        walls:[
          {
            size: {h: 370, w: 1200, d: 20},//d：墙面的厚度 w：墙面的宽度（墙有多长）h:墙的高度（从上到下）
            rotation: {x: 0, y: 0, z: 0},
            position: {x: 600, y: 180, z: 50},//x:x轴的初始位置 y:y轴起始位置 z:z轴初始位置
          },
          // {
          //   size: {h: 370, w: 830, d: 20},//最左边墙
          //   rotation: {x: 0, y: 300 + 0.02, z: 0},
          //   position: {x: 50, y: 180, z: -350},
          // },
          //左边的墙
          {
            size: {h: 370, w: 460, d: 20},//左边墙门右边部分
            rotation: {x: 0, y: 300 + 0.02, z: 0},
            position: {x: 11, y: 180, z: -190},
          },
          {
            size: {h: 250, w: 150, d: 20},//左边墙门
            rotation: {x: 0, y: 300 + 0.02, z: 0},
            position: {x: 11, y: 240, z: -495},
          },
          {
            size: {h: 370, w: 180, d: 20},//左边墙门左边部分
            rotation: {x: 0, y: 300 + 0.02, z: 0},
            position: {x: 11, y: 180, z: -660},
          },
          // 中间隔墙
          {
            size: {h: 370, w: 40, d: 20},//中间门右边部分
            rotation: {x: 0, y: 300 + 0.02, z: 0},
            position: {x: 350, y: 180, z: 20},
          },
          {
            size: {h: 250, w: 150, d: 20},//中间分隔门
            rotation: {x: 0, y: 300 + 0.02, z: 0},
            position: {x: 350, y: 240, z: -75},
          },
          {
            size: {h: 370, w: 600, d: 20},//中间门左边部分
            rotation: {x: 0, y: 300 + 0.02, z: 0},
            position: {x: 350, y: 180, z: -450},
          },
          {
            size: {h: 370, w: 1200, d: 20},//最前面的墙
            rotation: {x: 0, y: 0, z: 0},
            position: {x: 600, y: 180, z: -750},
          },
          {
            size: {h: 370, w: 830, d: 20},//最右边的墙
            rotation: {x: 0, y: 300 + 0.02, z: 0},
            position: {x: 1200, y: 180, z: -350},
          },
          //围栏
          {
            size: {h: 80, w: 830, d: 20},//最左边的围栏
            rotation: {x: 0, y: 300 + 0.02, z: 0},
            position: {x: -460, y: 20, z: -350},
          },
          {
            size: {h: 80, w: 460, d: 20},//最前面的围栏
            rotation: {x: 0, y: 0, z: 0},
            position: {x: -230, y: 20, z: -750},
          },
          {
            size: {h: 80, w: 460, d: 20},//最后面的围栏
            rotation: {x: 0, y: 0, z: 0},
            position: {x: -230, y: 20, z: 50},
          },
        ],

        //texts array
        text : [
          {
            message: 'P : play/resume | SPACE : pause | R : replay',//门墙视频提示
            position: {x: 1, y: 40, z: -270},
            rotation: {x: 0, y: -Math.PI / 2, z: 0},
            propertiesFont: {size: 7, height: 1},
          },
          {
            message: 'Tne Video Instruction',//门墙视频标题
            position: {x: 1, y: 230, z: -210},
            rotation: {x: 0, y: -Math.PI / 2, z: 0},
            propertiesFont: {size: 7, height: 1},
          },
          {
            message: 'Computers Exhibition Hall',//展厅标题
            position: {x: 1, y: 180, z: -630},
            rotation: {x: 0, y: -Math.PI / 2, z: 0},
            propertiesFont: {size: 15, height: 1},
          },
          {
            message: 'Entrance Door',//展厅门标语
            position: {x: 1, y: 145, z: -525},
            rotation: {x: 0, y: -Math.PI / 2, z: 0},
            propertiesFont: {size: 7, height: 1},
          },
          {
            message: 'Inside Door',//内部门标语
            position: {x: 340, y: 145, z: -105},
            rotation: {x: 0, y: -Math.PI / 2, z: 0},
            propertiesFont: {size: 7, height: 1},
          }
        ],

        //videos array
        videos : [
          {
            position: {x: -1, y: 140, z: -160},
            rotation: {x: 0, y: 300 + 0.02, z: 0},
            url: '../../static/videos/Movie_Trailer.mp4',
            id: "video-1"
          }
        ],


        //indicators array
        indicators: [
          {
            texture: '../../static/info/Test_Door.PNG',
            rotation: {x: -0.7, y: 0, z: 0},//x:牌面倾斜度 z:旋转的角度，正数为顺时针转
            position: {x: -280, y: 10, z: -495},
          },
        ],

        //me
        myObj: {
          obj: '../../static/models/robot.glb',
          map: "../../static/models/mapDefault.png",
          scale: 4,
          position: {x: -300, y: 0, z: -110},
          rotation: {x: 0, y: 380, z: 0},
        },
        me:[],

        //Other users
        otherUsers:[
          // {
          //   username: '',
          //   obj: '../../static/models/robot.glb',
          //   scale: 4,
          //   position: {x: -200, y: -4, z: -140},
          //   rotation: {x: 0, y: 380, z: 0},
          // }
        ],

        playerMap:null,

        otherUserNum: 0,


        //位置信息
        myPosition:{
          x: 0,
          y: 0,
          z: 0
        },
      }
    },
    components:{
      //把子组件关联到对象中
      ChatRoom
    },
    mounted() {
      this.playerMap = new Map();
      this.createScene(document.getElementById("theCanvas"));
      this.animate();
    },
    methods: {
      //其他人的位置更新
      updateOtherUsersPosition(userId,position){
        if (this.playerMap.has(userId)) {
          let model = this.playerMap.get(userId);
          console.log(new THREE.Vector3(position)+"zzzzzzzzzzzzz");
          model.position.set(position);
          //model.rotation.set(data.rotation._x, data.rotation._y + Math.PI / 2, data.rotation._z);
        }
      },

      //自己上线加载其他所有用户的数据
      addAllUser(allOtherUsersPosition){
        for (let i = 0; i < allOtherUsersPosition.length; i++) {
          this.otherUsers.push({
            username: allOtherUsersPosition[i].id,
            obj: '../../static/models/robot.glb',
            scale: 4,
            position: {x: allOtherUsersPosition[i].x, y: allOtherUsersPosition[i].y, z: allOtherUsersPosition[i].z},
            rotation: {x: 0, y: 380, z: 0},
          });
        }
        this.otherUserNum = this.otherUsers.length;
        this.loadOtherUsers();
      },

      //其他人上线
      addUser(userId){
        this.otherUsers.push({
          username: userId,
          obj: '../../static/models/robot.glb',
          scale: 4,
          position: {x: -300, y: 0, z: -100},
          rotation: {x: 0, y: 380, z: 0},
        });
        this.otherUserNum += 1;

        let obj = this.otherUsers[this.otherUsers.length-1];
        let loader = new GLTFLoader();
        try {
          loader.load(obj.obj,(model)=>{
            console.log(model,'load online');
            console.log(obj.username,"vvvvvvvvvvvvvvvvvvvvvv");
            this.playerMap.set(obj.username,model.scene);
            model.scene.position.set(obj.position.x,obj.position.y,obj.position.z);
            model.scene.scale.set(obj.scale, obj.scale, obj.scale);
            model.scene.rotation.set(obj.rotation.x, obj.rotation.y, obj.rotation.z);
            this.webglScene.add(model.scene);
          });
        }catch (e) {
          console.log(e);
        }
      },

      //其他人下线
      deleteUser(userId){
        for (let i = 0; i < this.otherUsers.length; i++) {
          if (this.otherUsers[i].username === userId) {
            this.otherUsers.splice(i, 1);
            break;
          }
        }
        this.otherUserNum = this.otherUsers.length;
        if (this.playerMap.has(userId)) {
          this.root.remove(this.playerMap.get(userId));
          this.playerMap.delete(userId);
        }
      },

      /********************************Create webglScene*********************************/
      createScene(canvas) {
        //Create the variables for velocity and direction
        this.velocity = new THREE.Vector3();
        this.direction = new THREE.Vector3();

        //渲染器
        this.renderer = new THREE.WebGLRenderer({canvas: canvas, alpha: true, antialias: true});
        this.renderer.setClearColor(0x000000, 0);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);//设置渲染的界面长度与宽度
        this.renderer.shadowMap.enabled = true;

        // Options: THREE.BasicShadowMap, THREE.PCFShadowMap, PCFSoftShadowMap
        this.renderer.shadowMap.type = THREE.BasicShadowMap;

        //新建相机
        let camera= new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
        //????不起作用
        /*camera.lookAt({//相机看向哪个坐标
          x : -310,
          y : 10,
          z : -100
        });*/
        camera.lookAt( new THREE.Vector3( 200, 10, -100 ) );
        this.camera = camera;
        // /*console.log(camera.position)
        // //躺着拍&竖着拍&...
        // this.camera.up = new THREE.Vector3( 0, 1, 0 );*/
        //新建场景
        this.webglScene = new THREE.Scene();
        this.webglScene.background = new THREE.Color(0x000000);
        this.webglScene.fog = new THREE.Fog(0x000000, 1, 800);

        //loading
        this.loadingM();
        //this.loadingManager = new THREE.LoadingManager();

        this.root = new THREE.Object3D();

        //Create the light and shadows
        let spotLight = new THREE.SpotLight(0x646464, 0.4, 1120);
        spotLight.position.set(0, 1120, 0);//光照的位置，从上往下
        spotLight.castShadow = true;//此属性设置为 true 聚光灯将投射阴影
        spotLight.shadow.camera.near = 1;//投影近点
        spotLight.shadow.camera.far = 200;//投影远点
        spotLight.shadow.camera.fov = 45;//投影视场
        spotLight.shadow.mapSize.width = this.SHADOW_MAP_WIDTH;//阴影映射宽度和阴影映射高度
        spotLight.shadow.mapSize.height = this.SHADOW_MAP_HEIGHT;

        let ambientLight = new THREE.AmbientLight(0xffffff, 0.8);//颜色的rgb数值:缺省值为 0xffffff。光照的强度:缺省值为 1
        this.webglScene.add(spotLight);
        this.root.add(ambientLight);

        // Floor
        let mapFloor = new THREE.TextureLoader(this.loadingManager).load(this.floorUrl);
        mapFloor.wrapS = mapFloor.wrapT = THREE.RepeatWrapping;
        mapFloor.repeat.set(100, 100);
        let floorGeometry = new THREE.PlaneGeometry(1800, 850, 100, 100);//平面：宽度、长度、宽度分段数、长度分段数
        let floor = new THREE.Mesh(floorGeometry, new THREE.MeshPhongMaterial({
          color: 0xffffff,
          map: mapFloor,
          side: THREE.DoubleSide
        }));
        floor.rotation.x = -Math.PI / 2;
        floor.castShadow = false;
        floor.receiveShadow = true;
        floor.position.set(420, -6, -350);
        this.root.add(floor);

        // Roof
        let mapRoof = new THREE.TextureLoader(this.loadingManager).load(this.roofUrl);
        mapRoof.wrapS = mapRoof.wrapT = THREE.RepeatWrapping;
        mapRoof.repeat.set(25, 25);
        //let roofGeometry = new THREE.PlaneGeometry(1200, 850, 100, 100);
        let roofGeometry = new THREE.PlaneGeometry(1400, 850, 100, 100);
        let roof = new THREE.Mesh(roofGeometry, new THREE.MeshPhongMaterial({
          color: 0xffffff,
          map: mapRoof,
          side: THREE.DoubleSide
        }));
        roof.rotation.x = -Math.PI / 2;
        // roof.position.set(420, 340, -350);
        roof.position.set(520, 340, -350);
        this.root.add(roof);

        // construct the room:add walls
        this.loadWallMaterial(this.wallUrl);
        for (const eachWall of this.walls) {
          this.cloneWalls(eachWall.size, eachWall.position, eachWall.rotation, this.root);
        }

        // The test example
        // let box=new THREE.SphereGeometry(3, 100, 100);//经纬度细分数40,40
        // let material=new THREE.MeshBasicMaterial({color:0x403f3f});//材质对象
        // let mesh=new THREE.Mesh(box,material);//网格模型对象
        // //mesh.position.set(-300,8,-105);
        // this.root.add(mesh);//网格模型添加到场景中
        // //this.me = mesh;

        //Load me
        // this.loadMe().then(ele=>{
        //   this.root.add(ele);
        // });
        this.initModelOfMe().then(ele=>{
          console.log(ele);
        });

        //Load otherUsers
        // this.loadUsers().then(theList=>{
        //   for (let i = 0; i < theList.length; i++) {
        //     this.root.add(theList[i]);
        //   }
        // });
        // this.loadOtherUsers().then(theList=>{
        //   for (let i = 0; i < theList.length; i++) {
        //     console.log('Other user: ', i);
        //   }
        // });

        //this.myObj.position.x = -100
        //add the video
        for (const eachVideo of this.videos) {
          this.addVideo(eachVideo.position, eachVideo.rotation, eachVideo.url, eachVideo.id);
        }

        // add the 3D text
        for (const eachText of this.text) {
          this.loadText(eachText.message, eachText.position, eachText.rotation, eachText.propertiesFont, this.root);
        }

        //add the indicator
        for (const indicator of this.indicators) {
          this.createInformation(indicator.texture, this.sizeInfo, indicator.position, indicator.rotation, this.root);
        }
        this.initPointerLock();

        this.webglScene.add(this.root);
        let controls = new PointerLockControls(this.camera, document.body);
        console.log(this.controls.isLocked+"lll")
        if (!this.controls.isLocked) {
          document.addEventListener('keydown', this.onKeyDown, false);
          document.addEventListener('keyup', this.onKeyUp, false);
        }

        /*this.addEffects();*/
        window.addEventListener('resize', this.windowResize, false);
      },

      /*******************************create the wall*************************************/
      //Load wall material
      loadWallMaterial(texture) {
        let loader = new THREE.TextureLoader(this.loadingManager);
        let wallMap = loader.load(texture);
        this.wallMaterial = new THREE.MeshPhongMaterial({
          color: 0xffffff,
          specular: 0x303030,
          shininess: 100,
          map: wallMap,
          side: THREE.DoubleSide
        });
      },
      //Clone walls
      cloneWalls(size, position, rotation, webglScene) {
        let wallGeometry = new THREE.BoxBufferGeometry(size.w, size.h, size.d);
        let wall = new THREE.Mesh(wallGeometry, this.wallMaterial);
        wall.position.set(position.x, position.y, position.z);
        wall.rotation.set(rotation.x, rotation.y, rotation.z);
        let collider = new THREE.Box3().setFromObject(wall);
        this.wallCollider.push(collider);
        this.objects.push(wall);
        webglScene.add(wall);
      },

      //indicators information
      loadInformation(texture) { //Load information
        let loader = new THREE.TextureLoader(this.loadingManager);
        let infoMap = loader.load(texture);
        let infoMaterial = new THREE.MeshPhongMaterial({
          color: 0xffffff,
          map: infoMap,
        });
        return infoMaterial;
      },
      createInformation(texture, size, position, rotation, webglScene) { //Clone information
        let infoMaterial = this.loadInformation(texture);
        let infoGeometry = new THREE.BoxBufferGeometry(size.w, size.h, size.d);
        let infoMesh = new THREE.Mesh(infoGeometry, infoMaterial);
        infoMesh.position.set(position.x, position.y, position.z);
        infoMesh.rotation.set(rotation.x, rotation.y, rotation.z);
        webglScene.add(infoMesh);

        //圆柱架
        let cylinderGeometry = new THREE.CylinderBufferGeometry(1, 1, 16, 30);//顶、底半径，高，侧面段数
        let material = new THREE.MeshBasicMaterial({color: 0x403f3f});
        let cylinderMesh = new THREE.Mesh(cylinderGeometry, material);
        cylinderMesh.position.set(infoMesh.position.x, infoMesh.position.y - 9, infoMesh.position.z);
        webglScene.add(cylinderMesh);
      },

      //Load the videos
      async addVideo(position, rotation, videoUrl, id) {
        try {
          let videoElementsArray = [];
          let video = document.createElement("video");
          video.id = id;
          video.src = videoUrl;
          await video.load();
          videoElementsArray.push(video);
          let videoImage = document.createElement('canvas');
          videoImage.width = 1280;
          videoImage.height = 720;
          this.videoWidth = videoImage.width;
          this.videoHeight = videoImage.height;
          let videoImageContext = videoImage.getContext('2d');
          videoImageContext.fillStyle = '#000000';//背景填充色
          videoImageContext.fillRect(0, 0, videoImage.width, videoImage.height);//x,y:起始位置 w,h:填充区域的大小
          videoElementsArray.push(videoImageContext);
          let videoTexture = new THREE.Texture(videoImage);
          videoTexture.minFilter = THREE.LinearFilter;
          videoTexture.magFilter = THREE.LinearFilter;
          videoElementsArray.push(videoTexture);
          let movieMaterial = new THREE.MeshBasicMaterial({map: videoTexture, side: THREE.DoubleSide});
          let movieGeometry = new THREE.PlaneGeometry(300, 150, 4, 4);
          let movieScreen = new THREE.Mesh(movieGeometry, movieMaterial);
          movieScreen.position.set(position.x, position.y, position.z);
          movieScreen.rotation.set(rotation.x, rotation.y, rotation.z);
          movieScreen.name = id;
          this.root.add(movieScreen);
          videoElementsArray.push(movieScreen);
          this.videoObj.push(videoElementsArray);
        } catch (e) {
          console.log(e);
        }
      },

      //Load and add texts in proper position
      async loadText(message, position, rotation, propertiesFont, root) {
        let loader = this.promisifyLoader(new THREE.FontLoader(this.loadingManager));
        try {
          let textObject = await loader.load(this.frontUrl1);
          let fontGeometry = new THREE.TextGeometry(message, {
            font: textObject,
            size: propertiesFont.size,
            height: propertiesFont.height,
            curveSegments: 3,
            bevelEnabled: true,
            bevelThickness: 1,
            bevelSize: 0.2,
            material: 0,
            extrudeMaterial: 1,
            bevelOffset: 0,
            bevelSegments: 10
          });
          let material = new THREE.MeshBasicMaterial({color: 0x000000});
          let textMesh = new THREE.Mesh(fontGeometry, material);
          fontGeometry.computeBoundingBox();
          fontGeometry.computeVertexNormals();
          // let textWidth = fontGeometry.boundingBox.max.x - fontGeometry.boundingBox.min.x;
          // textMesh.position.set(140, 100, -100 );
          textMesh.position.set(position.x, position.y, position.z);
          // textMesh.rotation.set(0, 300, 0);
          textMesh.rotation.set(rotation.x, rotation.y, rotation.z);
          root.add(textMesh);
        } catch (e) {
          console.log(e);
        }
      },

      //Load myObj
      async loadMe() {
        let loadingManager = this.loadingManager;
        let loaderFBX = this.promisifyLoader(new FBXLoader(loadingManager));
        let loaderOBJ = this.promisifyLoader(new OBJLoader(loadingManager));
        try {
          let myObj = this.myObj;
          console.log(myObj.obj);
          let object = await loaderFBX.load(myObj.obj);
          let texture = myObj.hasOwnProperty("map") ? new THREE.TextureLoader(loadingManager).load(myObj.map) : null;
          object.traverse(function (child) {
            if (child.isMesh) {
              console.log("ccc");
              child.castShadow = true;
              child.receiveShadow = true;
              child.material.shininess = 100;
              //child.material.specular = {r: 0.8, g: 0.8, b: 0.8};
              //child.material.color = {r: 1, g: 1, b: 1};
              //child.material.map = texture;
            }
          });
          //调整模型比例
          object.scale.set(myObj.scale, myObj.scale, myObj.scale);
          object.position.set(myObj.position.x, myObj.position.y, myObj.position.z);
          object.rotation.set(myObj.rotation.x, myObj.rotation.y, myObj.rotation.z);
          object.name = 'myObj01';
          this.me=object;
          return object;
        } catch (e) {
          console.log(e);
        }
      },

      async initModelOfMe() {
        let obj = this.myObj;
        let loader = new GLTFLoader();
        try {
          await loader.load(obj.obj,(model)=>{
            console.log(model,'load myself');
            model.scene.position.set(obj.position.x,obj.position.y,obj.position.z);
            model.scene.scale.set(obj.scale, obj.scale, obj.scale);
            model.scene.rotation.set(obj.rotation.x, obj.rotation.y, obj.rotation.z);
            this.root.add(model.scene);
            this.me = model.scene;
          });
          return this.me;
        } catch (e) {
          console.log(e);
        }
      },

      //Utils: load function
      promisifyLoader ( loader, onProgress ) {
        function promiseLoader ( url ) {
          return new Promise( ( resolve, reject ) => {
            loader.load( url, resolve, onProgress, reject );
          } );
        }
        return {
          originalLoader: loader,
          load: promiseLoader,
        };
      },

      /**************************Controls and behaviour**************************************/

      initPointerLock() {
        let theBlocker = document.getElementById('blocker');
        let theInstruction = document.getElementById('instructions');
        this.blocker = theBlocker;
        this.instructions = theInstruction;

        //console.log("kkkkk")
        let controls = new PointerLockControls(this.camera, document.body);
        this.controls = controls;//undefined?????

        this.controls.addEventListener('lock', function () {
          theBlocker.style.display = 'none';
          theInstruction.style.display = 'none';
        });

        this.controls.addEventListener('unlock', function () {
          theBlocker.style.display = 'block';
          theInstruction.style.display = '';
          console.log(this.myPosition,"iiiiiiiiiiiiiiiiiiiiii");
        });

        console.log("test xxx");
        //设置初始的位置
        controls.getObject().position.x = -300;
        controls.getObject().position.y = 20;
        controls.getObject().position.z = -100;
        this.webglScene.add(controls.getObject());
      },

      onKeyDown(event) {
        switch (event.keyCode) {
          case 38: // up
          case 87: // W
            this.moveForward = true;
            break;

          case 37: // left
          case 65: // A
            this.moveLeft = true;
            break;

          case 40: // down
          case 83: // S
            this.moveBackward = true;
            break;

          case 39: // right
          case 68: // D
            this.moveRight = true;
            break;

          case 85: // U
          case 66: // B
            this.moveUp = true;
            break;

          case 89: // Y
          case 86: // V
            this.moveDown = true;
            break;

          case 32: // space
            this.videoObj.forEach(element => {
              if (this.controls.getObject().position.x > -200 && this.controls.getObject().position.x < element[3].position.x) {
                element[0].pause();
              }
            });
            break;

          case 80://p
            this.videoObj.forEach(element => {
              if (this.controls.getObject().position.x > -200 && this.controls.getObject().position.x < element[3].position.x) {
                console.log(element[0].id);
                element[0].play();
              }
            });
            break;

          case 82://r
            this.videoObj.forEach(element => {
              if (this.controls.getObject().position.x > -200 && this.controls.getObject().position.x < element[3].position.x) {
                element[0].currentTime = 0;
              }
            });
            break;

          case 84://t
            this.controls.unlock();
            console.log("uuu");
            this.$refs.chatRoom.showDialogForm();//弹出聊天室
            break;
        }

      },

      onKeyUp(event) {
        switch (event.keyCode) {
          case 38: // up
          case 87: // W
            this.moveForward = false;
            break;

          case 37: // left
          case 65: // A
            this.moveLeft = false;
            break;

          case 40: // down
          case 83: // S
            this.moveBackward = false;
            break;

          case 39: // right
          case 68: // D
            this.moveRight = false;
            break;

          case 85: // U
          case 66: // B
            this.moveUp = false;
            break;

          case 89: // Y
          case 86: // V
            this.moveDown = false;
            break;
        }
      },

      windowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
      },

      /****************************Loading****************************************************/
      //Loading manager
      loadingM() {
        let countLoad = 0;
        this.loadingManager = new THREE.LoadingManager();

        this.loadingManager.onLoad = function () {
          console.log('Loading complete!');
          countLoad += 1;
          if (countLoad >= 1) {
            const loadingScreen = document.getElementById('loading-screen');
            loadingScreen.classList.add('fade-out');

            // optional: remove loader from DOM via event listener,must be the =>function
            loadingScreen.addEventListener('transitionend', (event)=>{event.target.remove()});
            //console.log("ooo")
          }
        };
      },

      //Loading other users
      async loadUsers(){
        let loadingManager = this.loadingManager;
        let loaderFBX = this.promisifyLoader(new FBXLoader(loadingManager));
        let userList=[];
        try {
          for (let i = 0; i < this.otherUsers.length; i++) {
            let myObj = this.otherUsers[i];
            console.log(myObj.obj);
            let object = await loaderFBX.load(myObj.obj);
            object.traverse(function (child) {
              if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                child.material.shininess = 100;
              }
            });
            //调整模型比例
            object.scale.set(myObj.scale, myObj.scale, myObj.scale);
            object.position.set(myObj.position.x, myObj.position.y, myObj.position.z);
            object.rotation.set(myObj.rotation.x, myObj.rotation.y, myObj.rotation.z);
            object.name = 'User'+i;
            userList.push(object)
          }
          return userList;
        } catch (e) {
          console.log(e);
        }
      },

      //加载其他用户
      loadOtherUsers() {
        let userList=[];
        let loader = new GLTFLoader();
        try {
          for (let i = 0; i < this.otherUsers.length; i++) {
            let obj = this.otherUsers[i];
            loader.load(obj.obj,(gltf)=>{
              console.log(gltf,'other users load hhh');
              this.playerMap.set(obj.username,gltf.scene);
              gltf.scene.position.set(obj.position.x,obj.position.y,obj.position.z);
              gltf.scene.scale.set(obj.scale, obj.scale, obj.scale);
              gltf.scene.rotation.set(obj.rotation.x, obj.rotation.y, obj.rotation.z);
              this.webglScene.add(gltf.scene);
              userList.push(gltf.scene);
            });
          }
          return userList;
        } catch (e) {
          console.log(e);
        }
      },

      /**********************************run the 3D scene************************************/
      animate() {
        requestAnimationFrame(this.animate);

        //控制其他的用户的上下线
        let userNum = this.$refs.chatRoom.listName.length-2;
        console.log(userNum,"lllllllzyk");
        if (userNum !== this.otherUserNum) {
          console.log("oooooooooooooooooooooooooooooooooooooooooo");
          if (userNum > this.otherUserNum) {
            if (this.$refs.chatRoom.changeUser === null) {
              //初始化其他用户数据
              let theUserArr = this.$refs.chatRoom.allOtherUsersPosition;
              this.addAllUser(theUserArr);
              console.log(this.otherUserNum,"iiiccccc");
            }else {
              this.addUser(this.$refs.chatRoom.changeUser);
            }

          }else {
            this.deleteUser(this.$refs.chatRoom.changeUser);
          }
        }
        //console.log(userNum,"kkkooo");


        //控制其他用户的坐标移动
        let thePosition = this.$refs.chatRoom.thePosition;
        let len = thePosition.length;
        for (let i = 0; i < len; i++) {
          let id = thePosition[0].userId;
          let position = {x:thePosition[0].x,y:thePosition[0].y,z:thePosition[0].z};
          console.log(this.playerMap,"nnnnnnnnnn",id);
          if (this.playerMap.has(id)) {
            let model = this.playerMap.get(id);
            console.log(position);
            model.position = new THREE.Vector3(position);
            //model.position.set(position);
            console.log("in aaaaaaaaaaaaaaaaaaaaaa");
            console.log(this.me.position);
            console.log(this.controls.getObject().position);
            console.log(thePosition);
            this.$refs.chatRoom.thePosition.splice(0,1);
            console.log(this.$refs.chatRoom.thePosition,"after");
          }
          //this.updateOtherUsersPosition(id,position);
          //this.$refs.chatRoom.thePosition.splice(0,1);
        }
        //console.log(thePosition);

        if (this.controls.isLocked) {
          let time = performance.now();
          let delta = (time - this.prevTime) / 1000;

          // load for the videos
          this.videoObj.forEach(element => {
            if (element[0].readyState === element[0].HAVE_ENOUGH_DATA) { //element[0]:video
              let videoWidth = this.videoWidth;
              let videoHeight = this.videoHeight;
              if (videoHeight != null && videoWidth != null) {
                element[1].drawImage(element[0], 0, 0, videoWidth, videoHeight);//element[1]:canvas.getContext()
              }else {
                element[1].drawImage(element[0], 0, 0);
              }
              if (element[2]) element[2].needsUpdate = true;//element[2]:canvas.texture-->不断更新图片帧
            }
          });

          //can do Modify: for move actions
          this.velocity.x -= this.velocity.x * 10.0 * delta;
          this.velocity.z -= this.velocity.z * 10.0 * delta;
          this.velocity.y -= this.velocity.y * 10.0 * delta;

          this.direction.z = Number(this.moveForward) - Number(this.moveBackward);
          this.direction.x = Number(this.moveRight) - Number(this.moveLeft);

          this.direction.normalize(); // 归一化
          if (this.moveForward || this.moveBackward){
            this.velocity.z -= this.direction.z * 400.0 * delta;
          }
          if (this.moveLeft || this.moveRight) {
            this.velocity.x -= this.direction.x * 400.0 * delta;
          }
          if (this.moveDown || this.moveUp) {
            this.direction.y = Number(this.moveUp) - Number(this.moveDown);
            this.direction.normalize();
            this.velocity.y += this.direction.y * 400.0 * delta;
          }

          this.wallCollider.find(element => {//碰墙检测
            if (element.containsPoint(this.controls.getObject().position)) {
              if ((this.direction.x > 0 && this.direction.z < 0) || (this.direction.x < 0 && this.direction.z > 0)) {
                this.velocity.z = Math.max(0, this.velocity.z);
                this.velocity.x = Math.max(0, this.velocity.x);
                if (this.direction.z < 0) {
                  this.velocity.z -= 50 * 100.0;
                }
                if (this.direction.x < 0) {
                  this.velocity.x -= 50 * 100.0;
                }
                if (this.direction.z > 0) {
                  this.velocity.z += 50 * 100.0;
                }
                if (this.direction.x > 0) {
                  this.velocity.x += 50 * 100.0 * delta;
                }
              }
              if (this.direction.z < 0 || this.direction.x < 0) {
                this.velocity.z = Math.min(this.velocity.z, 0);
                this.velocity.x = Math.min(this.velocity.x, 0);
                if (this.direction.z < 0) {
                  this.velocity.z -= 50 * 100.0 * delta;
                }
                if (this.direction.x < 0) {
                  this.velocity.x -= 50 * 100.0 * delta;
                }
              }
              if (this.direction.z > 0 || this.direction.x > 0) {
                this.velocity.z = Math.max(0, this.velocity.z);
                this.velocity.x = Math.max(0, this.velocity.x);
                if (this.direction.z > 0) {
                  this.velocity.z += 50 * 100.0 * delta;
                }
                if (this.direction.x > 0) {
                  this.velocity.x += 50 * 100.0 * delta;
                }
              }

            }
          });

          this.controls.moveRight(-this.velocity.x * delta);
          this.controls.moveForward(-this.velocity.z * delta);

          //控制本身模型移动
          let a=this.controls.getObject().position.x;
          let b=0;
          let c=this.controls.getObject().position.z;
          //console.log(a,b,c)
          //调用接口发送更新的数据

          this.me.position = new THREE.Vector3(a,b,c);

          //发送自己的坐标
          this.judgePosition(a,b,c);

          console.log(a,b,c);
          //相机上下
          let height = this.velocity.y * delta;
          let srcHeight = this.controls.getObject().position.y;
          this.controls.getObject().position = new THREE.Vector3(a, srcHeight+height, c);

          if (this.controls.getObject().position.y < 10) {
            this.controls.getObject().position.y = 10;
          }else if (this.controls.getObject().position.y > 400) {
            this.controls.getObject().position.y = 400;
          }
          this.prevTime = time;
        }
        this.renderer.render(this.webglScene, this.camera);
      },

      judgePosition(x,y,z){
        let srcX = this.myPosition.x;
        let srcY = this.myPosition.y;
        let srcZ = this.myPosition.z;
        if (x !== srcX || y !== srcY || srcZ !== z) {
          this.setMyPosition(x,y,z);
          this.$refs.chatRoom.webSocketSend(this.theName,x,y,z);
        }
      },

      setMyPosition(x,y,z){
        this.myPosition.x=x;
        this.myPosition.y=y;
        this.myPosition.z=z;
      },

      clickTheScene(){
        console.log(this.controls);
        this.controls.lock();
        console.log(this.myPosition);
        console.log(this.controls.getObject().position);
        console.log("test kkk")
      }
    }
  }
</script>

<style scoped>
  html, body {
    overflow: hidden;
    margin: 0;
    width: 100%;
    height: 100%;
  }

  .begin-text {
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  #loading-screen {
    position: absolute;
    z-index: 2;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #000000;
    opacity: 1;
    transition: 1s opacity;
  }

  #loading-screen.fade-out {
    opacity: 0;
  }

  #loader {
    display: block;
    position: relative;
    left: 50%;
    top: 50%;
    width: 150px;
    height: 150px;
    margin: -75px 0 0 -75px;
    border-radius: 50%;
    border: 3px solid transparent;
    border-top-color: #9370DB;
    -webkit-animation: spin 2s linear infinite;
    animation: spin 2s linear infinite;
  }
  #loader:before {
    content: "";
    position: absolute;
    top: 5px;
    left: 5px;
    right: 5px;
    bottom: 5px;
    border-radius: 50%;
    border: 3px solid transparent;
    border-top-color: #BA55D3;
    -webkit-animation: spin 3s linear infinite;
    animation: spin 3s linear infinite;
  }
  #loader:after {
    content: "";
    position: absolute;
    top: 15px;
    left: 15px;
    right: 15px;
    bottom: 15px;
    border-radius: 50%;
    border: 3px solid transparent;
    border-top-color: #FF00FF;
    -webkit-animation: spin 1.5s linear infinite;
    animation: spin 1.5s linear infinite;
  }
  @-webkit-keyframes spin {
    0%   {
      -webkit-transform: rotate(0deg);
      -ms-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
      -ms-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
  @keyframes spin {
    0%   {
      -webkit-transform: rotate(0deg);
      -ms-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
      -ms-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }

  body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .canvas-resize {
    width: 100% !important;
    height: 100% !important;
  }

  #blocker {
    z-index: 1;
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
  }

  #instructions {
    width: 100%;
    height: 100%;
    display: -webkit-box;
    display: -moz-box;
    -webkit-box-orient: horizontal;
    -moz-box-orient: horizontal;
    box-orient: horizontal;
    -webkit-box-pack: center;
    -moz-box-pack: center;
    box-pack: center;
    -webkit-box-align: center;
    -moz-box-align: center;
    box-align: center;
    color: #ffffff;
    text-align: center;
    font-family: Arial;
    font-size: 14px;
    line-height: 24px;
    cursor: pointer;
  }

</style>
<style>
  /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
  ::-webkit-scrollbar
  {
    width: 5px;  /*滚动条宽度*/
    height: 5px;  /*滚动条高度*/
  }

  /*定义滚动条轨道 内阴影+圆角*/
  ::-webkit-scrollbar-track
  {
    /*-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);*/
    border-radius: 10px;  /*滚动条的背景区域的圆角*/
    /*background-color: red;!*滚动条的背景颜色*!*/
  }

  /*定义滑块 内阴影+圆角*/
  ::-webkit-scrollbar-thumb
  {
    border-radius: 10px;  /*滚动条的圆角*/
    /*-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);*/
    background-color: #b8b8bc;  /*滚动条的背景颜色*/
  }
</style>

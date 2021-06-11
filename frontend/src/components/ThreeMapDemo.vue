<template>
  <div>
    <el-dialog title="THE CHAT DIALOG" :visible.sync="dialogFormVisible" style="opacity: 1">
      <el-row type="flex" justify="center">
        <el-col :md="24">
          <!--头部-->
          <el-card :body-style="{ padding: '10px' }" style="background-color: #E8E8E8; border: 1px solid #DDDDDD; border-bottom: 0;">
            <div>{{dialogName}}</div>
          </el-card>

          <!--body-->
          <el-card :body-style="{ padding: '0' }" style="border: 1px solid #DDDDDD; border-top: 0;">
            <el-row>
              <!--左边用户栏-->
              <el-col :md="6" style=" height: 400px; border-right: 2px solid #DDDDDD; overflow: auto;">
                <div v-for="(item, index) in listName" :key="index" style="padding:2px 5px">
                  <a href="javascript:void(0);" @click="toggleChat(item)">
                    <el-card shadow="never" id="userItem">
                      <el-row >
                        <el-col :span="7">
                          <el-avatar v-if="item === 'Group'" shape="square" icon="el-icon-user-solid"></el-avatar>
                          <el-avatar v-else icon="el-icon-user-solid"></el-avatar>
                        </el-col>
                        <el-col :span="17">
                          <div style="text-align: center;line-height: 40px">
                            {{item}}
                          </div>
                        </el-col>
                      </el-row>
                    </el-card>
                  </a>
                </div>

              </el-col>
              <!--发消息的主体-->
              <el-col :md="18" style=" height: 400px; border-right: 2px solid #DDDDDD; overflow: auto;" id="chatBody">
                <el-card :body-style="{ padding: '5px' }" shadow="never">
                  <div v-for="(item,index) in this.data" :key="index" :id="item.message">

                    <!--case1：系统消息-->
                    <p v-if="item.type===0" style="background-color: #f3f3f3;width: 50%;margin-left: 25%;border-radius: 5px">{{item.message}}</p>

                    <!--case2：其他用户消息-->
                    <div v-if="item.type===1" style="margin-bottom: 15px">
                      <el-row style="width: 20%">
                        <el-col :span="7">
                          <el-avatar style="width: 20px; height: 20px;" shape="square" src="https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png"></el-avatar>
                        </el-col>
                        <el-col :span="17">
                          <div style="text-align: center;line-height: 1">
                            {{item.name}}
                          </div>
                        </el-col>
                      </el-row>
                      <div style="background-color: #b4bccc;width: 70%;border-radius: 5px;text-align: left;padding: 5px">{{item.message}}</div>
                    </div>

                    <!--case3：本人发送的消息-->
                    <div v-if="item.type===2" style="margin-bottom: 15px">
                      <el-row style="width: 20%;margin-left: 80%">
                        <el-col :span="17">
                          <div style="text-align: center;line-height: 1">
                            {{item.name}}
                          </div>
                        </el-col>
                        <el-col :span="7">
                          <el-avatar style="width: 20px; height: 20px;" shape="square" src="https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png"></el-avatar>
                        </el-col>
                      </el-row>

                      <div style="background-color: #9FE86C;width: 70%;border-radius: 5px;margin-left: 29%;text-align: left; padding: 5px">{{item.message}}</div>
                    </div>
                  </div>
                </el-card>
              </el-col>
            </el-row>
            <el-card :body-style="{'padding-top': '11px', 'padding-bottom': '12px', 'padding-left': '10px', 'padding-right': '12px' }" shadow="never">
              <div style="text-align: right">
                <el-input
                  size="mini"
                  style="width:67%"
                  placeholder="please input here"
                  v-model="input">
                </el-input>
                <el-button type="primary" size="mini" @click="webSocketSend()">Send</el-button>
              </div>
            </el-card>
          </el-card>
        </el-col>
      </el-row>
    </el-dialog>
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
  import JWT from 'jwt-decode'
  export default {
    name: "ThreeMapDemo",
    data(){
      return{
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
            message: 'Tne Star Wars Video Instruction',//门墙视频标题
            position: {x: 1, y: 230, z: -230},
            rotation: {x: 0, y: -Math.PI / 2, z: 0},
            propertiesFont: {size: 7, height: 1},
          },
          {
            message: 'Car models Exhibition Hall',//展厅标题
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
        theObj: {
          obj: '../../static/models/robot.glb',
          scale: 4,
          position: {x: -300, y: 0, z: -110},
          rotation: {x: 0, y: 380, z: 0},
        },
        me:[],

        playerMap:null,

        otherUserNum: 0,


        //位置信息
        myPosition:{
          x: 0,
          y: 0,
          z: 0
        },

        //objects models
        theModels:[
          // {
          //   obj: '../../static/models/airplane.fbx',
          //   map: "../../static/img/airplane01.png",
          //   normalMap:"../../static/img/mapDefault.png",
          //   scale: 0.05,
          //   position: {x: -300, y: 0, z: -400},
          //   rotation: {x: 0, y: 0, z: 0},
          // },
          {
            obj: '../../static/models/wagon.glb',
            scale: 6,
            position: {x: -350, y: 0, z: -210},
            rotation: {x: 0, y: 0, z: 0},
          },
          {
            obj: '../../static/models/car_1/run_car.glb',
            scale: 200,
            position: {x: 1000, y: 30, z: -200},
            rotation: {x: 0, y: 0, z: 0},
          },
          {
            obj: '../../static/models/car_2/open_car.glb',
            scale: 200,
            position: {x: 1000, y: 30, z: -450},
            rotation: {x: 0, y: 0, z: 0},
          },
          {
            obj: '../../static/models/car_3/bengbeng.glb',
            scale: 300,
            position: {x: 700, y: 60, z: -180},
            rotation: {x: 0, y: 0, z: 0},
          },
          {
            obj: '../../static/models/car_4/classic_race_car.glb',
            scale: 300,
            position: {x: 850, y: 30, z: -400},
            rotation: {x: 0, y: 0, z: 0},
          },
          {
            obj: '../../static/models/car_5/jeep.glb',
            scale: 120,
            position: {x: 170, y: 20, z: -110},
            rotation: {x: 0, y: 0, z: 0},
          },
          {
            obj: '../../static/models/car_6/traveler.glb',
            scale: 200,
            position: {x: 200, y: 30, z: -650},
            rotation: {x: 0, y: 0, z: 0},
          },
          {
            obj: '../../static/models/car_7/Motorcycle.glb',
            scale: 200,
            position: {x: 450, y: -5, z: -300},
            rotation: {x: 0, y: 0, z: 0},
          },
          {
            obj: '../../static/models/car_8/farm_tractor.glb',
            scale: 60,
            position: {x: 450, y: -8, z: -650},
            rotation: {x: 0, y: 0, z: 0},
          },
          {
            obj: '../../static/models/car_9/dump_truck.glb',
            scale: 60,
            position: {x: -350, y: 0, z: -550},
            rotation: {x: 0, y: 0, z: 0},
          },
        ],


        //chat
        dialogFormVisible: false,
        dialogName: "Group",
        groupName: "Group",
        input: '',
        infoList: [], //[0]为群聊信息的存储
        webSocket : null,
        userName: '',
        toUser: '',
        data: [],

        //用户名列表
        listName:[],
        //场景
        scene: 'museum'
      }
    },
    mounted() {
      //chat
      let token = this.$store.state.token;
      if(token==null){
        console.log("Token is null");
        this.$router.replace({path: '/Login'})
      }else {
        console.log("Init the websocket...");
        this.userName=JWT(token).sub;
        let scene = this.scene;
        this.webSocket = new WebSocket('ws://localhost:8080/game/scene=' + scene + '/token=' + token);
        this.initWebSocket();
      }

      //群聊
      this.listName.push(this.groupName);
      this.infoList.push({name:this.groupName, data:[]});  //data=[{type,name,data}]
      //自聊
      this.listName.push(this.userName);
      this.infoList.push({name:this.userName, data:[]});

      //3D scene
      this.playerMap = new Map();
      this.createScene(document.getElementById("theCanvas"));
      this.animate();
    },
    methods: {
      //其他人上线
      addUser(userId){
        let obj = this.theObj;
        let loader = new GLTFLoader();
        try {
          loader.load(obj.obj,(model)=>{
            console.log(model,'load online');
            model.scene.position.set(obj.position.x,obj.position.y,obj.position.z);
            model.scene.scale.set(obj.scale, obj.scale, obj.scale);
            model.scene.rotation.set(obj.rotation.x, obj.rotation.y, obj.rotation.z);
            this.addTheName(userId,model.scene);
            this.playerMap.set(userId,model.scene);
            this.webglScene.add(model.scene);
          });
        }catch (e) {
          console.log(e);
        }
      },

      //其他人下线
      deleteUser(userId){
        if (this.playerMap.has(userId)) {
          this.webglScene.remove(this.playerMap.get(userId));
          this.playerMap.delete(userId);
        }
      },

      /********************************Create webglScene*********************************/
      createScene(canvas) {
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
        camera.lookAt( new THREE.Vector3( 200, 10, -100 ) );
        this.camera = camera;
        // //躺着拍&竖着拍&...
        // this.camera.up = new THREE.Vector3( 0, 1, 0 );
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

        //load myself
        this.initModelOfMe().then((ele)=>{
          console.log(ele);
        });

        //load the models
        this.loadModels().then((list)=>{
          console.log(list,"models")
        });

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

      //Load theModels
      async loadModels() {
        let loadingManager = this.loadingManager;
        let loaderFBX = this.promisifyLoader(new FBXLoader(loadingManager));
        let loaderOBJ = this.promisifyLoader(new OBJLoader(loadingManager));
        try {
          for (let i = 0; i < this.theModels.length; i++) {
            let myObj = this.theModels[i];
            if (myObj.obj.toLocaleLowerCase().endsWith(".glb")) {
              let loader = new GLTFLoader();
              await loader.load(myObj.obj,(model)=>{
                console.log(model,'load glb model');
                model.scene.position.set(myObj.position.x,myObj.position.y,myObj.position.z);
                model.scene.rotation.set(myObj.rotation.x, myObj.rotation.y, myObj.rotation.z);
                model.scene.scale.set(myObj.scale, myObj.scale, myObj.scale);
                this.root.add(model.scene);
              });
            }else {
              let object = await loaderFBX.load(myObj.obj);
              object.traverse(function (child) {
                if (child.isMesh) {
                  console.log("ccc");
                  child.castShadow = true;
                  child.receiveShadow = true;
                  child.material.shininess = 100;
                  if (myObj.hasOwnProperty("map")) {
                    let texture = myObj.hasOwnProperty("map") ? new THREE.TextureLoader(loadingManager).load(myObj.map) : null;
                    child.material.map = texture;
                  }
                  if (myObj.hasOwnProperty("normalMap")) {
                    let normalMap = myObj.hasOwnProperty("normalMap") ? new THREE.TextureLoader(loadingManager).load(myObj.normalMap) : null;
                    child.material.normalMap = normalMap;
                  }
                }
              });
              //调整模型比例
              object.scale.set(myObj.scale, myObj.scale, myObj.scale);
              object.position.set(myObj.position.x, myObj.position.y, myObj.position.z);
              object.rotation.set(myObj.rotation.x, myObj.rotation.y, myObj.rotation.z);
              this.root.add(object);
              //object.name = 'myObj01';
            }
          }
        } catch (e) {
          console.log(e);
        }
      },

      async initModelOfMe() {
        let obj = this.theObj;
        let loader = new GLTFLoader();
        try {
          await loader.load(obj.obj,(model)=>{
            console.log(model,'load myself');
            model.scene.position.set(obj.position.x,obj.position.y,obj.position.z);
            model.scene.scale.set(obj.scale, obj.scale, obj.scale);
            model.scene.rotation.set(obj.rotation.x, obj.rotation.y, obj.rotation.z);
            this.addTheName(this.userName,model.scene);
            this.root.add(model.scene);
            this.me = model.scene;
          });
          return this.me;
        } catch (e) {
          console.log(e);
        }
      },

      addTheName(name,scene){
        //先用画布将文字画出
        let canvas = document.createElement("canvas");
        canvas.width = 120;
        canvas.height = 35;
        let ctx = canvas.getContext("2d");
        ctx.fillStyle = "#ffff00";
        ctx.font = "Bold 20px Verdana";
        ctx.lineWidth = 4;
        ctx.fillText(name,0,25);
        let texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;

        //使用Sprite显示文字
        let spriteMaterial = new THREE.SpriteMaterial({
          //color:0xff00ff,//设置精灵矩形区域颜色
          map: texture,//设置精灵纹理贴图
        });
        let sprite = new THREE.Sprite(spriteMaterial);
        // 控制精灵大小，比如可视化中精灵大小表征数据大小
        sprite.scale.set(1, 1, 1); // 只需要设置x、y两个分量就可以
        scene.add(sprite);
        sprite.translateY(5);
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

        console.log(this.controls);
        this.controls.addEventListener('lock', function () {
          theBlocker.style.display = 'none';
          theInstruction.style.display = 'none';
          /*this.controls.getObject().position.x = this.$store.state.position.x;
          this.controls.getObject().position.y = this.$store.state.position.y;
          this.controls.getObject().position.z = this.$store.state.position.z;*/
        });

        this.controls.addEventListener('unlock', function () {
          theBlocker.style.display = 'block';
          theInstruction.style.display = '';
          /*this.$store.commit('setPosition', this.controls.getObject().position);
          console.log(this.myPosition,"iiiiiiiiiiiiiiiiiiiiii",this.controls.getObject().position);*/
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
            this.showDialogForm();//弹出聊天室
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

      /**********************************run the 3D scene************************************/
      animate() {
        requestAnimationFrame(this.animate);
        if (this.controls.isLocked) {

          let time = performance.now();
          let delta = (time - this.prevTime) / 1000;
          //console.log(delta,"[[[[[[[[[[[[[[[[[");
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

          this.me.position.set(a,b,c);

          //发送自己的坐标
          this.judgePosition(a,b,c);

          //console.log(a,b,c,"eke");
          //相机上下
          let height = this.velocity.y * delta;
          let srcHeight = this.controls.getObject().position.y;
          this.controls.getObject().position.set(a, srcHeight+height, c);

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
          this.webSocketSend(this.userName,x,y,z,this.theObj.rotation.x,this.theObj.rotation.y,this.theObj.rotation.z);
        }
      },

      setMyPosition(x,y,z){
        this.myPosition.x=x;
        this.myPosition.y=y;
        this.myPosition.z=z;
      },

      clickTheScene(){
        this.controls.lock();
        this.prevTime = performance.now();
      },

      /****************************Chat****************************************************/
      showDialogForm(){
        this.dialogFormVisible = true;
      },

      initWebSocket() {
        this.webSocket.onerror = this.onError;  // 通讯异常
        this.webSocket.onopen = this.onOpen;  // 连接成功
        this.webSocket.onmessage = this.onMessage;  // 收到消息时回调
        this.webSocket.onclose = this.onClose;  // 连接关闭时回调
      },
      onError() {
        console.log("websocket error...")
      },
      onOpen() {
        console.log("websocket start...");
      },
      onMessage(event) {
        console.log("Get the message from the backend");
        let recv_data = JSON.parse(event.data);
        console.log("message after parse:", recv_data);
        //recv_data={isSystem: true, type: "online", fromUsername: "System", content: "admin123"}

        //add the receive data to the content
        let isSystem = recv_data.isSystem;
        let type = recv_data.type;
        let fromUsername = recv_data.fromUsername;
        let content = recv_data.content;

        if (isSystem === true) {//系统消息：除去私聊信息以外
          //this.dialogName = this.groupName;
          if (type === 'online' || type === 'offline') {
            //群聊上线、下线群广播
            if (type === 'online') {
              //上线
              console.log(this.listName);
              if (this.listName.indexOf(content) === -1) {
                this.listName.push(content);
                let flag = false;
                for (let i = 0; i < this.infoList.length; i++) {
                  if (this.infoList[i].name === content) {
                    flag = true;
                    break;
                  }
                }
                if (!flag) {
                  this.infoList.push({name: content, data: []});
                }
                //add
                this.addUser(content);
                content = content + ' is ' + type;
                this.$message({
                  message: content,
                  type: 'success'
                });
              }else{
                //add
                this.addUser(content);
                content = content + ' is ' + type + ' again!';
                this.$message({
                  message: content,
                  type: 'success'
                });
              }
            }else{
              //下线
              console.log(content);
              console.log('before offline:',this.listName);
              let index = this.listName.indexOf(content);
              if (index > -1) {
                this.listName.splice(index,1);
                console.log(index);
              }

              //delete
              this.deleteUser(content);
              console.log('after offline:',this.listName);
              content = content + ' is ' + type +'!';
              this.$message(content);
            }
            //this.data = this.infoList[0].data;
            this.addMessage(this.infoList[0].data, 0, 'system', content);
            //console.log(this.data);
            //滚动到底部
            this.scroll();
          }else if (type === 'chat') {
            //群聊：信息广播
            //this.data = this.infoList[0].data;
            this.addMessage(this.infoList[0].data, 1, fromUsername, content);
            //滚动到底部
            this.scroll();
          }else{
            // type = coordinate : 处理坐标
            if (fromUsername === 'system') {
              //加入场景的时候返回所有的用户信息
              let resObj = null, userId;
              let x,y,z,rx,ry,rz;
              for (let i = 0; i < content.length; i++) {
                resObj = JSON.parse(content[i]);
                userId = resObj.userID;
                x = resObj.x;
                y = resObj.y;
                z = resObj.z;
                rx = resObj.rx;
                ry = resObj.ry;
                rz = resObj.rz;
                if ( userId !== this.userName ) {
                  this.listName.push(userId);
                  this.infoList.push({name: userId, data: []});
                  //各个用户的坐标的加入scene
                  let obj = this.theObj;
                  let loader = new GLTFLoader();
                  try {
                    loader.load(obj.obj,(model)=>{
                      console.log(model,'load online');
                      model.scene.position.set(x,y,z);
                      model.scene.rotation.set(rx, ry, rz);
                      model.scene.scale.set(obj.scale, obj.scale, obj.scale);
                      this.addTheName(userId,model.scene);
                      this.playerMap.set(userId,model.scene);
                      this.webglScene.add(model.scene);
                    });
                  }catch (e) {
                    console.log(e);
                  }
                }
              }
            }else{
              //对特定的用户userId进行坐标的更新
              let userId = content.username;
              let x = content.x;
              let y = content.y;
              let z = content.z;
              let rx = content.rx;
              let ry = content.ry;
              let rz = content.rz;
              if (this.playerMap.has(userId)) {
                let model = this.playerMap.get(userId);
                model.position.set(x,y,z);
                model.rotation.set(rx, ry, rz);
              }
            }
          }
        }else{
          //私聊：聊天消息
          if (fromUsername === this.userName) {
            //add nothing
            //this.dialogName = this.userName + ' [ME]';
          }else {
            //this.dialogName = this.groupName+'('+fromUsername+')';
            let flag = false;
            let addData=[];
            for (let i = 0; i < this.infoList.length; i++) {
              if (this.infoList[i].name === fromUsername) {
                flag = true;
                addData = this.infoList[i].data;
                break;
              }
            }
            if (flag) {
              this.addMessage(addData, 1, fromUsername, content);
              //滚动到底部
              this.scroll();
            }else {
              this.listName.push(fromUsername);
              this.infoList.push({name: fromUsername, data:[{type:1, name:fromUsername, message: content}]});
            }
          }
        }
      },
      onClose() {
        console.log("websocket close ...");
      },

      webSocketSend(username, x, y, z, rx, ry, rz) {
        //发送消息
        let len = arguments.length;
        if (len === 0) {//判断是否为发送信息
          let message = this.input;
          if (message === '') {
            this.$message.error('Input can not be empty!');
          }else {
            if (this.dialogName === this.groupName) {
              //群发消息
              let send_data = {isSystem: true, type: "chat", toUsername: 'system', content: message};
              send_data = JSON.stringify(send_data);
              this.webSocket.send(send_data);
              this.input = '';
              this.data = this.infoList[0].data;
              this.addMessage(this.data, 2, this.userName, message);
              //设置滚动条
              this.scroll();
            }else {
              //私聊
              let send_data = {isSystem: false, type: "chat", toUsername: this.toUser, content: message};
              send_data = JSON.stringify(send_data);
              this.webSocket.send(send_data);
              this.input = '';
              this.addMessage(this.data, 2, this.userName, message);
              //设置滚动条
              this.scroll();
            }
          }
        }else{//发送：更新坐标
          let content = {
            username: username,
            x: x,
            y: y,
            z: z,
            rx: rx,
            ry: ry,
            rz: rz
          };
          let send_data = {isSystem: true, type: "coordinate", toUsername: 'not_used', content: content};
          send_data = JSON.stringify(send_data);
          this.webSocket.send(send_data);
        }
      },
      webSocketClose() {//关闭连接
        this.webSocket.close();
        this.$router.replace({path:'/'});
      },

      addMessage(data, type, name, message) {
        data.push({type:type, name:name, message:message});
      },

      toggleChat(toUser) {
        this.toUser = toUser;
        console.log(this.toUser);
        //改变群名:群聊、私聊
        if (toUser === this.groupName) {
          //群聊
          this.dialogName = this.groupName;
          this.data = this.infoList[0].data;
          //设置滚动条
          this.scroll();
        }else {
          //私聊
          if (this.userName === toUser) {
            this.dialogName = toUser + ' [ME]';
          }else {
            this.dialogName = this.groupName+'('+toUser+')';
          }

          let flag = false;
          for (let i = 0; i < this.infoList.length; i++) {
            if (toUser === this.infoList[i].name) {
              this.data = this.infoList[i].data;
              flag = true;
              break;
            }
          }
          if (!flag) {
            this.data = [];
          }
          //设置滚动条
          this.scroll();
        }
      },

      //滚动到最底
      scroll(){
        //nextTick在DOM完成后在执行
        this.$nextTick(() => {
          let element = document.getElementById('chatBody');  // 获取对象
          if (element != null) {
            element.scrollTop = element.scrollHeight;  // 滚动高度
          }
        })
      },
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
  .limitTitleDirectory {
    width: 120px;		/* 限制文本宽度 */
    overflow: hidden;		/* 超出的文本隐藏 */
    text-overflow: ellipsis;	/* 溢出的文本内容用 ... 代替 */
    white-space: nowrap;		/* 溢出不换行*/
  }

  .el-menu-item {
    font-size: 14px;
    color: #303133;
    cursor: pointer;
    -webkit-transition: border-color .3s,background-color .3s,color .3s;
    transition: border-color .3s,background-color .3s,color .3s;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }

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
  .el-dialog__body {
    padding: 0px 20px 10px 20px;
    color: #606266;
    font-size: 14px;
    word-break: break-all;
  }
  .el-card__body{
    padding: 2px 0 0 0;
  }
  #userItem:hover{
    background: #b4bccc;
  }
</style>

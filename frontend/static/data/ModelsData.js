let carIntro={
  // car0:"Just an wagon",
  // car1:"日内瓦车展，作为Enzo车型的换代产品，法拉利La Ferrari正式亮相，这款高性能公路跑车仅限量生产499辆。“我们决定将这款车型命名为LaFerrari。”法拉利总裁卢卡·迪·蒙特泽莫罗宣称，“这款为法拉利收藏家们量身打造的超级跑车，绝对是公司又一非凡力作。La Ferrari充分体现了品牌独一无二的特性，无与伦比的工艺以及大胆创新的设计理念。完美的车型设计，给人以强烈的赛道感受，潜藏极速狂飙的霸气。",
  // car2:"经典MINI笑脸造型全新进化。可选配的全新钢琴黑外观套件，享受直击灵魂的浪漫。更宽大的后保险杠，全新居中设计后雾灯，为车身营造更低的视觉姿态。让气场和运动感，一路尾随你。全新轮眉造型，让精心选配的轮毂更吸睛。全新轮毂，创造更多的可能。全新曲棍球杆造型侧舷窗，为侧颜注入独一份运动感。全新自适应悬架，可选配减震器，最多可达50%减震效果。谁说舒适与运动，不可兼得？",
  // car3:"沙滩车是全地形车—All Terrain Vehicle（适合所有地形的交通工具）缩写是ATV的俗称，又称\"全地形四轮越野机车\"。沙滩车可以在任何地形上行驶的车辆，在普通车辆难以机动的地形上行走自如。车辆简单实用，越野性能好，外观一般无篷。在软质的沙地 上，ATV宽大的轮胎增加与地上接触面积产生更大摩擦力，配合独特的胎纹使轮胎不易空转打滑，而容易行驶于沙地；因而误解被称之为[沙滩车]。品质良好、性能优良的 ATV不仅能行驶沙滩；河 床、林道、溪流甚至更恶劣的沙漠都能轻易克服，是一款是很优秀的交通工具。",
  // car4:"老爷车这一概念始于1973年，出现在英国的一本《名人与老爷车》的杂志上，尽管它的直译应该是“经典的古老汽车”，但由于“老爷车”这个词强烈的拟人色彩，因此很快得到老爷车爱好者的认同，并迅速蔓延，成为世界各地爱好者对老式汽车的统一称谓。爷车收藏不仅同样具有放松和社交的功能，还蕴藏着获得投资回报的可能。而与玩股票基金等传统投资相比，投资者不仅不用成天担心价格的涨落，还能在娱乐身心的同时坐享期待中的升值所带来的满足感。",
  // car5:"吉普牧马人相信是大部分人能想到的第一款敞篷越野车。配置软、硬两种顶篷两种设计的两门版牧马人也是国内市场唯一一款配置双顶组合的越野车。采用3.152升增压中冷柴油发动机，最大扭距313牛米。同时，匹配先进的三锥同步结构的5速5档全同步手动变速器，具有汽、柴两种发动机通用。顶棚关闭时可以隔绝噪声、风噪和振动，并加强车身的整体隔热效果。顶棚打开以后可以享有无穷无尽的蓝天。",
  // car6:"四轮电动观光车是属于区域专用车的一种，是试用范围有旅游景区、公园、大型游乐园、封闭社区、校园、花园式酒店、度假村、别墅区、城市步行街，港口等区域开发的自驾游，区域巡查，代步专用的节能环保型电动乘用特种设备车辆。目前国内2-23座观光车产品基本都实现了72伏交流动力免维护铅酸电池配置（也可以选配锂电池），新增了刹车助力转向助力系统，双助力使驾驶性能更优，智能系统如360度倒车影像、行车记录仪、GPS定位、安装自动售票机、监控等都大大提高了应用性能。",
  // car7:"宝马R1200GS ADV是一台很多拥有特性的摩托车，长行程的避震器使它乍看之下很像越野车或者拉力车型，跑起来又拥有街车般的舒适度，而在长途驾驶时，它的舒适性又不输休旅车，30L的油箱让续航里程轻易超过500KM。拥有以上所有特点的它是不折不扣的多功能车。这类车型最大的特点就是跨界，使用范围极其宽泛，笔者身边的大多数人在用它郊游之外，每天上下班也全靠它，甚至还有人用它来“闪送”。",
  // car8:"拖拉机是一款用于牵引和驱动作业机械完成各项移动式作业的自走式动力机。虽是一种比较复杂的机器，其型式和大小也各不相同，但它们都是由发动机、底盘和电器设备三大部分组成的，每一项都不可或缺的。前驱，敞篷，健身启动钥匙，手动档和自动档为一体，共有前进六个档两个倒档可供选着，360度无死角全景视角。悬挂式坐舱，尽显英伦奢华，手扶式人性化操控方向，单缸咆哮式发动机，尽显您低调奢华气质。",
  // car9:"自卸车是指通过液压或机械举升而自行卸载货物的车辆，又称翻斗车，由汽车底盘、液压举升机构、货厢和取力装置等部件组成，自卸车俗称“翻斗车”主要由液压倾卸机构、车厢、车架及其附件构成，其中液压倾卸机构和车厢结构各个改装厂家不尽相同,以下按车厢和举升机构的型式两个方面说明自卸车的结构。该种车外形特别高大，属于超廓型车辆，载重质量大，动力强劲，车架为工程机械车辆专用结构，经常与挖掘机、装载机、带式输送机等工程机械联合作业，构成装、运、卸生产线，进行土方、砂石、散料的装卸运输工作。"
  car0:"../../static/models/car_1/car1.PNG",
  car1:"../../static/models/car_1/car1.PNG",
  car2:"../../static/models/car_2/car2.PNG",
  car3:"../../static/models/car_3/car3.PNG",
  car4:"../../static/models/car_4/car4.PNG",
  car5:"../../static/models/car_5/car5.PNG",
  car6:"../../static/models/car_6/car6.PNG",
  car7:"../../static/models/car_7/car7.PNG",
  car8:"../../static/models/car_8/car8.PNG",
  car9:"../../static/models/car_9/car9.PNG",
};

let carModels=[
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
    info: {
      content: carIntro.car0,
      position: {x: -350, y: 10, z: -170},
      rotation_info: {x: -0.7, y: 0, z: 0}
    }
  },
  {
    obj: '../../static/models/car_1/run_car.glb',
    scale: 200,
    position: {x: 1000, y: 30, z: -200},
    rotation: {x: 0, y: 0, z: 0},
    info: {
      content: carIntro.car1,
      position: {x: 1100, y: 10, z: -200},
      rotation_info: {x: -0.7, y: 0, z: 0}
    }
  },
  {
    obj: '../../static/models/car_2/open_car.glb',
    scale: 200,
    position: {x: 1000, y: 30, z: -450},
    rotation: {x: 0, y: 0, z: 0},
    info: {
      content: carIntro.car2,
      position: {x: 1100, y: 10, z: -450},
      rotation_info: {x: -0.7, y: 0, z: 0}
    }
  },
  {
    obj: '../../static/models/car_3/bengbeng.glb',
    scale: 300,
    position: {x: 700, y: 60, z: -180},
    rotation: {x: 0, y: 0, z: 0},
    info: {
      content: carIntro.car3,
      position: {x: 700, y: 10, z: -150},
      rotation_info: {x: -0.7, y: 0, z: 0}
    }
  },
  {
    obj: '../../static/models/car_4/classic_race_car.glb',
    scale: 280,
    position: {x: 710, y: 45, z: -630},
    rotation: {x: 0, y: 0, z: 0},
    info: {
      content: carIntro.car4,
      position: {x: 720, y: 10, z: -390},
      rotation_info: {x: -0.7, y: 0, z: 0}
    }
  },
  {
    obj: '../../static/models/car_5/jeep.glb',
    scale: 120,
    position: {x: 170, y: 20, z: -110},
    rotation: {x: 0, y: 0, z: 0},
    info: {
      content: carIntro.car5,
      position: {x: 100, y: 10, z: -20},
      rotation_info: {x: -0.7, y: 0, z: 0}
    }
  },
  {
    obj: '../../static/models/car_6/traveler.glb',
    scale: 200,
    position: {x: 200, y: 30, z: -650},
    rotation: {x: 0, y: 0, z: 0},
    info: {
      content: carIntro.car6,
      position: {x: 100, y: 10, z: -650},
      rotation_info: {x: -0.7, y: 0, z: 0}
    }
  },
  {
    obj: '../../static/models/car_7/Motorcycle.glb',
    scale: 200,
    position: {x: 450, y: -5, z: -300},
    rotation: {x: 0, y: 0, z: 0},
    info: {
      content: carIntro.car7,
      position: {x: 480, y: 10, z: -300},
      rotation_info: {x: -0.7, y: 0, z: 0}
    }
  },
  {
    obj: '../../static/models/car_8/farm_tractor.glb',
    scale: 60,
    position: {x: 450, y: -8, z: -650},
    rotation: {x: 0, y: 0, z: 0},
    info: {
      content: carIntro.car8,
      position: {x: 500, y: 10, z: -650},
      rotation_info: {x: -0.7, y: 0, z: 0}
    }
  },
  {
    obj: '../../static/models/car_9/dump_truck.glb',
    scale: 50,
    position: {x: -350, y: -2, z: -550},
    rotation: {x: 0, y: 0, z: 0},
    info: {
      content: carIntro.car9,
      position: {x: -250, y: 10, z: -550},
      rotation_info: {x: -0.7, y: 0, z: 0}
    }
  },
];

export {
  carModels
}

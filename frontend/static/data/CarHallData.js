let carHallWalls=[
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
];
let carHallText=[
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
];

export {
  carHallWalls,
  carHallText
}

<template>
  <div>
    <div id="container"></div>
  </div>
</template>

<script>
  import * as Three from 'three'

  export default {
    name: 'ThreeTest',
    data () {
      return {
        camera: null,
        scene: null,
        renderer: null,
        mesh: null
      }
    },
    methods: {
      init: function () {
        let container = document.getElementById('container');
        //创建相机
        this.camera = new Three.PerspectiveCamera(70, container.clientWidth / container.clientHeight, 0.01, 1000);
        //this.camera.position.z = 1
        //设置相机的位置
        this.camera.position.set(0, 0, 1);

        //创建场景
        this.scene = new Three.Scene();
        //创建对象
        let geometry = new Three.BoxGeometry(0.1, 0.1, 0.1);
        let material = new Three.MeshNormalMaterial();
        this.mesh = new Three.Mesh(geometry, material);
        this.scene.add(this.mesh);

        //渲染器
        this.renderer = new Three.WebGLRenderer({antialias: true});
        this.renderer.setSize(container.clientWidth/2, container.clientHeight);
        container.appendChild(this.renderer.domElement)
      },
      animate: function () {
        requestAnimationFrame(this.animate);
        this.mesh.rotation.x += 0.01;
        this.mesh.rotation.y += 0.02;
        this.renderer.render(this.scene, this.camera);
      }
    },
    mounted () {
      this.init();
      this.animate();
    }
  }
</script>
<style scoped>
  #container {
    height: 400px;
  }
</style>

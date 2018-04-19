import * as THREE from 'three';
import FBO from './FBO.js';
import { getPerspectiveSize } from '../../utils/3d';
// import vertexShader from './shader/object.vs';
// import fragmentShader from './shader/object.fs';

export default class Plane extends THREE.Object3D {
  constructor(options) {
    super();

    this._setupFBO(options);
    this._setupGeometry();
    this._setupMaterial();
    this._setupMesh();
  }

  _setupFBO(options) {
    this._FBO = new FBO({ renderer: options.renderer, width: 1024, height: 1024 });
  }

  _setupGeometry() {
    this._geometry = new THREE.PlaneBufferGeometry( 1, 1, 1, 1 );
  }

  _setupMaterial() {
    this._material = new THREE.MeshBasicMaterial({
      map: this._FBO.getTexture(),
      transparent: true,
    });
  }

  _setupMesh() {
    this._mesh = new THREE.Mesh(this._geometry, this._material);
    this.add(this._mesh);
  }

  // Events -----

  resize(camera) {
    const perspectiveSize = getPerspectiveSize(camera, Math.abs( camera.position.z - this.position.z));

    this.scale.set(perspectiveSize.width, perspectiveSize.height, 1);
  }

  // Render ----

  update() {
    this._FBO.update();
  }
}

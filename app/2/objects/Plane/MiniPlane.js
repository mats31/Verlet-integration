import * as THREE from 'three';
import { randomFloat, randomInteger } from '../../utils/math';

// import vertexShader from './shader/object.vs';
// import fragmentShader from './shader/object.fs';

export default class MiniPlane extends THREE.Object3D {
  constructor() {
    super();

    this.params = {
      x: 0,
      y: 0,
      oldX: 0,
      oldY: 0,
    };

    this._setupGeometry();
    this._setupMaterial();
    this._setupMesh();
  }

  _setupGeometry() {
    this._geometry = new THREE.PlaneBufferGeometry( randomFloat(50, 100), randomFloat(50, 100), 1, 1 );
  }

  _setupMaterial() {
    const map = new THREE.TextureLoader().load('textures/spritesheet.png');
    const values = [0, 0.25, 0.5, 0.75];
    map.repeat.set( 0.25, 0.25 );
    map.offset.set( values[randomInteger(0, 3)], values[randomInteger(0, 3)] );
    this._material = new THREE.MeshBasicMaterial({
      map,
      transparent: true,
      opacity: randomFloat( 0.05, 0.1),
    });
  }

  _setupMesh() {
    this._mesh = new THREE.Mesh(this._geometry, this._material);
    this.add(this._mesh);
  }

  // Render ------
  update() {
    this.position.set(this.params.x, this.params.y, 0);
  }
}

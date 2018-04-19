import FBOPersistence from '../../helpers/3d/FBOPersistence/FBOPersistence';
import MiniPlane from './MiniPlane.js';
import { randomFloat } from '../../utils/math';
export default class FBO extends FBOPersistence {
  constructor(options) {
    super(options);

    this._miniPlanes = [];

    this._bounce = 0.97;
    this._gravity = 0.5;

    this._setupContent();
  }

  _setupContent() {
    // this._miniPlane1 = new MiniPlane({});
    // this._miniPlane1.params = {
    //   x: -50,
    //   y: 50,
    //   oldX: -55,
    //   oldY: 45,
    // };
    // this._scene.add(this._miniPlane1);
    //
    // this._miniPlane2 = new MiniPlane({});
    // this._miniPlane2.params = {
    //   x: 50,
    //   y: 50,
    //   oldX: 45,
    //   oldY: 45,
    // };
    // this._scene.add(this._miniPlane2);
    //
    // this._miniPlane3 = new MiniPlane({});
    // this._miniPlane3.params = {
    //   x: 50,
    //   y: -50,
    //   oldX: 45,
    //   oldY: -55,
    // };
    // this._scene.add(this._miniPlane3);
    //
    // this._miniPlane4 = new MiniPlane({});
    // this._miniPlane4.params = {
    //   x: -50,
    //   y: -50,
    //   oldX: -55,
    //   oldY: -55,
    // };
    // this._scene.add(this._miniPlane4);
    //
    // this._miniPlanes.push(this._miniPlane1, this._miniPlane2, this._miniPlane3, this._miniPlane4);

    for (let i = 0; i < 100; i++) {
      const miniplane = new MiniPlane({});
      const randomX = randomFloat(-256, 256);
      const randomY = randomFloat(0, 512);
      miniplane.params = {
        x: randomX,
        y: randomY,
        oldX: randomX - randomFloat(1, 8),
        oldY: randomY - randomFloat(1, 8),
      };
      this._scene.add(miniplane);
      this._miniPlanes.push(miniplane);
    }

  }

  // Update --------------------------------------------------------------------

  update() { // To overwrite
    this._updateFBO();
    this._updateMiniPlanes();
  }

  _updateFBO() {
    this._renderer.render(this._scene, this._camera, this._FBO2, true);

    const t1 = this._FBO1;
    this._FBO1 = this._FBO2;
    this._FBO2 = t1;

    this._bufferPlane.updateDiffuse(this._FBO1.texture);
  }

  _updateMiniPlanes() {
    const width = 512;
    const height = 512;

    for (let i = 0; i < this._miniPlanes.length; i++) {
      const plane = this._miniPlanes[i].params;
      const vx = plane.x - plane.oldX;
      const vy = plane.y - plane.oldY;

      plane.oldX = plane.x;
      plane.oldY = plane.y;
      plane.x += vx;
      plane.y += vy;
      plane.y -= this._gravity;

      if (plane.x > width * 0.5) {
        plane.x = width * 0.5;
        plane.oldX = plane.x + vx * this._bounce;
      } else if (plane.x < width * -0.5) {
        plane.x = width * -0.5;
        plane.oldX = plane.x + vx * this._bounce;
      }

      if (plane.y > height * 0.5) {
        plane.y = height * 0.5;
        plane.oldY = plane.y + vy * this._bounce;
      } else if (plane.y < height * -0.5) {
        plane.y = height * -0.5;
        plane.oldY = plane.y + vy * this._bounce;
      }

      this._miniPlanes[i].update();
    }
  }
}

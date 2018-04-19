import FBOPersistence from '../../helpers/3d/FBOPersistence/FBOPersistence';
import MiniPlane from './MiniPlane.js';
import { randomFloat } from '../../utils/math';
export default class FBO extends FBOPersistence {
  constructor(options) {
    super(options);

    this._miniPlanes = [];
    this._sticks = [];

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

    for (let i = 0; i < 10; i++) {
      const miniplane = new MiniPlane({});
      const randomX = randomFloat(-256, 256);
      const randomY = randomFloat(0, 512);
      miniplane.params = {
        x: randomX,
        y: randomY,
        oldX: randomX - randomFloat(1, 3),
        oldY: randomY - randomFloat(1, 3),
      };
      this._scene.add(miniplane);
      this._miniPlanes.push(miniplane);

      if (i % 2 === 1 && i !== 0) {
        this._sticks.push({
          p0: this._miniPlanes[i - 1],
          p1: this._miniPlanes[i],
          length: 100,
        });
      }
    }

  }

  // Update --------------------------------------------------------------------

  update() { // To overwrite
    this._updateFBO();
    this._updateMiniPlanes();
    this._updateSticks();

    for (let i = 0; i < this._miniPlanes.length; i++) {
      this._miniPlanes[i].update();
    }
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
    }
  }

  _updateSticks() {
    for (let i = 0; i < this._sticks.length; i++) {
      const s = this._sticks[i];
      const dx = s.p1.params.x - s.p0.params.x;
      const dy = s.p1.params.y - s.p0.params.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const diffrence = s.length - distance;
      const percent = diffrence / distance / 2;
      const offsetX = dx * percent;
      const offsetY = dy * percent;

      s.p0.params.x -= offsetX;
      s.p0.params.y -= offsetY;

      s.p1.params.x += offsetX;
      s.p1.params.y += offsetY;
    }
  }
}

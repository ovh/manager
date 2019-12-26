import assignIn from 'lodash/assignIn';
import head from 'lodash/head';

/* eslint-disable */
/**
 * One-segment
 *         /
 *       /
 *     /
 *
 * Two-segement
 *        |
 *        |
 *        |
 *       /
 *     /
 *   /
 *
 * Tree-segment
 *         |
 *         |
 *         |
 *        /
 *      /
 *    /
 *   |
 *   |
 *   |
 *
 */

export default (jsPlumb, jsPlumbUtil) => {
  const TucTwoSegments = function TucTwoSegments(params) {
    const _super = jsPlumb.Connectors.AbstractConnector.apply(this, arguments);
    this.type = 'TucTwoSegments';

    const parameters = assignIn({ radius: 10 }, params);

    /**
     * Compute the length of a vector
     * @param {Array} vect [x, Y] vector
     * @returns {Number} Length
     */
    function vectLength(vect) {
      return Math.sqrt(Math.pow(vect[0], 2) + Math.pow(vect[1], 2));
    }

    /**
     * Perform a rotation on a vector
     * @param {Array}  vect  Vector to rotate
     * @param {Number} angle Rotation angle
     * @returns {Array}      Rotated vector
     */
    function vectorRotation(vect, angle) {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return [vect[0] * cos - vect[1] * sin, vect[0] * sin + vect[1] * cos];
    }

    /**
     * Compute the intersection between the 2 lines from the endpoints
     * @param paintInfo
     * @returns {Object} (x,y) coordinates
     */
    function getIntersection(paintInfo) {
      // Input parameters
      const x0 = paintInfo.sx;
      const y0 = paintInfo.sy;
      const x1 = paintInfo.tx;
      const y1 = paintInfo.ty;
      const vector0 = paintInfo.so;
      const vector1 = paintInfo.to;

      // Output parameters
      let x;
      let y;

      // Slopes
      let slope0;
      let slope1;

      // No vertical vector
      if (vector0[0] !== 0 && vector1[0] !== 0) {
        slope0 = vector0[1] / vector0[0];
        slope1 = vector1[1] / vector1[0];
        if (slope1 - slope0) {
          x = (y0 - y1 + slope1 * x1 - slope0 * x0) / (slope1 - slope0);
          y = slope0 * (x - x0) + y0;
        } else {
          return null; // parallel vectors => no intersection !
        }
        return {
          x,
          y,
        };
      }

      // Vector 0 is vertical (infinite slope)
      if (vector0[0] === 0) {
        if (!vector1[0]) {
          return null; // parallel vectors => no intersection !
        }
        slope1 = vector1[1] / vector1[0];
        x = x0;
        if (slope1) {
          y = slope1 * (x0 - x1) + y1;
        } else {
          y = y1;
        }
        return {
          x,
          y,
        };
      }

      // Vector 1 is vertical (infinite slope)
      if (vector1[0] === 0) {
        if (!vector0[0]) {
          return null; // parallel vectors => no intersection !
        }
        slope0 = vector0[1] / vector0[0];
        x = x1;
        if (slope0) {
          y = slope0 * (x1 - x0) + y0;
        } else {
          y = y0;
        }
        return {
          x,
          y,
        };
      }
    }

    /**
     * Solve the equation Ax² + Bx + C = 0
     * @param {Number} A Coef second degree
     * @param {Number} B Coef first degree
     * @param {Number} C Coef const
     * @returns {Array} Solutions
     */
    function secondDegree(A, B, C) {
      if (A === 0) {
        return [-C / B];
      }
      const delta = Math.pow(B, 2) - 4 * A * C;
      if (delta < 0) {
        return [];
      }
      if (delta === 0) {
        return [-B / (2 * A)];
      }
      if (delta > 0) {
        return [
          (-B + Math.sqrt(delta)) / (2 * A),
          (-B - Math.sqrt(delta)) / (2 * A),
        ];
      }
    }

    /**
     * Shift a point inside a segment
     * @param {Object} a    First point (from which th shift is applyed
     * @param {Object} b    Second point of the segment
     * @param {Number} dist Distance to shift
     * @returns {Object} (x,y) coordinates
     */
    function shiftInside(a, b, dist) {
      // vertical line
      if (a.x === b.x) {
        return {
          x: a.x,
          y: a.y < b.y ? a.y + dist : a.y - dist, // Math.min(a.y, b.y) + dist
        };
      }

      // horizontal line
      if (a.y === b.y) {
        return {
          x: a.x < b.x ? a.x + dist : a.x - dist, // Math.min(a.x, b.x) + dist,
          y: a.y,
        };
      }

      // leaned line
      const slope = (b.y - a.y) / (b.x - a.x);
      const shift = a.y - slope * a.x;

      const solve = secondDegree(
        1 + Math.pow(slope, 2),
        -2 * (a.x + slope * (a.y - shift)),
        Math.pow(a.x, 2) + Math.pow(a.y - shift, 2) - Math.pow(dist, 2),
      );

      const solutionX = head(
        solve.filter((x) => x >= Math.min(a.x, b.x) && x <= Math.max(a.x, b.x)),
      );

      return {
        x: solutionX,
        y: slope * solutionX + shift,
      };
    }

    /**
     * Compute the determinant of 2 vectors
     * @param vect0
     * @param vect1
     * @returns {number}
     */
    function getAngle(vect0, vect1) {
      const scalaire = vect0[0] * vect1[1] + vect0[1] * vect1[0];
      const vectorial = vect0[0] * vect1[1] - vect0[1] * vect1[0];
      const lengths = vectLength(vect0) * vectLength(vect1);

      const sinus = vectorial / lengths;
      const cosinus = scalaire / lengths;

      if (sinus > 0 && cosinus > 0) {
        return Math.acos(cosinus);
      }

      if (sinus < 0 && cosinus > 0) {
        return -Math.acos(cosinus);
      }

      if (sinus > 0 && cosinus < 0) {
        return Math.acos(cosinus) + Math.PI / 2;
      }

      if (sinus < 0 && cosinus < 0) {
        return -Math.acos(cosinus) - Math.PI / 2;
      }
    }

    /**
     * Get the cutting length to insert the radius
     * @param {Object} paintInfo
     * @param {Number} radius
     */
    function getShift(paintInfo, radius) {
      const vector0 = paintInfo.so;
      const vector1 = paintInfo.to;

      const scalaire = vector0[0] * vector1[0] + vector0[1] * vector1[1];
      const alpha = Math.acos(
        scalaire / (vectLength(vector0) * vectLength(vector1)),
      );

      return radius / Math.tan(alpha / 2);
    }

    /**
     * Get the distances between the two parallels (we assume that origin vector and target vector are parallel)
     * @param {Object} paintInfo
     * @returns {Number} Distance
     */
    function getParallelDistance(paintInfo) {
      const projection = getIntersection({
        sx: paintInfo.sx,
        sy: paintInfo.sy,
        tx: paintInfo.tx,
        ty: paintInfo.ty,
        so: paintInfo.so,
        to: vectorRotation(paintInfo.to, Math.PI / 2),
      });
      return vectLength([
        paintInfo.tx - projection.x,
        paintInfo.ty - projection.y,
      ]);
    }

    /**
     * Draw a two-segments connector
     * @param {Object} paintInfo
     * @param {Object} instance  Current instance
     * @returns {Boolean} True if the connector could be drawn. If false, it means that origin vector and target
     *                    vector are parallel
     */
    function twoSegments(paintInfo, instance) {
      const intersection = getIntersection({
        sx: paintInfo.sx,
        sy: paintInfo.sy,
        tx: paintInfo.tx,
        ty: paintInfo.ty,
        so: paintInfo.so,
        to: paintInfo.to,
      });

      if (!intersection) {
        // Damn ! Origin vector and target vector are parallel
        return false;
      }

      // offset to shorten the lines near the intersection
      const shift = getShift(
        {
          so: paintInfo.so,
          to: paintInfo.to,
        },
        0,
      );

      // point to shorten the source line
      const stopS = shiftInside(
        intersection,
        {
          x: paintInfo.sx,
          y: paintInfo.sy,
        },
        shift,
      );

      // point to shorten the target line
      const stopT = shiftInside(
        intersection,
        {
          x: paintInfo.tx,
          y: paintInfo.ty,
        },
        shift,
      );

      // Draw source line
      _super.addSegment(instance, 'Straight', {
        x1: paintInfo.sx,
        y1: paintInfo.sy,
        x2: stopS.x,
        y2: stopS.y,
      });

      // Draw target line
      _super.addSegment(instance, 'Straight', {
        x1: stopT.x,
        y1: stopT.y,
        x2: paintInfo.tx,
        y2: paintInfo.ty,
      });

      return true;
    }

    /**
     * Compute the connector
     * @param paintInfo
     * @private
     */
    this._compute = function _compute(paintInfo /* , paintParams */) {
      const radius = parameters.radius;

      // Try to connect
      if (!twoSegments(paintInfo, this)) {
        // Did not connect ! Origin vector and target vector are parallel.
        // Check the distance between lines
        if (getParallelDistance(paintInfo) < radius) {
          // Draw a one-segment (straight line), because there is not enough place to draw a radius
          _super.addSegment(this, 'Straight', {
            x1: paintInfo.sx,
            y1: paintInfo.sy,
            x2: paintInfo.tx,
            y2: paintInfo.ty,
          });
        } else {
          // Draw a three-segments (2 x two-segment)
          const center = {
            x: (paintInfo.sx + paintInfo.tx) / 2,
            y: (paintInfo.sy + paintInfo.ty) / 2,
          };

          // Rotate vector (Pi / 4)
          const vect1 = vectorRotation(paintInfo.so, (3 * Math.PI) / 4);
          const vect2 = vectorRotation(paintInfo.to, (3 * Math.PI) / 4);

          twoSegments(
            {
              sx: paintInfo.sx,
              sy: paintInfo.sy,
              tx: center.x,
              ty: center.y,
              so: paintInfo.so,
              to: vect1,
            },
            this,
          );
          twoSegments(
            {
              sx: center.x,
              sy: center.y,
              tx: paintInfo.tx,
              ty: paintInfo.ty,
              so: vect2,
              to: paintInfo.to,
            },
            this,
          );
        }
      }
    };
  };

  jsPlumbUtil.extend(TucTwoSegments, jsPlumb.Connectors.AbstractConnector);
  jsPlumb.Connectors.TucTwoSegments = TucTwoSegments;
};
/* eslint-enable */

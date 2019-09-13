/*
 * noVNC: HTML5 VNC client
 * Copyright (C) 2012 Joel Martin
 * Licensed under MPL 2.0 (see LICENSE.txt)
 *
 * See README.md for usage and integration instructions.
 */

/* jslint browser: true, white: false, bitwise: false */
/* global Util, Base64, changeCursor */

function Display(defaults) {
  const that = {};
  // Public API methods

  const conf = {};
  // Configuration attributes

  // Private Display namespace variables

  let c_ctx = null;


  const c_forceCanvas = false;


  // Queued drawing actions for in-order rendering

  let renderQ = [];


  // Predefine function variables (jslint)

  let imageDataGet; let rgbImageData; let bgrxImageData; let cmapImageData;


  let setFillColor; let rescale; let scan_renderQ;


  // The full frame buffer (logical canvas) size

  let fb_width = 0;


  let fb_height = 0;

  // The visible "physical canvas" viewport

  const viewport = {
    x: 0, y: 0, w: 0, h: 0,
  };


  let cleanRect = {
    x1: 0, y1: 0, x2: -1, y2: -1,
  };


  let c_prevStyle = '';


  let tile = null;


  let tile16x16 = null;


  let tile_x = 0;


  let tile_y = 0;


  // Configuration attributes
  Util.conf_defaults(conf, that, defaults, [
    ['target', 'wo', 'dom', null, 'Canvas element for rendering'],
    ['context', 'ro', 'raw', null, 'Canvas 2D context for rendering (read-only)'],
    ['logo', 'rw', 'raw', null, 'Logo to display when cleared: {"width": width, "height": height, "data": data}'],
    ['true_color', 'rw', 'bool', true, 'Use true-color pixel data'],
    ['colourMap', 'rw', 'arr', [], 'Colour map array (when not true-color)'],
    ['scale', 'rw', 'float', 1.0, 'Display area scale factor 0.0 - 1.0'],
    ['viewport', 'rw', 'bool', false, 'Use a viewport set with viewportChange()'],
    ['width', 'rw', 'int', null, 'Display area width'],
    ['height', 'rw', 'int', null, 'Display area height'],

    ['render_mode', 'ro', 'str', '', 'Canvas rendering mode (read-only)'],

    ['prefer_js', 'rw', 'str', null, 'Prefer Javascript over canvas methods'],
    ['cursor_uri', 'rw', 'raw', null, 'Can we render cursor using data URI'],
  ]);

  // Override some specific getters/setters
  that.get_context = function () { return c_ctx; };

  that.set_scale = function (scale) { rescale(scale); };

  that.set_width = function (val) { that.resize(val, fb_height); };
  that.get_width = function () { return fb_width; };

  that.set_height = function (val) { that.resize(fb_width, val); };
  that.get_height = function () { return fb_height; };


  //
  // Private functions
  //

  // Create the public API interface
  function constructor() {
    Util.Debug('>> Display.constructor');

    let c; let func; let i; let curDat; let curSave;


    const has_imageData = false; const
      UE = Util.Engine;

    if (!conf.target) { throw ('target must be set'); }

    if (typeof conf.target === 'string') {
      throw ('target must be a DOM element');
    }

    c = conf.target;

    if (!c.getContext) { throw ('no getContext method'); }

    if (!c_ctx) { c_ctx = c.getContext('2d'); }

    Util.Debug(`User Agent: ${navigator.userAgent}`);
    if (UE.gecko) { Util.Debug(`Browser: gecko ${UE.gecko}`); }
    if (UE.webkit) { Util.Debug(`Browser: webkit ${UE.webkit}`); }
    if (UE.trident) { Util.Debug(`Browser: trident ${UE.trident}`); }
    if (UE.presto) { Util.Debug(`Browser: presto ${UE.presto}`); }

    that.clear();

    // Check canvas features
    if ('createImageData' in c_ctx) {
      conf.render_mode = 'canvas rendering';
    } else {
      throw ('Canvas does not support createImageData');
    }
    if (conf.prefer_js === null) {
      Util.Info('Prefering javascript operations');
      conf.prefer_js = true;
    }

    // Initialize cached tile imageData
    tile16x16 = c_ctx.createImageData(16, 16);

    /*
     * Determine browser support for setting the cursor via data URI
     * scheme
     */
    curDat = [];
    for (i = 0; i < 8 * 8 * 4; i += 1) {
      curDat.push(255);
    }
    try {
      curSave = c.style.cursor;
      changeCursor(conf.target, curDat, curDat, 2, 2, 8, 8);
      if (c.style.cursor) {
        if (conf.cursor_uri === null) {
          conf.cursor_uri = true;
        }
        Util.Info('Data URI scheme cursor supported');
      } else {
        if (conf.cursor_uri === null) {
          conf.cursor_uri = false;
        }
        Util.Warn('Data URI scheme cursor not supported');
      }
      c.style.cursor = curSave;
    } catch (exc2) {
      Util.Error(`Data URI scheme cursor test exception: ${exc2}`);
      conf.cursor_uri = false;
    }

    Util.Debug('<< Display.constructor');
    return that;
  }

  rescale = function (factor) {
    let c; let tp; let x; let y;


    const properties = ['transform', 'WebkitTransform', 'MozTransform', null];
    c = conf.target;
    tp = properties.shift();
    while (tp) {
      if (typeof c.style[tp] !== 'undefined') {
        break;
      }
      tp = properties.shift();
    }

    if (tp === null) {
      Util.Debug('No scaling support');
      return;
    }


    if (typeof (factor) === 'undefined') {
      factor = conf.scale;
    } else if (factor > 1.0) {
      factor = 1.0;
    } else if (factor < 0.1) {
      factor = 0.1;
    }

    if (conf.scale === factor) {
      // Util.Debug("Display already scaled to '" + factor + "'");
      return;
    }

    conf.scale = factor;
    x = c.width - c.width * factor;
    y = c.height - c.height * factor;
    c.style[tp] = `scale(${conf.scale}) translate(-${x}px, -${y}px)`;
  };

  setFillColor = function (color) {
    let bgr; let
      newStyle;
    if (conf.true_color) {
      bgr = color;
    } else {
      bgr = conf.colourMap[color[0]];
    }
    newStyle = `rgb(${bgr[2]},${bgr[1]},${bgr[0]})`;
    if (newStyle !== c_prevStyle) {
      c_ctx.fillStyle = newStyle;
      c_prevStyle = newStyle;
    }
  };


  //
  // Public API interface functions
  //

  // Shift and/or resize the visible viewport
  that.viewportChange = function (deltaX, deltaY, width, height) {
    const c = conf.target; const v = viewport; const cr = cleanRect;


    let saveImg = null; let saveStyle; let x1; let y1; let vx2; let vy2; let w; let
      h;

    if (!conf.viewport) {
      Util.Debug('Setting viewport to full display region');
      deltaX = -v.w; // Clamped later if out of bounds
      deltaY = -v.h; // Clamped later if out of bounds
      width = fb_width;
      height = fb_height;
    }

    if (typeof (deltaX) === 'undefined') { deltaX = 0; }
    if (typeof (deltaY) === 'undefined') { deltaY = 0; }
    if (typeof (width) === 'undefined') { width = v.w; }
    if (typeof (height) === 'undefined') { height = v.h; }

    // Size change

    if (width > fb_width) { width = fb_width; }
    if (height > fb_height) { height = fb_height; }

    if ((v.w !== width) || (v.h !== height)) {
      // Change width
      if ((width < v.w) && (cr.x2 > v.x + width - 1)) {
        cr.x2 = v.x + width - 1;
      }
      v.w = width;

      // Change height
      if ((height < v.h) && (cr.y2 > v.y + height - 1)) {
        cr.y2 = v.y + height - 1;
      }
      v.h = height;


      if (v.w > 0 && v.h > 0 && c.width > 0 && c.height > 0) {
        saveImg = c_ctx.getImageData(0, 0,
          (c.width < v.w) ? c.width : v.w,
          (c.height < v.h) ? c.height : v.h);
      }

      c.width = v.w;
      c.height = v.h;

      if (saveImg) {
        c_ctx.putImageData(saveImg, 0, 0);
      }
    }

    vx2 = v.x + v.w - 1;
    vy2 = v.y + v.h - 1;


    // Position change

    if ((deltaX < 0) && ((v.x + deltaX) < 0)) {
      deltaX = -v.x;
    }
    if ((vx2 + deltaX) >= fb_width) {
      deltaX -= ((vx2 + deltaX) - fb_width + 1);
    }

    if ((v.y + deltaY) < 0) {
      deltaY = -v.y;
    }
    if ((vy2 + deltaY) >= fb_height) {
      deltaY -= ((vy2 + deltaY) - fb_height + 1);
    }

    if ((deltaX === 0) && (deltaY === 0)) {
      // Util.Debug("skipping viewport change");
      return;
    }
    Util.Debug(`viewportChange deltaX: ${deltaX}, deltaY: ${deltaY}`);

    v.x += deltaX;
    vx2 += deltaX;
    v.y += deltaY;
    vy2 += deltaY;

    // Update the clean rectangle
    if (v.x > cr.x1) {
      cr.x1 = v.x;
    }
    if (vx2 < cr.x2) {
      cr.x2 = vx2;
    }
    if (v.y > cr.y1) {
      cr.y1 = v.y;
    }
    if (vy2 < cr.y2) {
      cr.y2 = vy2;
    }

    if (deltaX < 0) {
      // Shift viewport left, redraw left section
      x1 = 0;
      w = -deltaX;
    } else {
      // Shift viewport right, redraw right section
      x1 = v.w - deltaX;
      w = deltaX;
    }
    if (deltaY < 0) {
      // Shift viewport up, redraw top section
      y1 = 0;
      h = -deltaY;
    } else {
      // Shift viewport down, redraw bottom section
      y1 = v.h - deltaY;
      h = deltaY;
    }

    // Copy the valid part of the viewport to the shifted location
    saveStyle = c_ctx.fillStyle;
    c_ctx.fillStyle = 'rgb(255,255,255)';
    if (deltaX !== 0) {
      // that.copyImage(0, 0, -deltaX, 0, v.w, v.h);
      // that.fillRect(x1, 0, w, v.h, [255,255,255]);
      c_ctx.drawImage(c, 0, 0, v.w, v.h, -deltaX, 0, v.w, v.h);
      c_ctx.fillRect(x1, 0, w, v.h);
    }
    if (deltaY !== 0) {
      // that.copyImage(0, 0, 0, -deltaY, v.w, v.h);
      // that.fillRect(0, y1, v.w, h, [255,255,255]);
      c_ctx.drawImage(c, 0, 0, v.w, v.h, 0, -deltaY, v.w, v.h);
      c_ctx.fillRect(0, y1, v.w, h);
    }
    c_ctx.fillStyle = saveStyle;
  };


  // Return a map of clean and dirty areas of the viewport and reset the
  // tracking of clean and dirty areas.
  //
  // Returns: {'cleanBox':   {'x': x, 'y': y, 'w': w, 'h': h},
  //           'dirtyBoxes': [{'x': x, 'y': y, 'w': w, 'h': h}, ...]}
  that.getCleanDirtyReset = function () {
    const v = viewport; const c = cleanRect; let cleanBox; const dirtyBoxes = [];


    const vx2 = v.x + v.w - 1; const
      vy2 = v.y + v.h - 1;


    // Copy the cleanRect
    cleanBox = {
      x: c.x1,
      y: c.y1,
      w: c.x2 - c.x1 + 1,
      h: c.y2 - c.y1 + 1,
    };

    if ((c.x1 >= c.x2) || (c.y1 >= c.y2)) {
      // Whole viewport is dirty
      dirtyBoxes.push({
        x: v.x, y: v.y, w: v.w, h: v.h,
      });
    } else {
      // Redraw dirty regions
      if (v.x < c.x1) {
        // left side dirty region
        dirtyBoxes.push({
          x: v.x,
          y: v.y,
          w: c.x1 - v.x + 1,
          h: v.h,
        });
      }
      if (vx2 > c.x2) {
        // right side dirty region
        dirtyBoxes.push({
          x: c.x2 + 1,
          y: v.y,
          w: vx2 - c.x2,
          h: v.h,
        });
      }
      if (v.y < c.y1) {
        // top/middle dirty region
        dirtyBoxes.push({
          x: c.x1,
          y: v.y,
          w: c.x2 - c.x1 + 1,
          h: c.y1 - v.y,
        });
      }
      if (vy2 > c.y2) {
        // bottom/middle dirty region
        dirtyBoxes.push({
          x: c.x1,
          y: c.y2 + 1,
          w: c.x2 - c.x1 + 1,
          h: vy2 - c.y2,
        });
      }
    }

    // Reset the cleanRect to the whole viewport
    cleanRect = {
      x1: v.x,
      y1: v.y,
      x2: v.x + v.w - 1,
      y2: v.y + v.h - 1,
    };

    return { cleanBox, dirtyBoxes };
  };

  // Translate viewport coordinates to absolute coordinates
  that.absX = function (x) {
    return x + viewport.x;
  };
  that.absY = function (y) {
    return y + viewport.y;
  };


  that.resize = function (width, height) {
    c_prevStyle = '';

    fb_width = width;
    fb_height = height;

    rescale(conf.scale);
    that.viewportChange();
  };

  that.clear = function () {
    if (conf.logo) {
      that.resize(conf.logo.width, conf.logo.height);
      that.blitStringImage(conf.logo.data, 0, 0);
    } else {
      that.resize(640, 20);
      c_ctx.clearRect(0, 0, viewport.w, viewport.h);
    }

    renderQ = [];

    // No benefit over default ("source-over") in Chrome and firefox
    // c_ctx.globalCompositeOperation = "copy";
  };

  that.fillRect = function (x, y, width, height, color) {
    setFillColor(color);
    c_ctx.fillRect(x - viewport.x, y - viewport.y, width, height);
  };

  that.copyImage = function (old_x, old_y, new_x, new_y, w, h) {
    const x1 = old_x - viewport.x; const y1 = old_y - viewport.y;


    const x2 = new_x - viewport.x; const
      y2 = new_y - viewport.y;
    c_ctx.drawImage(conf.target, x1, y1, w, h, x2, y2, w, h);
  };


  // Start updating a tile
  that.startTile = function (x, y, width, height, color) {
    let data; let bgr; let red; let green; let blue; let
      i;
    tile_x = x;
    tile_y = y;
    if ((width === 16) && (height === 16)) {
      tile = tile16x16;
    } else {
      tile = c_ctx.createImageData(width, height);
    }
    data = tile.data;
    if (conf.prefer_js) {
      if (conf.true_color) {
        bgr = color;
      } else {
        bgr = conf.colourMap[color[0]];
      }
      red = bgr[2];
      green = bgr[1];
      blue = bgr[0];
      for (i = 0; i < (width * height * 4); i += 4) {
        data[i] = red;
        data[i + 1] = green;
        data[i + 2] = blue;
        data[i + 3] = 255;
      }
    } else {
      that.fillRect(x, y, width, height, color);
    }
  };

  // Update sub-rectangle of the current tile
  that.subTile = function (x, y, w, h, color) {
    let data; let p; let bgr; let red; let green; let blue; let width; let j; let i; let xend; let
      yend;
    if (conf.prefer_js) {
      data = tile.data;
      width = tile.width;
      if (conf.true_color) {
        bgr = color;
      } else {
        bgr = conf.colourMap[color[0]];
      }
      red = bgr[2];
      green = bgr[1];
      blue = bgr[0];
      xend = x + w;
      yend = y + h;
      for (j = y; j < yend; j += 1) {
        for (i = x; i < xend; i += 1) {
          p = (i + (j * width)) * 4;
          data[p] = red;
          data[p + 1] = green;
          data[p + 2] = blue;
          data[p + 3] = 255;
        }
      }
    } else {
      that.fillRect(tile_x + x, tile_y + y, w, h, color);
    }
  };

  // Draw the current tile to the screen
  that.finishTile = function () {
    if (conf.prefer_js) {
      c_ctx.putImageData(tile, tile_x - viewport.x, tile_y - viewport.y);
    }
    // else: No-op, if not prefer_js then already done by setSubTile
  };

  rgbImageData = function (x, y, vx, vy, width, height, arr, offset) {
    let img; let i; let j; let
      data;
    /*
    if ((x - v.x >= v.w) || (y - v.y >= v.h) ||
        (x - v.x + width < 0) || (y - v.y + height < 0)) {
        // Skipping because outside of viewport
        return;
    }
    */
    img = c_ctx.createImageData(width, height);
    data = img.data;
    for (i = 0, j = offset; i < (width * height * 4); i += 4, j += 3) {
      data[i] = arr[j];
      data[i + 1] = arr[j + 1];
      data[i + 2] = arr[j + 2];
      data[i + 3] = 255; // Set Alpha
    }
    c_ctx.putImageData(img, x - vx, y - vy);
  };

  bgrxImageData = function (x, y, vx, vy, width, height, arr, offset) {
    let img; let i; let j; let
      data;
    /*
    if ((x - v.x >= v.w) || (y - v.y >= v.h) ||
        (x - v.x + width < 0) || (y - v.y + height < 0)) {
        // Skipping because outside of viewport
        return;
    }
    */
    img = c_ctx.createImageData(width, height);
    data = img.data;
    for (i = 0, j = offset; i < (width * height * 4); i += 4, j += 4) {
      data[i] = arr[j + 2];
      data[i + 1] = arr[j + 1];
      data[i + 2] = arr[j];
      data[i + 3] = 255; // Set Alpha
    }
    c_ctx.putImageData(img, x - vx, y - vy);
  };

  cmapImageData = function (x, y, vx, vy, width, height, arr, offset) {
    let img; let i; let j; let data; let bgr; let
      cmap;
    img = c_ctx.createImageData(width, height);
    data = img.data;
    cmap = conf.colourMap;
    for (i = 0, j = offset; i < (width * height * 4); i += 4, j += 1) {
      bgr = cmap[arr[j]];
      data[i] = bgr[2];
      data[i + 1] = bgr[1];
      data[i + 2] = bgr[0];
      data[i + 3] = 255; // Set Alpha
    }
    c_ctx.putImageData(img, x - vx, y - vy);
  };

  that.blitImage = function (x, y, width, height, arr, offset) {
    if (conf.true_color) {
      bgrxImageData(x, y, viewport.x, viewport.y, width, height, arr, offset);
    } else {
      cmapImageData(x, y, viewport.x, viewport.y, width, height, arr, offset);
    }
  };

  that.blitRgbImage = function (x, y, width, height, arr, offset) {
    if (conf.true_color) {
      rgbImageData(x, y, viewport.x, viewport.y, width, height, arr, offset);
    } else {
      // prolly wrong...
      cmapImageData(x, y, viewport.x, viewport.y, width, height, arr, offset);
    }
  };

  that.blitStringImage = function (str, x, y) {
    const img = new Image();
    img.onload = function () {
      c_ctx.drawImage(img, x - viewport.x, y - viewport.y);
    };
    img.src = str;
  };

  // Wrap ctx.drawImage but relative to viewport
  that.drawImage = function (img, x, y) {
    c_ctx.drawImage(img, x - viewport.x, y - viewport.y);
  };

  that.renderQ_push = function (action) {
    renderQ.push(action);
    if (renderQ.length === 1) {
      // If this can be rendered immediately it will be, otherwise
      // the scanner will start polling the queue (every
      // requestAnimationFrame interval)
      scan_renderQ();
    }
  };

  scan_renderQ = function () {
    let a; let
      ready = true;
    while (ready && renderQ.length > 0) {
      a = renderQ[0];
      switch (a.type) {
        case 'copy':
          that.copyImage(a.old_x, a.old_y, a.x, a.y, a.width, a.height);
          break;
        case 'fill':
          that.fillRect(a.x, a.y, a.width, a.height, a.color);
          break;
        case 'blit':
          that.blitImage(a.x, a.y, a.width, a.height, a.data, 0);
          break;
        case 'blitRgb':
          that.blitRgbImage(a.x, a.y, a.width, a.height, a.data, 0);
          break;
        case 'img':
          if (a.img.complete) {
            that.drawImage(a.img, a.x, a.y);
          } else {
            // We need to wait for this image to 'load'
            // to keep things in-order
            ready = false;
          }
          break;
      }
      if (ready) {
        a = renderQ.shift();
      }
    }
    if (renderQ.length > 0) {
      requestAnimFrame(scan_renderQ);
    }
  };


  that.changeCursor = function (pixels, mask, hotx, hoty, w, h) {
    if (conf.cursor_uri === false) {
      Util.Warn('changeCursor called but no cursor data URI support');
      return;
    }

    if (conf.true_color) {
      changeCursor(conf.target, pixels, mask, hotx, hoty, w, h);
    } else {
      changeCursor(conf.target, pixels, mask, hotx, hoty, w, h, conf.colourMap);
    }
  };

  that.defaultCursor = function () {
    conf.target.style.cursor = 'default';
  };

  return constructor(); // Return the public API interface
} // End of Display()


/* Set CSS cursor property using data URI encoded cursor file */
function changeCursor(target, pixels, mask, hotx, hoty, w0, h0, cmap) {
  const cur = []; let rgb; let IHDRsz; let RGBsz; let ANDsz; let XORsz; let url; let idx; let alpha; let x; let
    y;
  // Util.Debug(">> changeCursor, x: " + hotx + ", y: " + hoty + ", w0: " + w0 + ", h0: " + h0);

  let w = w0;
  let h = h0;
  if (h < w) h = w; // increase h to make it square
  else w = h; // increace w to make it square

  // Push multi-byte little-endian values
  cur.push16le = function (num) {
    this.push((num) & 0xFF,
      (num >> 8) & 0xFF);
  };
  cur.push32le = function (num) {
    this.push((num) & 0xFF,
      (num >> 8) & 0xFF,
      (num >> 16) & 0xFF,
      (num >> 24) & 0xFF);
  };

  IHDRsz = 40;
  RGBsz = w * h * 4;
  XORsz = Math.ceil((w * h) / 8.0);
  ANDsz = Math.ceil((w * h) / 8.0);

  // Main header
  cur.push16le(0); // 0: Reserved
  cur.push16le(2); // 2: .CUR type
  cur.push16le(1); // 4: Number of images, 1 for non-animated ico

  // Cursor #1 header (ICONDIRENTRY)
  cur.push(w); // 6: width
  cur.push(h); // 7: height
  cur.push(0); // 8: colors, 0 -> true-color
  cur.push(0); // 9: reserved
  cur.push16le(hotx); // 10: hotspot x coordinate
  cur.push16le(hoty); // 12: hotspot y coordinate
  cur.push32le(IHDRsz + RGBsz + XORsz + ANDsz);
  // 14: cursor data byte size
  cur.push32le(22); // 18: offset of cursor data in the file


  // Cursor #1 InfoHeader (ICONIMAGE/BITMAPINFO)
  cur.push32le(IHDRsz); // 22: Infoheader size
  cur.push32le(w); // 26: Cursor width
  cur.push32le(h * 2); // 30: XOR+AND height
  cur.push16le(1); // 34: number of planes
  cur.push16le(32); // 36: bits per pixel
  cur.push32le(0); // 38: Type of compression

  cur.push32le(XORsz + ANDsz); // 43: Size of Image
  // Gimp leaves this as 0

  cur.push32le(0); // 46: reserved
  cur.push32le(0); // 50: reserved
  cur.push32le(0); // 54: reserved
  cur.push32le(0); // 58: reserved

  // 62: color data (RGBQUAD icColors[])
  for (y = h - 1; y >= 0; y -= 1) {
    for (x = 0; x < w; x += 1) {
      if (x >= w0 || y >= h0) {
        cur.push(0); // blue
        cur.push(0); // green
        cur.push(0); // red
        cur.push(0); // alpha
      } else {
        idx = y * Math.ceil(w0 / 8) + Math.floor(x / 8);
        alpha = (mask[idx] << (x % 8)) & 0x80 ? 255 : 0;
        if (cmap) {
          idx = (w0 * y) + x;
          rgb = cmap[pixels[idx]];
          cur.push(rgb[2]); // blue
          cur.push(rgb[1]); // green
          cur.push(rgb[0]); // red
          cur.push(alpha); // alpha
        } else {
          idx = ((w0 * y) + x) * 4;
          cur.push(pixels[idx + 2]); // blue
          cur.push(pixels[idx + 1]); // green
          cur.push(pixels[idx]); // red
          cur.push(alpha); // alpha
        }
      }
    }
  }

  // XOR/bitmask data (BYTE icXOR[])
  // (ignored, just needs to be right size)
  for (y = 0; y < h; y += 1) {
    for (x = 0; x < Math.ceil(w / 8); x += 1) {
      cur.push(0x00);
    }
  }

  // AND/bitmask data (BYTE icAND[])
  // (ignored, just needs to be right size)
  for (y = 0; y < h; y += 1) {
    for (x = 0; x < Math.ceil(w / 8); x += 1) {
      cur.push(0x00);
    }
  }

  url = `data:image/x-icon;base64,${Base64.encode(cur)}`;
  target.style.cursor = `url(${url}) ${hotx} ${hoty}, default`;
  // Util.Debug("<< changeCursor, cur.length: " + cur.length);
}

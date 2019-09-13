/*
 * noVNC: HTML5 VNC client
 * Copyright (C) 2012 Joel Martin
 * Licensed under MPL 2.0 (see LICENSE.txt)
 */


/* jslint browser: true, white: false */
/* global Util, VNC_frame_data, finish */

let rfb; let mode; let test_state; let frame_idx; let frame_length;


let iteration; let iterations; let istart_time;


// Pre-declarations for jslint

let send_array; let next_iteration; let queue_next_packet; let
  do_packet;

// Override send_array
send_array = function (arr) {
  // Stub out send_array
};

next_iteration = function () {
  if (iteration === 0) {
    frame_length = VNC_frame_data.length;
    test_state = 'running';
  } else {
    rfb.disconnect();
  }

  if (test_state !== 'running') { return; }

  iteration += 1;
  if (iteration > iterations) {
    finish();
    return;
  }

  frame_idx = 0;
  istart_time = (new Date()).getTime();
  rfb.connect('test', 0, 'bogus');

  queue_next_packet();
};

queue_next_packet = function () {
  let frame; let foffset; let toffset; let
    delay;
  if (test_state !== 'running') { return; }

  frame = VNC_frame_data[frame_idx];
  while ((frame_idx < frame_length) && (frame.charAt(0) === '}')) {
    // Util.Debug("Send frame " + frame_idx);
    frame_idx += 1;
    frame = VNC_frame_data[frame_idx];
  }

  if (frame === 'EOF') {
    Util.Debug('Finished, found EOF');
    next_iteration();
    return;
  }
  if (frame_idx >= frame_length) {
    Util.Debug('Finished, no more frames');
    next_iteration();
    return;
  }

  if (mode === 'realtime') {
    foffset = frame.slice(1, frame.indexOf('{', 1));
    toffset = (new Date()).getTime() - istart_time;
    delay = foffset - toffset;
    if (delay < 1) {
      delay = 1;
    }

    setTimeout(do_packet, delay);
  } else {
    setTimeout(do_packet, 1);
  }
};

let bytes_processed = 0;

do_packet = function () {
  // Util.Debug("Processing frame: " + frame_idx);
  const frame = VNC_frame_data[frame_idx];


  const start = frame.indexOf('{', 1) + 1;
  bytes_processed += frame.length - start;
  if (VNC_frame_encoding === 'binary') {
    const u8 = new Uint8Array(frame.length - start);
    for (let i = 0; i < frame.length - start; i++) {
      u8[i] = frame.charCodeAt(start + i);
    }
    rfb.recv_message({ data: u8 });
  } else {
    rfb.recv_message({ data: frame.slice(start) });
  }
  frame_idx += 1;

  queue_next_packet();
};

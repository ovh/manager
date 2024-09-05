import React from 'react';
import { TextEncoder, TextDecoder } from 'util';
import { Blob, File } from 'buffer';

import 'element-internals-polyfill';

Object.assign(global, {
  TextDecoder,
  TextEncoder,
  React,
});

// eslint-disable-next-line
const { fetch, Headers, FormData, Request, Response } = require('undici');

Object.assign(global, {
  fetch,
  Blob,
  File,
  Headers,
  FormData,
  Request,
  Response,
});

import { TextEncoder, TextDecoder } from 'util';
import { Blob, File } from 'buffer';
import React from 'react';

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

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (translationKey: string) => translationKey,
    i18n: {
      changeLanguage: () => new Promise(() => {}),
      exists: () => true,
    },
  }),
}));

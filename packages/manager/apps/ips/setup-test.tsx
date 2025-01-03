import { beforeAll, afterAll } from 'vitest';
import 'element-internals-polyfill';

beforeAll(() => {
  global.__VERSION__ = null;
});

afterAll(() => {
  delete global.__VERSION__;
});

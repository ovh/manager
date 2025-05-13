#!/usr/bin/env node
const { Codename, Sample } = require('@ovh-ux/codename-generator');

const seed = process.argv[2];
const codename = new Codename(Sample, seed || '')
  .encode()
  .toLowerCase()
  .trim()
  .replace(' ', '-');

console.log(codename);

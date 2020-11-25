import fs from 'fs';
import path from 'path';
import { config as loadDotenvConfig } from 'dotenv';

// dotenv
loadDotenvConfig();

// input file
let dataset = {};
const inputFilePath = path.resolve(__dirname, 'input.json');
if (fs.existsSync(inputFilePath)) {
  // eslint-disable-next-line import/no-dynamic-require, global-require
  const inputFile = require(inputFilePath) || {};
  dataset = inputFile.dataset || inputFile;
}

export default {
  environment: process.env.NODE_ENV || 'development',
  baseUrl:
    dataset.BASE_URL || process.env.BASE_URL || 'https://www.ovh.com/manager',
  apiv6Url:
    dataset.APIV6_URL ||
    process.env.APIV6_URL ||
    'https://www.ovh.com/engine/apiv6',
  service: dataset.SERVICE || process.env.SERVICE,
  auth: {
    url: dataset.AUTH_URL || process.env.AUTH_URL || 'https://www.ovh.com/auth',
    userNic: process.env.USER_NIC || '',
    userPass: process.env.USER_PASS || '',
  },
  dataset,
};

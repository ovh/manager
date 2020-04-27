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
    process.env.BASE_URL || dataset.BASE_URL || 'https://www.ovh.com/manager',
  apiv6Url:
    process.env.APIV6_URL ||
    dataset.APIV6_URL ||
    'https://www.ovh.com/engine/apiv6',
  service: process.env.SERVICE,
  allowedServices: (services) => {
    // return the service name if inside the array, otherwise the first
    const allowedServices = [...services];
    return ~allowedServices.indexOf(process.env.SERVICE)
      ? process.env.SERVICE
      : allowedServices[0];
  },
  auth: {
    url: process.env.AUTH_URL || dataset.AUTH_URL || 'https://www.ovh.com/auth',
    userNic: process.env.USER_NIC || '',
    userPass: process.env.USER_PASS || '',
  },
  dataset,
};

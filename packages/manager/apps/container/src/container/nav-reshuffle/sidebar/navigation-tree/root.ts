import { Node } from './node';
import bareMetalCloud from './services/bareMetalCloud';
import hostedPrivateCloud from './services/hostedPrivateCloud';
import network from './services/network';
import publicCloud from './services/publicCloud';
import sunrise from './services/sunrise';
import telecom from './services/telecom';
import webCloud from './services/webCloud';
import securityIdentityOperation from './services/securityIdentityOperation';

const root: Node = {
  id: 'home',
  translation: 'sidebar_home',
  count: false,
  routing: {
    application: 'hub',
    hash: '#/',
  },
  children: [
    bareMetalCloud,
    hostedPrivateCloud,
    network,
    publicCloud,
    sunrise,
    securityIdentityOperation,
    telecom,
    webCloud,
  ],
};

export default root;

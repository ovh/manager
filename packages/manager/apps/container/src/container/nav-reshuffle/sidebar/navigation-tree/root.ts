import { Node } from './node';
import bareMetalCloud from './services/bareMetalCloud';
import hostedPrivateCloud from './services/hostedPrivateCloud';
import network from './services/network';
import publicCloud from './services/publicCloud';
import sunrise from './services/sunrise';
import telecom from './services/telecom';
import webCloud from './services/webCloud';
import securityIdentityOperation from './services/securityIdentityOperation';
import { assistanceTree } from './assistance';

const root: Node = {
  id: 'home',
  count: false,
  routing: {
    application: 'hub',
    hash: '#/',
  },
  children: [
    {
      id: 'sidebar',
      translation: 'sidebar_home',
      count: false,
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
    },
    assistanceTree,
  ],
};

export default root;

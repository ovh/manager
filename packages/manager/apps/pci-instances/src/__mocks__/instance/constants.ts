import { TInstance } from '@/data/hooks/instance/useInstances';

export const mockedInstance: TInstance = {
  id: '12345',
  name: 'foo',
  flavorId: '678910',
  flavorName: 'b2-8',
  imageId: '11121314',
  imageName: 'linux',
  region: 'BHS',
  status: { severity: 'success', state: 'ACTIVE' },
  addresses: new Map([
    ['private', [{ ip: '123.000.00', version: 1, gatewayIp: '' }]],
    ['public', [{ ip: '777.000.00', version: 2, gatewayIp: '' }]],
  ]),
};

export const mockedInstanceWithEmptyRegion: TInstance = {
  ...mockedInstance,
  region: '',
};

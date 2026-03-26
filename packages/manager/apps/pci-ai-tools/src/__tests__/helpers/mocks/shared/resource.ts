import ai from '@/types/AI';

export const mockedCPUResources: ai.Resources = {
  cpu: 1,
  ephemeralStorage: 1,
  flavor: 'ai1-1-cpu',
  flavorCount: 1,
  memory: 1,
  gpu: 0,
  privateNetwork: 1,
  publicNetwork: 1,
};

export const mockedGPUResources: ai.Resources = {
  cpu: 12,
  ephemeralStorage: 1,
  flavor: 'ai1-1-gpu',
  flavorCount: 1,
  gpu: 1,
  gpuBrand: 'ovhclud',
  gpuMemory: 15,
  gpuModel: 'nvidia',
  memory: 10,
  privateNetwork: 10,
  publicNetwork: 10,
};

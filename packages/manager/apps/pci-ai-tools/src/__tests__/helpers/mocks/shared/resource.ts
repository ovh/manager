import ai from '@/types/AI';

export const mockedCPUResources: ai.Resources = {
  cpu: 1,
  ephemeralStorage: 1,
  flavor: 'ai1-1-cpu',
  memory: 1,
  gpu: 0,
  privateNetwork: 1,
  publicNetwork: 1,
};

export const mockedGPUResources: ai.Resources = {
  cpu: 12,
  ephemeralStorage: 1,
  flavor: 'ai1-1-gpu',
  gpu: 1,
  gpuBrand: 'ovhclud',
  gpuMemory: 15,
  gpuModel: 'nvidia',
  memory: 10,
  privateNetwork: 10,
  publicNetwork: 10,
};

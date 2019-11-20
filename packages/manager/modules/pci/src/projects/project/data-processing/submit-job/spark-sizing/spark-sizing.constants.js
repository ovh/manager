export const DRIVER_TEMPLATES = [
  {
    id: 1,
    cores: 4,
    memory: 15000000000,
  },
  {
    id: 2,
    cores: 8,
    memory: 30000000000,
  },
  {
    id: 3,
    cores: 16,
    memory: 60000000000,
  },
];

export const WORKER_TEMPLATES = [
  {
    id: 1,
    cores: 4,
    memory: 15000000000,
  },
  {
    id: 2,
    cores: 8,
    memory: 30000000000,
  },
  {
    id: 3,
    cores: 16,
    memory: 60000000000,
  },
];

export const MEMORY_OVERHEAD_RATIO = 0.1;
export const MIN_MEMORY_OVERHEAD_MB = 384;

export default {
  DRIVER_TEMPLATES,
  WORKER_TEMPLATES,
};

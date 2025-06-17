import { TInstanceDetail } from '@/types/instance/entity.type';

export const placeholderInstanceDetail: TInstanceDetail = {
  id: '',
  name: '',
  flavorName: '',
  flavorRam: '',
  flavorCpu: '',
  storage: '',
  publicBandwidth: '',
  status: {
    label: 'ACTIVE',
    severity: 'success',
  },
  region: '',
  regionType: '',
  imageName: '',
  volumes: [],
  pendingTask: false,
  availabilityZone: '',
  actions: new Map(),
  prices: [],
  taskState: null,
  sshKey: '',
  sshLogin: '',
  isEditionEnabled: false,
  standaloneActions: [],
};

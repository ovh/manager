import { TInstanceDetail } from '@/types/instance/entity.type';

export const placeholderInstanceDetail: TInstanceDetail = {
  id: '',
  name: '',
  flavorName: '',
  flavorRam: '',
  flavorCpu: 'string',
  status: {
    label: 'ACTIVE',
    severity: 'success',
  },
  region: '',
  regionType: '',
  pendingTask: false,
  availabilityZone: '',
  prices: [],
  taskState: null,
  isEditionEnabled: false,
};

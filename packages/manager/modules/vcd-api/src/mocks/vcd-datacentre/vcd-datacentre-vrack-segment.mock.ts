import { VCDVrackSegment } from '../../types/vcd-vrack-segment.type';

export const mockVrackSegmentList: VCDVrackSegment[] = [
  {
    id: 'uuid-1',
    resourceStatus: 'ACTIVE',
    targetSpec: {
      vlanId: '420',
      type: 'MIGRATED',
      mode: 'TAGGED',
      networks: ['192.168.1.0/24', '10.0.1.0/24'],
    },
    currentState: {
      vlanId: '420',
      type: 'MIGRATED',
      mode: 'TAGGED',
      networks: ['192.168.1.0/24', '10.0.1.0/24'],
    },
    currentTasks: [],
  },
  {
    id: 'uuid-2',
    resourceStatus: 'PENDING',
    targetSpec: {
      vlanId: '421',
      type: 'DEFAULT',
      mode: 'TAGGED',
      networks: ['172.16.0.0/24', '10.0.2.0/24'],
    },
    currentState: {
      vlanId: '421',
      type: 'DEFAULT',
      mode: 'TAGGED',
      networks: ['172.16.0.0/24', '10.0.2.0/24'],
    },
    currentTasks: [],
  },
  {
    id: 'uuid-3',
    resourceStatus: 'ACTIVE',
    targetSpec: {
      vlanId: '422',
      type: 'DEFAULT',
      mode: 'TAGGED',
      networks: ['192.168.2.0/24', '10.0.3.0/24'],
    },
    currentState: {
      vlanId: '422',
      type: 'DEFAULT',
      mode: 'TAGGED',
      networks: ['192.168.2.0/24', '10.0.3.0/24'],
    },
    currentTasks: [],
  },
  {
    id: 'uuid-4',
    resourceStatus: 'FAILED',
    targetSpec: {
      vlanId: '423',
      type: 'DEFAULT',
      mode: 'TAGGED',
      networks: ['172.16.1.0/24', '10.0.4.0/24'],
    },
    currentState: {
      vlanId: '423',
      type: 'DEFAULT',
      mode: 'TAGGED',
      networks: ['172.16.1.0/24', '10.0.4.0/24'],
    },
    currentTasks: [],
  },
  {
    id: 'uuid-5',
    resourceStatus: 'ACTIVE',
    targetSpec: {
      vlanId: '424',
      type: 'DEFAULT',
      mode: 'TAGGED',
      networks: ['192.168.3.0/24', '10.0.5.0/24'],
    },
    currentState: {
      vlanId: '424',
      type: 'DEFAULT',
      mode: 'TAGGED',
      networks: ['192.168.3.0/24', '10.0.5.0/24'],
    },
    currentTasks: [],
  },
  {
    id: 'uuid-6',
    resourceStatus: 'PENDING',
    targetSpec: {
      vlanId: '425',
      type: 'MIGRATED',
      mode: 'TAGGED',
      networks: ['172.16.2.0/24', '10.0.6.0/24'],
    },
    currentState: {
      vlanId: '425',
      type: 'MIGRATED',
      mode: 'TAGGED',
      networks: ['172.16.2.0/24', '10.0.6.0/24'],
    },
    currentTasks: [],
  },
  {
    id: 'uuid-7',
    resourceStatus: 'ACTIVE',
    targetSpec: {
      vlanId: '426',
      type: 'MIGRATED',
      mode: 'TAGGED',
      networks: ['192.168.4.0/24', '10.0.7.0/24'],
    },
    currentState: {
      vlanId: '426',
      type: 'MIGRATED',
      mode: 'TAGGED',
      networks: ['192.168.4.0/24', '10.0.7.0/24'],
    },
    currentTasks: [],
  },
  {
    id: 'uuid-8',
    resourceStatus: 'FAILED',
    targetSpec: {
      vlanId: '427',
      type: 'MIGRATED',
      mode: 'TAGGED',
      networks: ['172.16.3.0/24', '10.0.8.0/24'],
    },
    currentState: {
      vlanId: '427',
      type: 'MIGRATED',
      mode: 'TAGGED',
      networks: ['172.16.3.0/24', '10.0.8.0/24'],
    },
    currentTasks: [],
  },
  {
    id: 'uuid-9',
    resourceStatus: 'ACTIVE',
    targetSpec: {
      vlanId: '428',
      type: 'DEFAULT',
      mode: 'UNTAGGED',
      networks: ['192.168.5.0/24', '10.0.9.0/24'],
    },
    currentState: {
      vlanId: '428',
      type: 'DEFAULT',
      mode: 'UNTAGGED',
      networks: ['192.168.5.0/24', '10.0.9.0/24'],
    },
    currentTasks: [],
  },
  {
    id: 'uuid-10',
    resourceStatus: 'PENDING',
    targetSpec: {
      vlanId: '429',
      type: 'MIGRATED',
      mode: 'TRUNK',
      networks: [],
    },
    currentState: {
      vlanId: '429',
      type: 'MIGRATED',
      mode: 'TRUNK',
      networks: [],
    },
    currentTasks: [],
  },
];

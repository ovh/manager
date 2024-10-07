import {
  CreateRancherPayload,
  RancherService,
  RancherTaskType,
  ResourceStatus,
} from '../src/types/api.type';

export const service = [
  {
    name: 'OVHCLOUD_EDITION',
    status: 'AVAILABLE',
  },
  {
    name: 'STANDARD',
    status: 'AVAILABLE',
  },
];

export const version = [
  {
    name: '2.7.6',
    status: 'UNAVAILABLE',
    cause: 'DEPRECATED',
    message:
      '(from msw) This Rancher version is deprecated, creations and updates to this version have been disabled.',
    changelogUrl: 'https://github.com/rancher/rancher/releases/tag/v2.7.6',
  },
  {
    name: '2.7.9',
    status: 'AVAILABLE',
    changelogUrl: 'https://github.com/rancher/rancher/releases/tag/v2.7.9',
  },
  {
    name: '2.8.2',
    status: 'AVAILABLE',
    changelogUrl: 'https://github.com/rancher/rancher/releases/tag/v2.8.2',
  },
  {
    name: '2.8.5',
    status: 'AVAILABLE',
    changelogUrl: 'https://github.com/rancher/rancher/releases/tag/v2.8.5',
  },
];

export const deleteRancher: RancherService = {
  id: '4c9040e8-b97b-4d24-8595-44eb2064ab8a',
  createdAt: '2024-10-03T13:59:21.946141Z',
  updatedAt: '2024-10-03T20:22:35.64413Z',
  resourceStatus: ResourceStatus.DELETING,
  targetSpec: {
    name: 'elranchito2',
    plan: 'OVHCLOUD_EDITION',
    version: '2.8.2',
    ipRestrictions: [],
  },
  currentState: {
    name: 'elranchito2',
    plan: 'OVHCLOUD_EDITION',
    region: 'EU_WEST_RBX',
    url: 'https://1i3kzy.p7mg.rancher.ovh.net',
    version: '2.8.2',
    ipRestrictions: [],
  },
  currentTasks: [
    {
      id: '3a3c3117-81c5-11ef-82e1-6289836149fb',
      type: RancherTaskType.RANCHER_DELETE,
    },
  ],
};

export const postRancherService = (
  data: CreateRancherPayload,
): RancherService => ({
  id: Math.random().toString(),
  createdAt: '2024-10-03T13:56:51.809966Z',
  updatedAt: '2024-10-03T13:56:51.809968Z',
  resourceStatus: ResourceStatus.CREATING,
  targetSpec: {
    name: data.name,
    plan: data.plan,
    version: data.version,
    ipRestrictions: [],
  },
  currentState: {
    url: '',
    name: data.name,
    plan: data.plan,
    region: 'EU_WEST_RBX',
    version: data.version,
    ipRestrictions: [],
  },
  currentTasks: [
    {
      id: '57762449-818f-11ef-82e1-6289836149fb',
      type: RancherTaskType.RANCHER_CREATE,
    },
  ],
});

export const getRanchers: RancherService[] = [
  {
    id: 'aaa1a850-2af8-4a91-9453-9e8cbc7c87e5',
    createdAt: '2024-10-03T13:56:51.809966Z',
    updatedAt: '2024-10-03T13:57:36.589669Z',
    resourceStatus: ResourceStatus.READY,
    targetSpec: {
      name: 'test (MSW)',
      plan: 'OVHCLOUD_EDITION',
      version: '2.8.5',
      ipRestrictions: [],
    },
    currentState: {
      name: 'test (MSW)',
      plan: 'OVHCLOUD_EDITION',
      region: 'EU_WEST_RBX',
      url: 'https://lj9ohz.p7mg.rancher.ovh.net',
      version: '2.8.5',
      ipRestrictions: [],
    },
    currentTasks: [],
  },
  {
    id: '4c9040e8-b97b-4d24-8595-44eb2064ab8a',
    createdAt: '2024-10-03T13:59:21.946141Z',
    updatedAt: '2024-10-03T13:59:21.946143Z',
    resourceStatus: ResourceStatus.READY,
    targetSpec: {
      name: 'El-Ranchito (MSW)',
      plan: 'OVHCLOUD_EDITION',
      version: '2.8.2',
      ipRestrictions: [],
    },
    currentState: {
      name: 'El-Ranchito (MSW)',
      plan: 'OVHCLOUD_EDITION',
      url: 'https://lj9ohz.p7mg.rancher.ovh.net',
      region: 'EU_WEST_RBX',
      version: '2.8.2',
      ipRestrictions: [],
    },
    currentTasks: [],
  },
];

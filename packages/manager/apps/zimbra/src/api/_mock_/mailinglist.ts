import { MailingListType } from '../mailinglist';
import { accountMock } from './account';

export const mailingListDetailMock: MailingListType = {
  checksum: 'string',
  currentState: {
    defaultReplyTo: 'string',
    email: 'test@mailinglist.com',
    language: 'string',
    members: ['191fa41e-46c0-4000-86f4-ce92e7b45e80'],
    moderationOption: 'string',
    organizationId: '191fa41e-46c0-4000-8a42-82cf2c709380',
    organizationLabel: 'testOrg',
    owner: accountMock[0],
  },
  currentTasks: [
    {
      id: '191fa41e-46c0-4000-8cdd-2fa1f5a6df01',
      link: 'string',
      status: 'ERROR',
      type: 'string',
    },
  ],
  id: '191fa41e-46c0-4000-8904-72ce6e738f80',
  resourceStatus: 'CREATING',
  targetSpec: {
    defaultReplyTo: 'string',
    email: 'test@mailinglist.com',
    language: 'string',
    members: ['191fa41e-46c0-4000-8d25-fca4a684e601'],
    moderationOption: 'string',
    organizationId: '191fa41e-46c0-4000-8ae1-ce5ad8165601',
    organizationLabel: 'testOrg',
    owner: accountMock[0],
  },
};

export const mailingListsMock: MailingListType[] = [
  mailingListDetailMock,
  {
    checksum: 'string',
    currentState: {
      defaultReplyTo: 'string',
      email: 'test2@mailinglist.com',
      language: 'string',
      members: ['191fa41e-46c0-4000-86f4-ce92e7b45e80'],
      moderationOption: 'string',
      organizationId: '191fa41e-46c0-4000-8a42-82cf2c709380',
      organizationLabel: 'testOrg2',
      owner: accountMock[0],
    },
    currentTasks: [
      {
        id: '191fa41e-46c0-4000-8cdd-2fa1f5a6df01',
        link: 'string',
        status: 'ERROR',
        type: 'string',
      },
    ],
    id: '191fa41e-46c0-4000-8904-72ce6e738f80',
    resourceStatus: 'CREATING',
    targetSpec: {
      defaultReplyTo: 'string',
      email: 'test2@mailinglist.com',
      language: 'string',
      members: ['191fa41e-46c0-4000-8d25-fca4a684e601'],
      moderationOption: 'string',
      organizationId: '191fa41e-46c0-4000-8ae1-ce5ad8165601',
      organizationLabel: 'testOrg2',
      owner: accountMock[0],
    },
  },
  {
    checksum: 'string',
    currentState: {
      defaultReplyTo: 'string',
      email: 'test3@mailinglist.com',
      language: 'string',
      members: ['191fa41e-46c0-4000-86f4-ce92e7b45e80'],
      moderationOption: 'string',
      organizationId: '191fa41e-46c0-4000-8a42-82cf2c709380',
      organizationLabel: 'testOrg3',
      owner: accountMock[0],
    },
    currentTasks: [
      {
        id: '191fa41e-46c0-4000-8cdd-2fa1f5a6df01',
        link: 'string',
        status: 'ERROR',
        type: 'string',
      },
    ],
    id: '191fa41e-46c0-4000-8904-72ce6e738f80',
    resourceStatus: 'CREATING',
    targetSpec: {
      defaultReplyTo: 'string',
      email: 'test3@mailinglist.com',
      language: 'string',
      members: ['191fa41e-46c0-4000-8d25-fca4a684e601'],
      moderationOption: 'string',
      organizationId: '191fa41e-46c0-4000-8ae1-ce5ad8165601',
      organizationLabel: 'testOrg3',
      owner: accountMock[0],
    },
  },
];

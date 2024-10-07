import { ResourceStatus } from '@/api/api.type';
import {
  MailingListType,
  ModerationChoices,
  ReplyToChoices,
} from '../mailinglist';

export const mailingListDetailMock: MailingListType = {
  checksum: 'string',
  currentState: {
    defaultReplyTo: ReplyToChoices.LIST,
    email: 'test@mailinglist.com',
    language: 'FR',
    members: ['191fa41e-46c0-4000-86f4-ce92e7b45e80'],
    moderationOption: ModerationChoices.ALL,
    organizationId: '191fa41e-46c0-4000-8a42-82cf2c709380',
    organizationLabel: 'testOrg',
    owner: '191fa41e-46c0-4000-8a42-82cf2c709370',
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
  resourceStatus: ResourceStatus.CREATING,
  targetSpec: {
    defaultReplyTo: ReplyToChoices.LIST,
    email: 'test@mailinglist.com',
    language: 'FR',
    members: ['191fa41e-46c0-4000-8d25-fca4a684e601'],
    moderationOption: ModerationChoices.ALL,
    organizationId: '191fa41e-46c0-4000-8ae1-ce5ad8165601',
    organizationLabel: 'testOrg',
    owner: '191fa41e-46c0-4000-8a42-82cf2c709370',
  },
};

export const mailingListsMock: MailingListType[] = [
  mailingListDetailMock,
  {
    checksum: 'string',
    currentState: {
      defaultReplyTo: ReplyToChoices.SENDER,
      email: 'test2@mailinglist.com',
      language: 'FR',
      members: ['191fa41e-46c0-4000-86f4-ce92e7b45e80'],
      moderationOption: ModerationChoices.SUBSONLY,
      organizationId: '191fa41e-46c0-4000-8a42-82cf2c709380',
      organizationLabel: 'testOrg2',
      owner: '191fa41e-46c0-4000-8a42-82cf2c709370',
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
    resourceStatus: ResourceStatus.CREATING,
    targetSpec: {
      defaultReplyTo: ReplyToChoices.SENDER,
      email: 'test2@mailinglist.com',
      language: 'FR',
      members: ['191fa41e-46c0-4000-8d25-fca4a684e601'],
      moderationOption: ModerationChoices.SUBSONLY,
      organizationId: '191fa41e-46c0-4000-8ae1-ce5ad8165601',
      organizationLabel: 'testOrg2',
      owner: '191fa41e-46c0-4000-8a42-82cf2c709370',
    },
  },
  {
    checksum: 'string',
    currentState: {
      defaultReplyTo: ReplyToChoices.MAILBOX,
      email: 'test3@mailinglist.com',
      language: 'FR',
      members: ['191fa41e-46c0-4000-86f4-ce92e7b45e80'],
      moderationOption: ModerationChoices.NONE,
      organizationId: '191fa41e-46c0-4000-8a42-82cf2c709380',
      organizationLabel: 'testOrg3',
      owner: '191fa41e-46c0-4000-8a42-82cf2c709370',
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
    resourceStatus: ResourceStatus.CREATING,
    targetSpec: {
      defaultReplyTo: ReplyToChoices.MAILBOX,
      email: 'test3@mailinglist.com',
      language: 'FR',
      members: ['191fa41e-46c0-4000-8d25-fca4a684e601'],
      moderationOption: ModerationChoices.NONE,
      organizationId: '191fa41e-46c0-4000-8ae1-ce5ad8165601',
      organizationLabel: 'testOrg3',
      owner: '191fa41e-46c0-4000-8a42-82cf2c709370',
    },
  },
];

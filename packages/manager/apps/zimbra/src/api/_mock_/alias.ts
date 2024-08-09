import { AliasType } from '@/api/alias';

export const aliasMock: AliasType[] = [
  {
    id: 'bf333af7-585d-4fb3-b81c-06be10df4828',
    resourceStatus: 'READY',
    checksum: '',
    targetSpec: {
      aliasTarget: '1bb958c9-cc20-465b-bf35-04b7f0d91276',
      alias: '',
      organizationId: 'ec66ce51-3561-4a29-a81d-4e1ddab2063d',
      organizationLabel: '',
    },
    currentState: {
      aliasTarget: '7896d921-bb28-4555-98e6-932aae80b6ba',
      alias: '',
      organizationId: '75f1ed74-c3b2-4bba-8b8a-307aa80afa02',
      organizationLabel: '',
    },
    currentTasks: [],
  },
];

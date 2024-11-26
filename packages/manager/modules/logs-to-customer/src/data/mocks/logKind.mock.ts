import { LogKind } from '../types/dbaas/logs';

export const logKindsMock: LogKind[] = [
  {
    name: 'log-kind-1',
    displayName: 'log kind 1',
    createdAt: '2024-10-23T15:24:23Z',
    kindId: 'B5F995F2-BE9C-4805-8910-9A4E5DD25EBF',
    updatedAt: '2024-10-23T15:24:23Z',
    additionalReturnedFields: ['key-1', 'key-2'],
  },
  {
    name: 'log-kind-2',
    displayName: 'log kind 2',
    createdAt: '2024-10-23T15:24:23Z',
    kindId: 'A1F59E82-7978-4078-A1A7-67F82CC89CA9',
    updatedAt: '2024-10-23T15:24:23Z',
    additionalReturnedFields: ['key-1', 'key-2'],
  },
];

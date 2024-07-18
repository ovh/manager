import { ai } from '@/types/ai';

export const mockedTokenCreation: ai.token.TokenSpec = {
  labelSelector: 'labelSelector',
  name: 'tokenName',
  region: 'region',
  role: ai.TokenRoleEnum.ai_training_operator,
};

export const mockedToken: ai.token.Token = {
  createdAt: '1989/04/08',
  id: 'id',
  spec: {
    name: 'tokenSpec',
    region: 'tokenRegion',
    role: ai.TokenRoleEnum.ai_training_operator,
  },
  status: {
    value: 'value',
    version: 4,
  },
  updatedAt: '1989/04/08',
};

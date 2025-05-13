import * as database from '@/types/cloud/project/database';

export const mockedPattern: database.opensearch.Pattern = {
  id: 'patternId',
  pattern: 'myPattern',
  maxIndexCount: 256,
};

export const mockedAddPattern: database.opensearch.Pattern = {
  id: '',
  pattern: 'newPattern',
  maxIndexCount: 512,
};

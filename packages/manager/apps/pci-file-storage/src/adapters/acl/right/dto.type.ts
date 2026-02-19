export type TAclAccessLevelDto = 'ro' | 'rw';

export type TAclDto = {
  id: string;
  accessTo: string;
  accessLevel: TAclAccessLevelDto;
};

export type TAclToCreateDto = {
  accessTo: string;
  accessLevel: TAclAccessLevelDto;
};

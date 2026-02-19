export type TAclAccessLevelDto = 'ro' | 'rw';

export type TAclToCreateDto = {
  accessTo: string;
  accessLevel: TAclAccessLevelDto;
};

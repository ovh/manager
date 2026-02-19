export type TAclAccessLevelDto = 'ro' | 'rw';

/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
export type TAclStatusDto =
  | 'active'
  | 'applying'
  | 'denying'
  | 'error'
  | 'queued_to_apply'
  | 'queued_to_deny'
  | string;
/* eslint-enable @typescript-eslint/no-redundant-type-constituents */

export type TAclDto = {
  id: string;
  accessTo: string;
  accessLevel: TAclAccessLevelDto;
  status: TAclStatusDto;
};

export type TAclToCreateDto = {
  accessTo: string;
  accessLevel: TAclAccessLevelDto;
};

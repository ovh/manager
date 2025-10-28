export type TSectionType =
  | 'delete'
  | 'start'
  | 'stop'
  | 'shelve'
  | 'unshelve'
  | 'soft-reboot'
  | 'hard-reboot'
  | 'reinstall'
  | 'rescue/start'
  | 'rescue/end'
  | 'backup'
  | 'billing/monthly/activate'
  | 'network/private/attach'
  | 'attach';

export type TActionLink = {
  path: string;
  isExternal: boolean;
  isTargetBlank?: boolean;
};

export type TAction = {
  label: string;
  link: TActionLink;
};

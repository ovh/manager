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
  | 'billing/monthly/activate';

export type TOdsBadgeColor =
  | 'neutral'
  | 'alpha'
  | 'beta'
  | 'critical'
  | 'information'
  | 'new'
  | 'promotion'
  | 'success'
  | 'warning';

export type TTTrackActionParams = {
  actionType: 'page' | 'funnel';
  specificAction: string;
};

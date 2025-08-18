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

export type TTrackActionParams = {
  actionType: 'page' | 'funnel';
  specificAction: string;
};

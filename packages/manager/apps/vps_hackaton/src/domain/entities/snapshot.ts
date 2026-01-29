export type TSnapshotState =
  | 'created'
  | 'creating'
  | 'restoring'
  | 'deleting'
  | 'downloading';

export type TSnapshot = {
  id: string;
  creationDate: string;
  description: string | null;
  state: TSnapshotState;
};

/** Cloud database opensearch index definition */
export interface Index {
  /** Date of the creation of the index */
  createdAt?: string;
  /** Number of documents hold by the index */
  documents?: number;
  /** Index ID */
  id?: string;
  /** Name of the index */
  name?: string;
  /** Number of replicas of the index */
  replicasNumber?: number;
  /** Number of shards of the index */
  shardsNumber?: number;
  /** Size of the index */
  size?: number;
}
export * from './Pattern';
export * from './Permissions';
export * from './Service';
export * from './User';
export * from './UserAcl';
export * from './UserCreation';
export * from './UserWithPassword';

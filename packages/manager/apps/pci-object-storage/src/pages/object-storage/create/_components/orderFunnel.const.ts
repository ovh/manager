export enum ObjectContainerOffers {
  's3-standard'= 'storage-s3-standard',
  'swift'= 'storage',
}
export const PLAN_CODES: Record<ObjectContainerOffers, string> = {
  [ObjectContainerOffers["s3-standard"]]: 'storage-standard',
  [ObjectContainerOffers.swift]: 'storage',
};
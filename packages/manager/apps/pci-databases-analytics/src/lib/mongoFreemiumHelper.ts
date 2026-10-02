import * as database from '@/types/cloud/project/database';

export const MONGODB_FREEMIUM_PLAN = 'discovery';
export const MONGODB_FREEMIUM_FLAVOR = 'db2-free';

export const isMongoFreemium = (
  service: Pick<database.Service, 'engine' | 'plan' | 'flavor'>,
) =>
  service.engine === database.EngineEnum.mongodb &&
  service.plan === MONGODB_FREEMIUM_PLAN &&
  service.flavor === MONGODB_FREEMIUM_FLAVOR;

type UnshelvableService = Pick<
  database.Service,
  'engine' | 'plan' | 'flavor' | 'capabilities'
>;

const unshelveActions = (service: UnshelvableService) => {
  const { create, update } = service.capabilities?.unshelve ?? {};
  return [create, update].filter(Boolean);
};

export const isUnshelveDisplayed = (service: UnshelvableService) =>
  isMongoFreemium(service) && unshelveActions(service).length > 0;

export const isUnshelveEnabled = (service: UnshelvableService) =>
  unshelveActions(service).includes(
    database.service.capability.StateEnum.enabled,
  );

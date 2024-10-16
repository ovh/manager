import {
  IdentityEntity,
  IdentityObject,
  IdentityRegion,
  IdentityType,
} from '@/types/identity.type';

const urnIdentityRegExp = /^urn:v(\d):(eu|ca|us|labeu):([a-z]+):([a-z]+):([a-z]{2}\d{1,6}-ovh)\/?(.+?)?$/;

export const decodeIdentity = (identityUrn: string): IdentityObject => {
  const [match, version, region, entity, type, account, id] =
    urnIdentityRegExp.exec(identityUrn) || [];

  if (!match) {
    return null;
  }

  return {
    version: parseInt(version, 10),
    region: region as IdentityRegion,
    entity: entity as IdentityEntity,
    type: type as IdentityType,
    account,
    id,
    urn: identityUrn,
  };
};

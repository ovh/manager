import { BaseResource, ResourceStatus } from './base-resource.type';

export type VCDVrackSegmentSpec = {
  vlanId: string;
  type?: 'DEFAULT' | 'MIGRATED';
  mode: 'TAGGED' | 'TRUNK' | 'UNTAGGED' | 'PUBLIC';
  networks: string[];
};

export type VrackSegmentResourceStatus = ResourceStatus;

export type VCDVrackSegment = BaseResource<VCDVrackSegmentSpec>;

import { describe, it, expect } from 'vitest';
import storages from '@/types/Storages';
import { buildReplicationRule } from './buildReplicationRule';
import { ReplicationFormValues } from './useReplicationForm.hook';

describe('buildReplicationRule', () => {
  const baseFormValues: ReplicationFormValues = {
    ruleId: 'test-rule',
    destination: { name: 'dest-bucket', region: 'GRA' },
    priority: 1,
    prefix: '',
    useStorageClass: false,
    storageClass: storages.StorageClassEnum.STANDARD,
    status: storages.ReplicationRuleStatusEnum.enabled,
    deleteMarkerReplication:
      storages.ReplicationRuleDeleteMarkerReplicationStatusEnum.disabled,
    isReplicationApplicationLimited: false,
    tags: [],
  };

  it('should transform 2 tags from Tag[] to Record<string, string> in payload', () => {
    const formValues: ReplicationFormValues = {
      ...baseFormValues,
      isReplicationApplicationLimited: true,
      tags: [
        { key: 'env', value: 'production' },
        { key: 'app', value: 'myapp' },
      ],
    };

    const result = buildReplicationRule(formValues);

    expect(result).toEqual({
      id: 'test-rule',
      status: storages.ReplicationRuleStatusEnum.enabled,
      destination: {
        name: 'dest-bucket',
        region: 'GRA',
      },
      deleteMarkerReplication:
        storages.ReplicationRuleDeleteMarkerReplicationStatusEnum.disabled,
      priority: 1,
      filter: {
        tags: {
          env: 'production',
          app: 'myapp',
        },
      },
    });
  });

  it('should filter out tags with empty keys', () => {
    const formValues: ReplicationFormValues = {
      ...baseFormValues,
      isReplicationApplicationLimited: true,
      tags: [
        { key: 'env', value: 'production' },
        { key: '', value: 'ignored' },
        { key: 'app', value: 'myapp' },
      ],
    };

    const result = buildReplicationRule(formValues);

    expect(result?.filter?.tags).toEqual({
      env: 'production',
      app: 'myapp',
    });
  });

  it('should not include filter when no valid tags and no prefix', () => {
    const formValues: ReplicationFormValues = {
      ...baseFormValues,
      isReplicationApplicationLimited: true,
      tags: [{ key: '', value: 'ignored' }],
    };

    const result = buildReplicationRule(formValues);

    expect(result?.filter).toBeUndefined();
  });

  it('should include prefix and tags together in filter', () => {
    const formValues: ReplicationFormValues = {
      ...baseFormValues,
      isReplicationApplicationLimited: true,
      prefix: 'images/',
      tags: [
        { key: 'type', value: 'image' },
        { key: 'status', value: 'active' },
      ],
    };

    const result = buildReplicationRule(formValues);

    expect(result?.filter).toEqual({
      prefix: 'images/',
      tags: {
        type: 'image',
        status: 'active',
      },
    });
  });

  it('should not include tags when isReplicationApplicationLimited is false', () => {
    const formValues: ReplicationFormValues = {
      ...baseFormValues,
      isReplicationApplicationLimited: false,
      tags: [{ key: 'env', value: 'production' }],
    };

    const result = buildReplicationRule(formValues);

    expect(result?.filter).toBeUndefined();
  });
});

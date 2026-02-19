import { describe, expect, it } from 'vitest';

import type { TAclToCreate } from '@/domain/entities/acl.entity';
import { isAclToCreateValid } from '@/domain/services/acl.service';

const createAclToCreate = (overrides: Partial<TAclToCreate> = {}): TAclToCreate =>
  ({
    source: { id: '10.0.0.0/24' },
    permissions: ['read'],
    ...overrides,
  }) as TAclToCreate;

describe.each`
  description                                                                                          | aclToCreate                                                                                     | expected
  ${'should return false when source id is empty'}                                                     | ${createAclToCreate({ source: { id: '' } })}                                                    | ${false}
  ${'should return false when permissions contains invalid permission'}                                | ${createAclToCreate({ permissions: ['invalid' as TAclToCreate['permissions'][number]] })}       | ${false}
  ${'should return false when permissions array is too long'}                                          | ${createAclToCreate({ permissions: ['read', 'write', 'read'] as TAclToCreate['permissions'] })} | ${false}
  ${'should return true for ACL with IP address without CIDR notation'}                                | ${createAclToCreate({ source: { id: '10.0.0.0' }, permissions: ['read'] })}                     | ${true}
  ${'should return true for ACL with IP address without CIDR notation and write permission'}           | ${createAclToCreate({ source: { id: '10.0.0.1' }, permissions: ['write'] })}                    | ${true}
  ${'should return true for ACL with IP address without CIDR notation and read and write permissions'} | ${createAclToCreate({ source: { id: '10.0.0.5' }, permissions: ['read', 'write'] })}            | ${true}
  ${'should return true for valid ACL with CIDR range'}                                                | ${createAclToCreate({ source: { id: '10.0.0.0/24' }, permissions: ['read'] })}                  | ${true}
`(
  'isAclToCreateValid',
  ({
    description,
    aclToCreate,
    expected,
  }: {
    description: string;
    aclToCreate: TAclToCreate;
    expected: boolean;
  }) => {
    it(description, () => {
      expect(isAclToCreateValid(aclToCreate)).toBe(expected);
    });
  },
);

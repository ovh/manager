import { describe, expect, it } from 'vitest';

import { TAclAccessLevelDto } from '@/adapters/acl/right/dto.type';
import type { TAclPermission, TAclToCreate } from '@/domain/entities/acl.entity';

import {
  mapAccessLevelToPermissions,
  mapAclToCreateToDto,
  mapPermissionsToAccessLevel,
} from '../mapper';

describe('acl mapper', () => {
  describe('mapPermissionsToAccessLevel', () => {
    it.each([
      {
        description: 'should map permissions with write to rw',
        permissions: ['read', 'write'] as TAclPermission[],
        expected: 'rw' as TAclAccessLevelDto,
      },
      {
        description: 'should map permissions without write to ro',
        permissions: ['read'] as TAclPermission[],
        expected: 'ro' as TAclAccessLevelDto,
      },
      {
        description: 'should map empty permissions to ro',
        permissions: [] as TAclPermission[],
        expected: 'ro' as TAclAccessLevelDto,
      },
      {
        description: 'should map only write permission to rw',
        permissions: ['write'] as TAclPermission[],
        expected: 'rw' as TAclAccessLevelDto,
      },
    ])('$description', ({ permissions, expected }) => {
      expect(mapPermissionsToAccessLevel(permissions)).toBe(expected);
    });
  });

  describe('mapAccessLevelToPermissions', () => {
    it.each([
      {
        description: 'should map ro to read permission',
        accessLevel: 'ro' as TAclAccessLevelDto,
        expected: ['read'] as TAclPermission[],
      },
      {
        description: 'should map rw to write permission',
        accessLevel: 'rw' as TAclAccessLevelDto,
        expected: ['write'] as TAclPermission[],
      },
    ])('$description', ({ accessLevel, expected }) => {
      expect(mapAccessLevelToPermissions(accessLevel)).toEqual(expected);
    });
  });

  describe('mapAclToCreateToDto', () => {
    it.each([
      {
        description: 'should map domain ACL to create with read permission',
        aclToCreate: {
          source: { id: '10.0.0.0' },
          permissions: ['read'],
        } as TAclToCreate,
        expected: {
          accessTo: '10.0.0.0',
          accessLevel: 'ro',
        },
      },
      {
        description: 'should map domain ACL to create with write permission',
        aclToCreate: {
          source: { id: '192.168.1.0/24' },
          permissions: ['write'],
        } as TAclToCreate,
        expected: {
          accessTo: '192.168.1.0/24',
          accessLevel: 'rw',
        },
      },
      {
        description: 'should map domain ACL to create with read and write permissions',
        aclToCreate: {
          source: { id: '10.0.0.0' },
          permissions: ['read', 'write'],
        } as TAclToCreate,
        expected: {
          accessTo: '10.0.0.0',
          accessLevel: 'rw',
        },
      },
    ])('$description', ({ aclToCreate, expected }) => {
      expect(mapAclToCreateToDto(aclToCreate)).toEqual(expected);
    });
  });
});

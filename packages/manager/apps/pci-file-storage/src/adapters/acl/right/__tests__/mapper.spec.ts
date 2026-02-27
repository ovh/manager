import { describe, expect, it } from 'vitest';

import { TAclAccessLevelDto, TAclDto } from '@/adapters/acl/right/dto.type';
import type { TAclPermission, TAclToCreate } from '@/domain/entities/acl.entity';

import {
  mapAccessLevelToPermissions,
  mapAclDtoToAcl,
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

  describe('mapAclDtoToAcl', () => {
    it.each([
      {
        description: 'should map DTO with ro accessLevel and active status',
        dto: {
          id: 'acl-1',
          accessTo: '10.0.0.0',
          accessLevel: 'ro' as TAclAccessLevelDto,
          status: 'active',
        } as TAclDto,
        expected: {
          id: 'acl-1',
          source: { id: '10.0.0.0' },
          permissions: ['read'],
          status: 'active',
        },
      },
      {
        description: 'should map DTO with rw accessLevel and active status',
        dto: {
          id: 'acl-2',
          accessTo: '192.168.1.0/24',
          accessLevel: 'rw' as TAclAccessLevelDto,
          status: 'active',
        } as TAclDto,
        expected: {
          id: 'acl-2',
          source: { id: '192.168.1.0/24' },
          permissions: ['write'],
          status: 'active',
        },
      },
      {
        description: 'should map DTO with denying status to deleting',
        dto: {
          id: 'acl-3',
          accessTo: '10.0.0.1',
          accessLevel: 'ro' as TAclAccessLevelDto,
          status: 'denying',
        } as TAclDto,
        expected: {
          id: 'acl-3',
          source: { id: '10.0.0.1' },
          permissions: ['read'],
          status: 'deleting',
        },
      },
      {
        description: 'should map DTO with queued_to_deny status to deleting',
        dto: {
          id: 'acl-4',
          accessTo: '10.0.0.2',
          accessLevel: 'rw' as TAclAccessLevelDto,
          status: 'queued_to_deny',
        } as TAclDto,
        expected: {
          id: 'acl-4',
          source: { id: '10.0.0.2' },
          permissions: ['write'],
          status: 'deleting',
        },
      },
      {
        description: 'should map DTO with applying status to activating',
        dto: {
          id: 'acl-5',
          accessTo: '10.0.0.3',
          accessLevel: 'ro' as TAclAccessLevelDto,
          status: 'applying',
        } as TAclDto,
        expected: {
          id: 'acl-5',
          source: { id: '10.0.0.3' },
          permissions: ['read'],
          status: 'activating',
        },
      },
      {
        description: 'should map DTO with queued_to_apply status to activating',
        dto: {
          id: 'acl-6',
          accessTo: '10.0.0.4',
          accessLevel: 'rw' as TAclAccessLevelDto,
          status: 'queued_to_apply',
        } as TAclDto,
        expected: {
          id: 'acl-6',
          source: { id: '10.0.0.4' },
          permissions: ['write'],
          status: 'activating',
        },
      },
      {
        description: 'should map DTO with error status',
        dto: {
          id: 'acl-7',
          accessTo: '10.0.0.5',
          accessLevel: 'ro' as TAclAccessLevelDto,
          status: 'error',
        } as TAclDto,
        expected: {
          id: 'acl-7',
          source: { id: '10.0.0.5' },
          permissions: ['read'],
          status: 'error',
        },
      },
    ])('$description', ({ dto, expected }) => {
      expect(mapAclDtoToAcl(dto)).toEqual(expected);
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

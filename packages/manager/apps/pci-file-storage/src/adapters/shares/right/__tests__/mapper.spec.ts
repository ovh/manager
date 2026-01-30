import { describe, expect, it } from 'vitest';

import { capabilitiesToEnabledActions, mapShareDtoToShare } from '../mapper';

describe('capabilitiesToEnabledActions', () => {
  it('should return empty when capabilities is empty', () => {
    expect(capabilitiesToEnabledActions([])).toEqual([]);
  });

  it('should return empty when share_delete is false', () => {
    expect(capabilitiesToEnabledActions([{ name: 'share_delete', enabled: false }])).toEqual([]);
  });

  it('should return edit and acl_management when only those capabilities are enabled', () => {
    expect(
      capabilitiesToEnabledActions([
        { name: 'share_edit', enabled: true },
        { name: 'acl_management', enabled: true },
      ]),
    ).toEqual(['edit', 'acl_management']);
  });

  it('should return update_size, delete and edit when those capabilities are enabled', () => {
    expect(
      capabilitiesToEnabledActions([
        { name: 'share_update_size', enabled: true },
        { name: 'share_delete', enabled: true },
        { name: 'share_edit', enabled: true },
      ]),
    ).toEqual(['update_size', 'delete', 'edit']);
  });

  it('should map all example capabilities to enabled actions in stable order', () => {
    expect(
      capabilitiesToEnabledActions([
        { name: 'share_update_size', enabled: true },
        { name: 'share_revert_from_snapshot', enabled: true },
        { name: 'share_delete', enabled: true },
        { name: 'share_edit', enabled: true },
        { name: 'acl_management', enabled: true },
        { name: 'snapshot_management', enabled: true },
      ]),
    ).toEqual([
      'update_size',
      'revert_from_snapshot',
      'delete',
      'edit',
      'acl_management',
      'snapshot_management',
    ]);
  });

  it('should ignore unknown capability names', () => {
    expect(
      capabilitiesToEnabledActions([
        { name: 'unknown_capability', enabled: true },
        { name: 'share_delete', enabled: true },
      ]),
    ).toEqual(['delete']);
  });
});

describe('mapShareDtoToShare', () => {
  it.each([
    {
      description: 'should map share with available status',
      dto: {
        id: 'share-1',
        name: 'My Share',
        region: 'GRA9',
        protocol: 'NFS',
        size: 161061273600,
        status: 'available',
        type: 'nfs',
        createdAt: '2026-01-30T09:35:49.615Z',
        description: 'Description',
        isPublic: false,
        capabilities: [],
      },
    },
    {
      description: 'should map share with creating status',
      dto: {
        id: 'share-2',
        name: 'Another Share',
        region: 'GRA9',
        protocol: 'NFS',
        size: 53687091200,
        status: 'creating',
        type: 'nfs',
        createdAt: '2026-01-30T10:00:00.000Z',
        description: '',
        isPublic: true,
        capabilities: [],
      },
    },
  ])('$description', ({ dto }) => {
    const result = mapShareDtoToShare(dto);

    expect(result).toEqual({
      id: dto.id,
      name: dto.name,
      region: dto.region,
      protocol: dto.protocol,
      size: dto.size,
      status: dto.status,
      type: dto.type,
      createdAt: dto.createdAt,
      description: dto.description,
      isPublic: dto.isPublic,
      enabledActions: [],
    });
  });

  it('should map unknown status to unmanaged', () => {
    const dto = {
      id: 'share-3',
      name: 'Share',
      region: 'GRA9',
      protocol: 'NFS',
      size: 0,
      status: 'unknown_status',
      type: 'nfs',
      createdAt: '2026-01-30T09:00:00.000Z',
      description: '',
      isPublic: false,
      capabilities: [],
    };

    const result = mapShareDtoToShare(dto);

    expect(result.status).toBe('unmanaged');
    expect(result.id).toBe(dto.id);
    expect(result.enabledActions).toEqual([]);
  });

  it('should map capabilities to enabledActions', () => {
    const dto = {
      id: 'share-4',
      name: 'Share',
      region: 'GRA9',
      protocol: 'NFS',
      size: 0,
      status: 'available',
      type: 'nfs',
      createdAt: '2026-01-30T09:00:00.000Z',
      description: '',
      isPublic: false,
      capabilities: [
        { name: 'share_update_size', enabled: true },
        { name: 'share_delete', enabled: true },
        { name: 'share_edit', enabled: true },
      ],
    };

    const result = mapShareDtoToShare(dto);

    expect(result.enabledActions).toEqual(['update_size', 'delete', 'edit']);
  });
});

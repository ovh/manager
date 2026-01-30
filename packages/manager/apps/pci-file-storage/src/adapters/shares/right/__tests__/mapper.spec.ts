import { describe, expect, it } from 'vitest';

import { mapShareDtoToShare } from '../mapper';

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
    };

    const result = mapShareDtoToShare(dto);

    expect(result.status).toBe('unmanaged');
    expect(result.id).toBe(dto.id);
  });
});

import { describe, it, expect, vi, Mock } from 'vitest';
import { v6 } from '@ovh-ux/manager-core-api';
import {
  getIpRestrictions,
  updateIpRestriction,
  processIpBlock,
} from './ip-restrictions';

import {
  FilterRestrictionsServer,
  TIPRestrictionsData,
  TIPRestrictionsDefault,
  TIPRestrictionsMethodEnum,
} from '@/types';

const mockProjectId = 'testProjectId';
const mockRegistryId = 'testRegistryId';
const mockAuthorization = [
  'registry',
  'management',
] as FilterRestrictionsServer[];

describe('IP Restrictions API', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it('fetches IP restrictions successfully', async () => {
    const mockIpRestrictions = [
      { ipBlock: '192.168.0.1/2', description: 'value1' },
      { ipBlock: '192.168.0.2', description: 'value21' },
    ];
    const mockIpRestrictions2 = [
      { ipBlock: '192.168.0.1/2', description: 'value1' },
      { ipBlock: '192.168.0.2/24', description: 'value22' },
    ];

    vi.mocked(v6.get).mockResolvedValueOnce({ data: mockIpRestrictions });
    vi.mocked(v6.get).mockResolvedValueOnce({ data: mockIpRestrictions2 });

    const result = await getIpRestrictions(
      'testProjectId',
      'testRegistryId',
      mockAuthorization,
    );

    expect(result).toEqual([
      {
        ipBlock: '192.168.0.1/2',
        description: 'value1',
        authorization: mockAuthorization,
      },
      {
        ipBlock: '192.168.0.2',
        description: 'value21',
        authorization: ['registry'],
      },
      {
        ipBlock: '192.168.0.2/24',
        description: 'value22',
        authorization: ['management'],
      },
    ]);
  });

  it('handles empty IP restrictions response', async () => {
    const mockIpRestrictions: TIPRestrictionsData[] = [];

    vi.mocked(v6.get).mockResolvedValue({ data: mockIpRestrictions });

    const result = await getIpRestrictions('testProjectId', 'testRegistryId', [
      'management',
      'registry',
    ]);

    expect(result).toEqual([]);
  });

  it('handles error when fetching IP restrictions', async () => {
    vi.mocked(v6.get).mockRejectedValue(new Error('Network Error'));

    await expect(
      getIpRestrictions('testProjectId', 'testRegistryId', [
        'management',
        'registry',
      ]),
    ).rejects.toThrow('Network Error');
  });
});

describe('updateIpRestriction', () => {
  it('should update IP restrictions with REPLACE action', async () => {
    const mockIpRestrictions = [
      { ipBlock: '192.168.0.1/2', description: 'value1' },
      { ipBlock: '192.168.0.2', description: 'value1' },
    ];

    vi.mocked(v6.get).mockResolvedValueOnce({ data: mockIpRestrictions });

    const mockUpdatedIp = [
      { ipBlock: '192.168.0.2', description: 'newValue' },
    ] as TIPRestrictionsDefault[];

    vi.mocked(v6.put).mockResolvedValueOnce({ data: 'success' });

    const result = await updateIpRestriction(
      mockProjectId,
      mockRegistryId,
      ({ management: mockUpdatedIp } as unknown) as Record<
        FilterRestrictionsServer,
        TIPRestrictionsDefault[]
      >,
      TIPRestrictionsMethodEnum.REPLACE,
    );

    expect(v6.put).toHaveBeenCalledWith(
      `/cloud/project/${mockProjectId}/containerRegistry/${mockRegistryId}/ipRestrictions/management`,
      [
        { ipBlock: '192.168.0.1/2', description: 'value1' },
        { description: 'newValue', ipBlock: '192.168.0.2' },
      ],
    );
    expect(result).toEqual([{ data: 'success' }]);
  });

  it('should update IP restrictions with DELETE action', async () => {
    const mockIpRestrictions = [
      { ipBlock: '192.168.0.1/2', description: 'value1' },
      { ipBlock: '192.168.0.3', description: 'value1' },
    ];

    vi.mocked(v6.get).mockResolvedValueOnce({ data: mockIpRestrictions });

    const mockIpToDelete = [
      { ipBlock: '192.168.0.3', description: 'value' },
    ] as TIPRestrictionsDefault[];

    (v6.put as Mock).mockResolvedValueOnce({ data: 'success' });

    const result = await updateIpRestriction(
      mockProjectId,
      mockRegistryId,
      ({ management: mockIpToDelete } as unknown) as Record<
        FilterRestrictionsServer,
        TIPRestrictionsDefault[]
      >,
      TIPRestrictionsMethodEnum.DELETE,
    );

    expect(v6.put).toHaveBeenCalledWith(
      `/cloud/project/${mockProjectId}/containerRegistry/${mockRegistryId}/ipRestrictions/management`,
      [
        {
          description: 'value1',
          ipBlock: '192.168.0.1/2',
        },
      ],
    );
    expect(result).toEqual([{ data: 'success' }]);
  });
});

describe('processIpBlock', () => {
  it('should replace or delete IP blocks based on action', async () => {
    const mockExistingData = [
      { ipBlock: '192.168.0.2', description: 'oldValue' },
    ] as TIPRestrictionsDefault[];

    const mockNewIpBlock: TIPRestrictionsDefault[] = [
      { ipBlock: '192.168.0.2', description: 'newValue' },
    ] as TIPRestrictionsDefault[];

    vi.mocked(v6.get).mockResolvedValue({ data: mockExistingData });
    vi.mocked(v6.put).mockResolvedValue({ data: 'success' });

    const resultReplace = await processIpBlock({
      projectId: mockProjectId,
      registryId: mockRegistryId,
      authorization: 'management',
      values: mockNewIpBlock,
      action: TIPRestrictionsMethodEnum.REPLACE,
    });

    expect(
      v6.put,
    ).toHaveBeenCalledWith(
      `/cloud/project/${mockProjectId}/containerRegistry/${mockRegistryId}/ipRestrictions/management`,
      [{ ipBlock: '192.168.0.2', description: 'newValue' }],
    );
    expect(resultReplace).toEqual({ data: 'success' });

    const resultDelete = await processIpBlock({
      projectId: mockProjectId,
      registryId: mockRegistryId,
      authorization: 'management',
      values: mockNewIpBlock,
      action: TIPRestrictionsMethodEnum.DELETE,
    });

    expect(v6.put).toHaveBeenCalledWith(
      `/cloud/project/${mockProjectId}/containerRegistry/${mockRegistryId}/ipRestrictions/management`,
      [],
    );
    expect(resultDelete).toEqual({ data: 'success' });
  });
});
describe('IP Restrictions Update API', () => {
  it('updates IP restrictions successfully with REPLACE action', async () => {
    const mockIpRestrictions = [
      { ipBlock: '192.168.0.1/2', description: 'value1' },
      { ipBlock: '192.168.0.2', description: 'value21' },
    ];

    vi.mocked(v6.get).mockResolvedValueOnce({ data: mockIpRestrictions });

    const mockUpdatedIp = [
      { ipBlock: '192.168.0.2', description: 'newValue' },
    ] as TIPRestrictionsDefault[];

    vi.mocked(v6.put).mockResolvedValue({ data: 'success' });

    const result = await updateIpRestriction(
      'testProjectId',
      'testRegistryId',
      ({ management: mockUpdatedIp } as unknown) as Record<
        FilterRestrictionsServer,
        TIPRestrictionsDefault[]
      >,
      TIPRestrictionsMethodEnum.REPLACE,
    );

    expect(v6.put).toHaveBeenCalledWith(
      '/cloud/project/testProjectId/containerRegistry/testRegistryId/ipRestrictions/management',
      [
        { ipBlock: '192.168.0.1/2', description: 'value1' },
        { ipBlock: '192.168.0.2', description: 'newValue' },
      ],
    );
    expect(result).toEqual([{ data: 'success' }]);
  });

  it('updates IP restrictions successfully with DELETE action', async () => {
    const mockIpRestrictions = [
      { ipBlock: '192.168.0.1/2', description: 'value1' },
      { ipBlock: '192.168.0.2', description: 'value21' },
    ];

    vi.mocked(v6.get).mockResolvedValueOnce({ data: mockIpRestrictions });

    const mockIpToDelete = ([
      { ipBlock: '192.168.0.2', description: 'value' },
    ] as unknown) as TIPRestrictionsData[];

    vi.mocked(v6.put).mockResolvedValue({ data: 'success' });

    const result = await updateIpRestriction(
      'testProjectId',
      'testRegistryId',
      ({ management: mockIpToDelete } as unknown) as Record<
        FilterRestrictionsServer,
        TIPRestrictionsDefault[]
      >,
      TIPRestrictionsMethodEnum.DELETE,
    );

    expect(v6.put).toHaveBeenCalledWith(
      '/cloud/project/testProjectId/containerRegistry/testRegistryId/ipRestrictions/management',
      [
        {
          description: 'value1',
          ipBlock: '192.168.0.1/2',
        },
      ],
    );
    expect(result).toEqual([{ data: 'success' }]);
  });

  it('handles error when updating IP restrictions', async () => {
    const mockIpRestrictions = [
      { ipBlock: '192.168.0.1/2', description: 'value1' },
      { ipBlock: '192.168.0.2', description: 'value21' },
    ];

    vi.mocked(v6.get).mockResolvedValueOnce({ data: mockIpRestrictions });
    vi.mocked(v6.put).mockRejectedValue(new Error('Network Error'));

    await expect(
      updateIpRestriction(
        'testProjectId',
        'testRegistryId',
        ({ management: [] } as unknown) as Record<
          FilterRestrictionsServer,
          TIPRestrictionsDefault[]
        >,
        TIPRestrictionsMethodEnum.REPLACE,
      ),
    ).rejects.toThrow('Network Error');
  });
});
describe('IP Restrictions Process API', () => {
  it('replaces or deletes IP blocks based on action', async () => {
    const mockExistingData = [
      { ipBlock: '192.168.0.2', description: 'oldValue' },
    ];

    const mockNewIpBlock = ([
      { ipBlock: '192.168.0.2', description: 'newValue' },
    ] as unknown) as TIPRestrictionsDefault[];

    vi.mocked(v6.get).mockResolvedValue({ data: mockExistingData });
    vi.mocked(v6.put).mockResolvedValue({ data: 'success' });

    const resultReplace = await processIpBlock({
      projectId: 'testProjectId',
      registryId: 'testRegistryId',
      authorization: 'registry',
      values: mockNewIpBlock as TIPRestrictionsDefault[],
      action: TIPRestrictionsMethodEnum.REPLACE,
    });

    expect(
      v6.put,
    ).toHaveBeenCalledWith(
      '/cloud/project/testProjectId/containerRegistry/testRegistryId/ipRestrictions/registry',
      [{ ipBlock: '192.168.0.2', description: 'newValue' }],
    );
    expect(resultReplace).toEqual({ data: 'success' });

    // Testing DELETE action
    const resultDelete = await processIpBlock({
      projectId: 'testProjectId',
      registryId: 'testRegistryId',
      authorization: 'registry',
      values: mockNewIpBlock,
      action: TIPRestrictionsMethodEnum.DELETE,
    });

    expect(v6.put).toHaveBeenCalledWith(
      '/cloud/project/testProjectId/containerRegistry/testRegistryId/ipRestrictions/registry',
      [],
    );
    expect(resultDelete).toEqual({ data: 'success' });
  });

  it('handles error when processing IP blocks', async () => {
    const mockExistingData = [
      { ipBlock: '192.168.0.2', description: 'oldValue' },
    ];

    vi.mocked(v6.get).mockResolvedValue({ data: mockExistingData });
    vi.mocked(v6.put).mockRejectedValue(new Error('Network Error'));

    await expect(
      processIpBlock({
        projectId: 'testProjectId',
        registryId: 'testRegistryId',
        authorization: 'registry',
        values: [],
        action: TIPRestrictionsMethodEnum.REPLACE,
      }),
    ).rejects.toThrow('Network Error');
  });
});

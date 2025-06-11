import { describe, it, vi } from 'vitest';
import { v6 } from '@ovh-ux/manager-core-api';
import { editInstanceName, getRegionInstance } from './instance';

const projectId = 'projectId-test';
const instanceId = 'instanceId-test';
const instanceName = 'instanceName-test';
const region = 'REGION-STN';

vi.mock('@ovh-ux/manager-core-api');
vi.mocked(v6.get).mockImplementation(() => Promise.resolve({ data: null }));

describe('editInstanceName', () => {
  it('should call the good endpoint with the instance name params body', () => {
    editInstanceName({ projectId, instanceId, instanceName });

    expect(
      v6.put,
    ).toHaveBeenCalledWith(
      `/cloud/project/${projectId}/instance/${instanceId}`,
      { instanceName },
    );
  });
});

describe('getRegionInstance', () => {
  it('should call the instance regionalized endpoint', () => {
    getRegionInstance({ projectId, region, instanceId });

    expect(v6.get).toHaveBeenCalledWith(
      `/cloud/project/${projectId}/region/${region}/instance/${instanceId}`,
    );
  });
});

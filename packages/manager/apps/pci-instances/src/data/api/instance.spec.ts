import { describe, it, vi } from 'vitest';
import { v6 } from '@ovh-ux/manager-core-api';
import { editInstanceName } from './instance';

const projectId = 'projectId-test';
const instanceId = 'instanceId-test';
const instanceName = 'instanceName-test';

vi.mock('@ovh-ux/manager-core-api');

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

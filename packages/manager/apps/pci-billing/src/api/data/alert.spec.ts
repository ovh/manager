import { describe, vi } from 'vitest';
import { v6 } from '@ovh-ux/manager-core-api';
import {
  createAlert,
  deleteAlert,
  getAlertById,
  getAllAlertIds,
  updateAlert,
} from '@/api/data/alert';

vi.mock('@ovh-ux/manager-core-api', () => ({
  v6: {
    post: vi.fn().mockReturnValue({ data: {} }),
    put: vi.fn(),
    delete: vi.fn(),
    get: vi.fn().mockReturnValue({ data: {} }),
  },
}));

describe('createAlert', () => {
  it('should call v6 with right arguments', () => {
    createAlert('projectId', 'email', 100);
    expect(v6.post).toHaveBeenLastCalledWith(
      '/cloud/project/projectId/alerting',
      {
        email: 'email',
        monthlyThreshold: 100,
        delay: 3600,
      },
    );
  });
});

describe('updateAlert', () => {
  it('should call v6 with right arguments', () => {
    updateAlert('projectId', 'id', 'email', 100);
    expect(v6.put).toHaveBeenLastCalledWith(
      '/cloud/project/projectId/alerting/id',
      {
        email: 'email',
        monthlyThreshold: 100,
        delay: 3600,
      },
    );
  });
});

describe('getAllAlertIds', () => {
  it('should call v6 with right arguments', () => {
    getAllAlertIds('projectId');
    expect(v6.get).toHaveBeenLastCalledWith(
      '/cloud/project/projectId/alerting',
    );
  });
});

describe('getAlertById', () => {
  it('should call v6 with right arguments', () => {
    getAlertById('projectId', 'id');
    expect(v6.get).toHaveBeenLastCalledWith(
      '/cloud/project/projectId/alerting/id',
    );
  });
});

describe('deleteAlert', () => {
  it('should call v6 with right arguments', () => {
    deleteAlert('projectId', 'id');
    expect(v6.delete).toHaveBeenLastCalledWith(
      '/cloud/project/projectId/alerting/id',
    );
  });
});

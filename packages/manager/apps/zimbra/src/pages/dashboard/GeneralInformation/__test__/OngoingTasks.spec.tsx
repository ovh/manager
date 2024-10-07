import React from 'react';
import { vi, describe, expect } from 'vitest';
import { OngoingTasks } from '../OngoingTasks';
import { render } from '@/utils/test.provider';
import { platformMock, organizationDetailMock, taskMocks } from '@/api/_mock_';

const hooks = vi.hoisted(() => {
  return {
    useOrganization: vi.fn(() => ({
      data: organizationDetailMock,
      isLoading: false,
    })),
    usePlatform: vi.fn(() => ({
      platformId: platformMock[0].id,
      platformUrn: platformMock[0].iam.urn,
    })),
    useTasks: vi.fn(() => ({
      data: taskMocks,
      isLoading: false,
    })),
  };
});

vi.mock('@/hooks', () => {
  return {
    ...hooks,
  };
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('OngoingTasks component', () => {
  it('should display component correctly', async () => {
    const { getByTestId } = render(<OngoingTasks />);

    const wrap = getByTestId('ongoingtasks');

    expect(wrap).toBeVisible();
  });
});

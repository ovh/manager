import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { UseQueryResult } from '@tanstack/react-query';
import * as database from '@/types/cloud/project/database';
import { CdbError } from '@/data/api/database';
import * as capabilitiesApi from '@/data/api/database/capabilities.api';
import * as ServiceContext from '@/pages/services/[serviceId]/Service.context';
import { mockedService } from '@/__tests__/helpers/mocks/services';
import { mockedEngineCapabilities } from '@/__tests__/helpers/mocks/availabilities';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import VersionEolDate from './VersionEolDate.component';

vi.mock('@/pages/services/[serviceId]/Service.context', () => ({
  useServiceData: vi.fn(),
}));

vi.mock('@/data/api/database/capabilities.api', () => ({
  getEnginesCapabilities: vi.fn(),
}));

describe('VersionEolDate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'));
    vi.mocked(ServiceContext.useServiceData).mockReturnValue({
      projectId: 'projectId',
      service: mockedService,
      category: 'operational',
      serviceQuery: {} as UseQueryResult<database.Service, CdbError>,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('displays the end of life date of the version', async () => {
    vi.mocked(capabilitiesApi.getEnginesCapabilities).mockResolvedValue([
      {
        ...mockedEngineCapabilities,
        versions: [
          {
            ...mockedEngineCapabilities.versions[0],
            lifecycle: {
              ...mockedEngineCapabilities.versions[0].lifecycle,
              endOfLife: '2026-01-01T01:00:00Z',
            },
          },
        ],
      },
    ]);
    render(<VersionEolDate />, { wrapper: QueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByText('End of life')).toBeInTheDocument();
    });
  });
});

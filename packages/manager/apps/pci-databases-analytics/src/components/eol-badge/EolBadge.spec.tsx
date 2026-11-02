import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import * as capabilitiesApi from '@/data/api/database/capabilities.api';
import * as database from '@/types/cloud/project/database';
import { mockedEngineCapabilities } from '@/__tests__/helpers/mocks/availabilities';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import EolBadge from './EolBadge.component';

vi.mock('react-router-dom', async (importOriginal) => {
  const mod = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...mod,
    useParams: () => ({ projectId: 'projectId' }),
  };
});

vi.mock('@/data/api/database/capabilities.api', () => ({
  getEnginesCapabilities: vi.fn(),
}));

const mockEndOfLife = (endOfLife: string) => {
  vi.mocked(capabilitiesApi.getEnginesCapabilities).mockResolvedValue([
    {
      ...mockedEngineCapabilities,
      versions: [
        {
          ...mockedEngineCapabilities.versions[0],
          lifecycle: {
            ...mockedEngineCapabilities.versions[0].lifecycle,
            endOfLife,
          },
        },
      ],
    },
  ]);
};

describe('EolBadge', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('displays the badge when the version reaches its end of life soon', async () => {
    mockEndOfLife('2026-01-01T01:00:00Z');
    render(
      <EolBadge engine={database.EngineEnum.mongodb} version="version" />,
      { wrapper: QueryClientWrapper },
    );
    await waitFor(() => {
      expect(screen.getByTestId('eol-badge')).toBeInTheDocument();
    });
  });

  it('does not display the badge when the end of life is far away', async () => {
    mockEndOfLife('2030-01-01T00:00:00Z');
    render(
      <EolBadge engine={database.EngineEnum.mongodb} version="version" />,
      { wrapper: QueryClientWrapper },
    );
    await waitFor(() => {
      expect(capabilitiesApi.getEnginesCapabilities).toHaveBeenCalled();
    });
    expect(screen.queryByTestId('eol-badge')).not.toBeInTheDocument();
  });
});

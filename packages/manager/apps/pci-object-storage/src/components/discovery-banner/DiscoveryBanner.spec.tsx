import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import DiscoveryBanner from './DiscoveryBanner.component';
import { mockedPciProject } from '@/__tests__/helpers/mocks/project';
import { PlanCode } from '@/configuration/project';

const mockedDiscoveryProject = {
  ...mockedPciProject,
  planCode: PlanCode.DISCOVERY,
};

describe('Discovery Banner component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();

    vi.mock('@/data/api/project/project.api', () => {
      return {
        getProject: vi.fn(() => mockedDiscoveryProject),
      };
    });
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders Alert discovery banner', async () => {
    render(
      <DiscoveryBanner>
        <p>Discovery Title</p>
      </DiscoveryBanner>,
      {
        wrapper: RouterWithQueryClientWrapper,
      },
    );
    await waitFor(() => {
      expect(screen.getByTestId('discovery-container')).toBeTruthy();
      expect(screen.getByText('Discovery Title')).toBeTruthy();
    });
  });
});

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { handleSelectOption } from '@/__tests__/helpers/unitTestHelper';
import SharedDocker from '@/pages/dashboard/docker/_components/sharedDocker/SharedDocker.component';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import {
  mockedCapabilitiesRegionBHS,
  mockedCapabilitiesRegionGRA,
} from '@/__tests__/helpers/mocks/capabilities/region';

describe('SharedDocker page', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders and shows buttons in the shareddockers page', async () => {
    render(<SharedDocker regions={[mockedCapabilitiesRegionGRA]} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    expect(screen.getByTestId('shared-docker-title')).toBeInTheDocument();
    expect(screen.getByText(/^docker login/)).toBeInTheDocument();
    expect(screen.getByText(/^docker tag/)).toBeInTheDocument();
    expect(screen.getByText(/^docker push/)).toBeInTheDocument();
  });

  it('change region in sharedDocker', async () => {
    render(
      <SharedDocker
        regions={[mockedCapabilitiesRegionGRA, mockedCapabilitiesRegionBHS]}
      />,
      {
        wrapper: RouterWithQueryClientWrapper,
      },
    );
    await handleSelectOption('select-region-trigger', 'BHS');
    expect(screen.getByTestId('shared-docker-title')).toBeInTheDocument();
    expect(screen.getByText(/^docker login/)).toBeInTheDocument();
    expect(screen.getByText(/^docker tag/)).toBeInTheDocument();
    expect(screen.getByText(/^docker push/)).toBeInTheDocument();
  });
});

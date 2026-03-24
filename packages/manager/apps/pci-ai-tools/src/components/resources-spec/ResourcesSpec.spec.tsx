import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import { mockedUsedNavigate } from '@/__tests__/helpers/mockRouterDomHelper';
import ResourcesSpec from './ResourcesSpec.component';
import { mockedGPUResources } from '@/__tests__/helpers/mocks/shared/resource';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import ai from '@/types/AI';

describe('ResourcesSpec component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockedUsedNavigate();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should display resources gpu with update flavor button', async () => {
    render(
      <ResourcesSpec resources={mockedGPUResources} allowUpdate={true} />,
      { wrapper: RouterWithQueryClientWrapper },
    );
    await waitFor(() => {
      expect(screen.getByTestId('update-flavor-button')).toBeTruthy();
    });
  });

  it('should display trigger naviaget on flavor button click', async () => {
    render(
      <ResourcesSpec resources={mockedGPUResources} allowUpdate={true} />,
      { wrapper: RouterWithQueryClientWrapper },
    );
    act(() => {
      fireEvent.click(screen.getByTestId('update-flavor-button'));
    });
    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('./update-flavor');
    });
  });

  it('should display flavor count independently from gpu count', async () => {
    const h200Resources: ai.Resources = {
      ...mockedGPUResources,
      flavor: 'h200-4-gpu',
      flavorCount: 1,
      gpu: 4,
      gpuModel: 'H200',
    };

    render(<ResourcesSpec resources={h200Resources} />, {
      wrapper: RouterWithQueryClientWrapper,
    });

    await waitFor(() => {
      expect(screen.getByText('1 x h200-4-gpu')).toBeTruthy();
      expect(screen.getByText('4 x H200')).toBeTruthy();
    });
  });
});

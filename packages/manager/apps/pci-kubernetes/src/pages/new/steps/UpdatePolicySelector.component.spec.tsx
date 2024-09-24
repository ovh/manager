import { describe, it, vi, expect, beforeEach, Mock } from 'vitest';
import { render, fireEvent, waitFor } from '@testing-library/react';
import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
import {
  UpdatePolicyTileSelector,
  selectedTileClass,
} from './UpdatePolicySelector.component';

import { UPGRADE_POLICIES } from '@/constants';
import { UpdatePolicy } from '@/types';

let setPolicyMock: Mock;

describe('UpgradePolicyTileSelector', () => {
  beforeEach(() => {
    setPolicyMock = vi.fn();
  });

  // Mock ShellContext
  const mockShellContextValue = {
    environment: {
      getUser: () => ({ ovhSubsidiary: 'en' }),
    },
  } as ShellContextType;

  it('renders correctly ', () => {
    const { container } = render(
      <ShellContext.Provider value={mockShellContextValue}>
        <UpdatePolicyTileSelector
          setPolicy={setPolicyMock}
          policy={UpdatePolicy.AlwaysUpdate}
        />
      </ShellContext.Provider>,
    );

    expect(container).toBeInTheDocument();
  });

  it('displays the correct number of policy tiles', () => {
    const { getAllByRole } = render(
      <ShellContext.Provider value={mockShellContextValue}>
        <UpdatePolicyTileSelector
          setPolicy={setPolicyMock}
          policy={UpdatePolicy.AlwaysUpdate}
        />
      </ShellContext.Provider>,
    );

    const tiles = getAllByRole('button');
    expect(tiles.length).toBe(UPGRADE_POLICIES.length);
  });

  it('calls setPolicy with the correct argument when a tile is clicked', async () => {
    const { getByTestId } = render(
      <ShellContext.Provider value={mockShellContextValue}>
        <UpdatePolicyTileSelector
          setPolicy={setPolicyMock}
          policy={UpdatePolicy.AlwaysUpdate}
        />
      </ShellContext.Provider>,
    );

    const tile = getByTestId(UpdatePolicy.MinimalDowntime);
    fireEvent.click(tile);

    await waitFor(() => {
      expect(setPolicyMock).toHaveBeenCalledWith(UpdatePolicy.MinimalDowntime);
    });
  });

  it('applies the correct class to the selected tile', () => {
    const { getByTestId } = render(
      <ShellContext.Provider value={mockShellContextValue}>
        <UpdatePolicyTileSelector
          setPolicy={setPolicyMock}
          policy={UpdatePolicy.AlwaysUpdate}
        />
      </ShellContext.Provider>,
    );

    const selectedTile = getByTestId(UpdatePolicy.AlwaysUpdate);
    expect(selectedTile).toHaveClass(selectedTileClass);
  });
});

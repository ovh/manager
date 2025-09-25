import { fireEvent, render, waitFor } from '@testing-library/react';
import { Mock, beforeEach, describe, expect, it, vi } from 'vitest';

import { ShellContext, ShellContextType } from '@ovh-ux/manager-react-shell-client';

import { UPGRADE_POLICIES } from '@/constants';
import { UpdatePolicy } from '@/types';

import { UpdatePolicySelector, selectedTileClass } from './UpdatePolicySelector.component';

let setPolicyMock: Mock;

describe('UpgradePolicyTileSelector', () => {
  beforeEach(() => {
    setPolicyMock = vi.fn();
  });

  // Mock ShellContext
  const mockShellContextValue = {
    environment: {
      getUser: () => ({ ovhSubsidiary: 'GB' }),
    },
  } as ShellContextType;

  it('renders correctly ', () => {
    const { container } = render(
      <ShellContext.Provider value={mockShellContextValue}>
        <UpdatePolicySelector onPolicyChange={setPolicyMock} policy={UpdatePolicy.AlwaysUpdate} />
      </ShellContext.Provider>,
    );

    expect(container).toBeInTheDocument();
  });

  it('displays the correct number of policy tiles', () => {
    const { getAllByRole } = render(
      <ShellContext.Provider value={mockShellContextValue}>
        <UpdatePolicySelector onPolicyChange={setPolicyMock} policy={UpdatePolicy.AlwaysUpdate} />
      </ShellContext.Provider>,
    );

    const tiles = getAllByRole('button');
    expect(tiles.length).toBe(UPGRADE_POLICIES.length);
  });

  it('calls setPolicy with the correct argument when a tile is clicked', async () => {
    const { getByTestId } = render(
      <ShellContext.Provider value={mockShellContextValue}>
        <UpdatePolicySelector onPolicyChange={setPolicyMock} policy={UpdatePolicy.AlwaysUpdate} />
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
        <UpdatePolicySelector onPolicyChange={setPolicyMock} policy={UpdatePolicy.AlwaysUpdate} />
      </ShellContext.Provider>,
    );

    const selectedTile = getByTestId(UpdatePolicy.AlwaysUpdate);
    expect(selectedTile).toHaveClass(selectedTileClass);
  });
});

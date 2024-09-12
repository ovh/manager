import { describe, it, vi, expect, beforeEach, Mock } from 'vitest';
import { render, fireEvent, waitFor } from '@testing-library/react';
import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
import {
  UpgradePolicyTileSelector,
  selectedTileClass,
} from './UpgradePolicySelector.component';

import { UPGRADE_POLICIES } from '@/constants';
import { UPGRADEPOLICIES } from '@/types';

// Mock translation
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));
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
        <UpgradePolicyTileSelector
          setPolicy={setPolicyMock}
          policy={UPGRADEPOLICIES.ALWAYS_UPDATE}
        />
      </ShellContext.Provider>,
    );

    expect(container).toBeInTheDocument();
  });

  it('displays the correct number of policy tiles', () => {
    const { getAllByRole } = render(
      <ShellContext.Provider value={mockShellContextValue}>
        <UpgradePolicyTileSelector
          setPolicy={setPolicyMock}
          policy={UPGRADEPOLICIES.ALWAYS_UPDATE}
        />
      </ShellContext.Provider>,
    );

    const tiles = getAllByRole('button'); // Assuming OsdsTile renders a button element
    expect(tiles.length).toBe(UPGRADE_POLICIES.length);
  });

  it('calls setPolicy with the correct argument when a tile is clicked', async () => {
    const { getByTestId } = render(
      <ShellContext.Provider value={mockShellContextValue}>
        <UpgradePolicyTileSelector
          setPolicy={setPolicyMock}
          policy={UPGRADEPOLICIES.ALWAYS_UPDATE}
        />
      </ShellContext.Provider>,
    );

    const tile = getByTestId(UPGRADEPOLICIES.MINIMAL_DOWNTIME);
    fireEvent.click(tile);

    await waitFor(() => {
      expect(setPolicyMock).toHaveBeenCalledWith(
        UPGRADEPOLICIES.MINIMAL_DOWNTIME,
      );
    });
  });

  it('applies the correct class to the selected tile', () => {
    const { getByTestId } = render(
      <ShellContext.Provider value={mockShellContextValue}>
        <UpgradePolicyTileSelector
          setPolicy={setPolicyMock}
          policy={UPGRADEPOLICIES.ALWAYS_UPDATE}
        />
      </ShellContext.Provider>,
    );

    const selectedTile = getByTestId(UPGRADEPOLICIES.ALWAYS_UPDATE);
    expect(selectedTile).toHaveClass(selectedTileClass);
  });
});

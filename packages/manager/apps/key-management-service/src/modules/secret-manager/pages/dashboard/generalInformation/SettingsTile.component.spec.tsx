import React from 'react';
import { describe } from 'vitest';
import { screen, render } from '@testing-library/react';
import { secretsMock } from '@secret-manager/mocks/secrets/secrets.mock';
import { Secret } from '@secret-manager/types/secret.type';
import { SettingsTile } from './SettingsTile.component';

const mockSecret = secretsMock[0];

describe('Secrets Settings Tile component tests suite', () => {
  test('Should display settings tile with all data', async () => {
    render(<SettingsTile secret={mockSecret} />);

    const labelList = [
      'settings',
      mockSecret.metadata.deactivateVersionAfter,
      'maximum_number_of_versions',
      mockSecret.metadata.maxVersions,
      'cas_with_description',
      'deactivated',
    ];

    labelList.forEach((label) => {
      expect(screen.getByText(label)).toBeVisible();
    });
  });

  test('Should display "not provided" when data is not available', async () => {
    const secret: Secret = {
      ...mockSecret,
      metadata: {
        ...mockSecret.metadata,
        deactivateVersionAfter: undefined,
        maxVersions: undefined,
      },
    };
    render(<SettingsTile secret={secret} />);

    expect(screen.getAllByText('not_provided')).toHaveLength(2);
  });
});

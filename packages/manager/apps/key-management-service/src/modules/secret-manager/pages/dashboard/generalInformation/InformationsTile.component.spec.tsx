import React from 'react';
import { describe } from 'vitest';
import { screen, render } from '@testing-library/react';
import { secretsMock } from '@secret-manager/mocks/secrets/secrets.mock';
import { InformationsTile } from './InformationsTile.component';

const mockSecret = secretsMock[0];

describe('Secrets Informations Tile component tests suite', () => {
  test('Should display settings tile with all data', async () => {
    const { container } = render(<InformationsTile secret={mockSecret} />);

    const labelList = [
      'secret-manager/dashboard:general_information',
      'path',
      mockSecret.path,
      'urn',
      'creation_date',
      '15/01/2023, 09:30',
      'secret-manager/dashboard:last_update',
      '15/01/2023, 21:30',
    ];

    labelList.forEach((label) => {
      expect(screen.getByText(label)).toBeVisible();
    });

    expect(
      container.querySelector(`ods-clipboard[value="${mockSecret.iam.urn}"]`),
    ).toBeVisible();
  });
});

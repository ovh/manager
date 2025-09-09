import React from 'react';
import { describe, vi } from 'vitest';
import { screen, render } from '@testing-library/react';
import { secretsMock } from '@secret-manager/mocks/secrets/secrets.mock';
import { InformationsTile } from './InformationsTile.component';
import { PATH_LABEL, URN_LABEL } from '@/constants';

const mockSecret = secretsMock[0];

const mockFormatDate = vi.fn((date: string) => date);
vi.mock('@/common/hooks/useFormatDate', () => ({
  useFormatDate: () => ({
    formatDate: mockFormatDate,
  }),
}));

describe('Secrets Informations Tile component tests suite', () => {
  test('Should display settings tile with all data', async () => {
    const { container } = render(<InformationsTile secret={mockSecret} />);

    const labelList = [
      'general_information',
      PATH_LABEL,
      mockSecret.path,
      URN_LABEL,
      'creation_date',
      mockSecret.metadata.createdAt,
      'last_update',
      mockSecret.metadata.updatedAt,
    ];

    labelList.forEach((label) => {
      expect(screen.getByText(label)).toBeVisible();
    });

    expect(
      container.querySelector(`ods-clipboard[value="${mockSecret.iam.urn}"]`),
    ).toBeVisible();

    expect(mockFormatDate).toHaveBeenCalledWith(mockSecret.metadata.createdAt);
    expect(mockFormatDate).toHaveBeenCalledWith(mockSecret.metadata.updatedAt);
  });
});

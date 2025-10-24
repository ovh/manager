import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { mockVaults } from '@/mocks/vaults/vaults';
import { ResourceStatus } from '@/types/Resource.type';

import { ResourceStatusCell } from '../ResourceStatusCell.component';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe('ResourceStatusCell', () => {
  it.each([['READY'], ['ERROR']])(
    'renders vaults with status %s correctly in lowercase',
    (status) => {
      const vault = { ...mockVaults[0]!, resourceStatus: status as ResourceStatus };

      render(<ResourceStatusCell {...vault} />);

      const badge = screen.getByTestId('badge');
      expect(badge).toHaveAttribute('label', vault.resourceStatus.toLowerCase());
    },
  );
});

import React from 'react';

import { waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { mockVaults } from '@/mocks/vaults/vaults.mock';
import { renderTest } from '@/test-utils/Test.utils';

vi.mock('@ovhcloud/ods-react', () => ({
  Button: vi.fn(({ children, ...props }) => <button {...props}>{children}</button>),
  Link: vi.fn(({ children, href, ...props }: React.ComponentPropsWithoutRef<'a'>) => (
    <a href={href} {...props}>
      {children}
    </a>
  )),
}));

describe('[INTEGRATION] - Listing page', () => {
  it('Listing page display datagrid', async () => {
    const { container } = await renderTest({ initialRoute: '/vaults' });

    await waitFor(
      () => {
        expect(
          container.querySelector(`ods-link[label="${mockVaults[0]!.currentState.name}"]`),
        ).toBeVisible();
      },
      { timeout: 10_000 },
    );
  });
});

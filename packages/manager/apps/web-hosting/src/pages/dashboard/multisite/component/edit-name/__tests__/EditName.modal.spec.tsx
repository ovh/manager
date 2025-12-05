import { render } from '@testing-library/react';
import { vi } from 'vitest';

import { wrapper } from '@/utils/test.provider';

import EditNameModal from '../EditName.modal';

vi.mock('@ovh-ux/muk', () => ({
  UpdateNameModal: ({
    children,
    headline,
    ...props
  }: React.PropsWithChildren<{ headline?: string; [key: string]: unknown }>) => (
    <div data-testid="update-name-modal" {...props}>
      {headline && <div>{headline}</div>}
      {children}
    </div>
  ),
  useNotifications: vi.fn(() => ({
    addSuccess: vi.fn(),
    addError: vi.fn(),
    addWarning: vi.fn(),
    addInfo: vi.fn(),
  })),
}));

describe('EditName page', () => {
  it('Page for update', () => {
    const { getByTestId } = render(<EditNameModal />, { wrapper });
    expect(getByTestId('update-name-modal')).not.toBeNull();
  });
});

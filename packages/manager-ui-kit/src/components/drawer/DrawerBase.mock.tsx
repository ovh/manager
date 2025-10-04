import { vi } from 'vitest';
import { DrawerBaseProps } from './DrawerBase.component';

vi.mock('@ovhcloud/ods-components/react', async () => {
  const original = await vi.importActual('@ovhcloud/ods-components/react');
  return {
    ...original,
    OdsDrawer: vi.fn(({ children, className, ...props }) => (
      <div data-testid={props['data-testid']} className={className}>
        {children}
      </div>
    )),
  };
});

export const mockedProps: DrawerBaseProps = {
  heading: 'Drawer heading',
  isOpen: true,
  children: <div>Drawer content</div>,
  primaryButtonLabel: 'Confirm',
  isPrimaryButtonLoading: false,
  isPrimaryButtonDisabled: false,
  onPrimaryButtonClick: vi.fn(),
  secondaryButtonLabel: 'Cancel',
  isSecondaryButtonDisabled: false,
  isSecondaryButtonLoading: false,
  onSecondaryButtonClick: vi.fn(),
  onDismiss: vi.fn(),
};

import { vi } from 'vitest';

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

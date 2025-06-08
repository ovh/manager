import React from 'react';
import { vi } from 'vitest';
import { waitFor, screen, fireEvent, render } from '@testing-library/react';
import { ODS_ICON_NAME, ODS_POPOVER_POSITION } from '@ovhcloud/ods-components';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ActionMenu, ActionMenuProps } from './Action.component';

const mocks = vi.hoisted(() => ({
  useAuthorizationIam: vi.fn(),
}));

vi.mock('@ovh-ux/manager-react-components', async (importOriginal) => {
  const originalModule: typeof import('@ovh-ux/manager-react-components') = await importOriginal();
  return {
    ...originalModule,
    useAuthorizationIam: mocks.useAuthorizationIam,
  };
});

const actionItems: ActionMenuProps = {
  id: 'action-menu-test-id',
  items: [
    {
      id: 1,
      onClick: () => window.open('/'),
      label: 'Action 1',
      urn: 'urn:v18:eu:resource:m--components:vrz-a878-dsflkds-fdsfdsfdsf',
      iamActions: ['vrackServices:apiovh:iam/resource/tag/remove'],
    },
    {
      id: 2,
      onClick: () => window.open('/'),
      label: 'Action 2',
      urn: 'urn:v18:eu:resource:m--components:vrz-a878-dsflkds-fdsfdsfdsf',
      iamActions: ['vrackServices:apiovh:iam/resource/tag/remove'],
    },
  ],
};
const queryClient = new QueryClient();

const setupSpecTest = async (customProps?: Partial<ActionMenuProps>) =>
  render(
    <QueryClientProvider client={queryClient}>
      <ActionMenu {...actionItems} {...customProps} />
    </QueryClientProvider>,
  );

describe('ActionMenu', () => {
  it('renders menu actions correctly', async () => {
    mocks.useAuthorizationIam.mockReturnValue({
      isAuthorized: true,
      isLoading: true,
      isFetched: true,
    });
    await setupSpecTest();

    const actionMenuIcon = screen.getByTestId(
      'navigation-action-trigger-action',
    );
    fireEvent.click(actionMenuIcon);

    // Wait for the button text to update
    await waitFor(() => {
      const action1 = screen.getAllByTestId(
        'manager-button-without-tooltip',
      )[0];
      const action2 = screen.getAllByTestId(
        'manager-button-without-tooltip',
      )[1];
      expect(action1).toBeInTheDocument();
      expect(action2).toBeInTheDocument();
      expect(actionMenuIcon.getAttribute('icon')).toBe('chevron-down');
    });
  });

  it('renders compact menu with classic ellipsis correctly', async () => {
    await setupSpecTest({ isCompact: true });
    const actionMenuIcon = screen.getByTestId(
      'navigation-action-trigger-action',
    );
    expect(actionMenuIcon.getAttribute('icon')).toBe('ellipsis-vertical');
  });

  it('renders compact menu with custom icon menu correctly', async () => {
    await setupSpecTest({
      icon: ODS_ICON_NAME.ellipsisHorizontal,
    });
    const actionMenuIcon = screen.getByTestId(
      'navigation-action-trigger-action',
    );
    expect(actionMenuIcon.getAttribute('icon')).toBe('ellipsis-horizontal');
  });

  it('renders compact menu with popover position bottom-end', async () => {
    await setupSpecTest({
      popoverPosition: ODS_POPOVER_POSITION.bottomEnd,
    });
    const popover = screen.getByTestId(
      'navigation-action-trigger-action-popover',
    );
    expect(popover.getAttribute('position')).toBe('bottom-end');
  });
});

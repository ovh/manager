import { vitest } from 'vitest';
import type { MockInstance } from 'vitest';
import { act, waitFor, screen, fireEvent } from '@testing-library/react';
import { POPOVER_POSITION, ICON_NAME } from '@ovhcloud/ods-react';
import { ActionMenu, ActionMenuProps } from '../index';
import { render } from '@/setupTest';
import { useAuthorizationIam } from '../../../hooks/iam';

vitest.mock('../../../hooks/iam');

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
    {
      id: 3,
      href: 'https://www.ovhcloud.com',
      target: '_blank',
      label: 'external link',
    },
    {
      id: 4,
      href: `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify({ name: 'john' }),
      )}`,
      download: 'test.json',
      target: '_blank',
      label: 'download',
    },
    {
      id: 5,
      href: 'https://ovhcloud.com',
      target: '_blank',
      label: 'disabled link',
      isDisabled: true,
    },
  ],
};

const setupSpecTest = (customProps?: Partial<ActionMenuProps>) =>
  render(
    <div data-testid="navigation-action-trigger-action">
      <ActionMenu {...actionItems} {...customProps} />
    </div>,
  );

const mockedHook = useAuthorizationIam as unknown as MockInstance;

describe('ActionMenu', () => {
  beforeEach(() => {
    vitest.clearAllMocks();
    mockedHook.mockReturnValue({
      isAuthorized: true,
      isLoading: true,
      isFetched: true,
    });
  });

  it('renders menu actions correctly', () => {
    const { container } = setupSpecTest();

    act(() => {
      const actionMenuIcon = screen.getByTestId(
        'navigation-action-trigger-action',
      );
      fireEvent.click(actionMenuIcon);
    });

    const action1 = screen.getAllByTestId('manager-button')[0];
    const action2 = screen.getAllByTestId('manager-button')[1];
    expect(action1).toBeInTheDocument();
    expect(action2).toBeInTheDocument();
    expect(screen.getAllByTestId('manager-button').length).toBe(2);
    const icon = container.querySelector('span[class*="chevron-down"]');
    expect(icon).toBeInTheDocument();
  });

  it('renders compact menu with classic ellipsis correctly', () => {
    const { container } = setupSpecTest({ isCompact: true });
    const icon = container.querySelector('span[class*="ellipsis-vertical"]');
    expect(icon).toBeInTheDocument();
  });

  it('renders compact menu with custom icon menu correctly', async () => {
    const { container } = setupSpecTest({
      icon: ICON_NAME.ellipsisHorizontal,
    });
    const icon = container.querySelector('span[class*="ellipsis-horizontal"]');
    expect(icon).toBeInTheDocument();
  });

  it('renders compact menu with popover position right', () => {
    const { container } = setupSpecTest({
      popoverPosition: POPOVER_POSITION.right,
    });

    act(() => {
      const actionMenuIcon = screen.getByTestId(
        'navigation-action-trigger-action',
      );
      fireEvent.click(actionMenuIcon);
    });
    waitFor(() => {
      const popoverPosition = container.parentElement?.querySelector(
        'div[data-scope="popover"]',
      );
      expect(popoverPosition?.children[0].getAttribute('data-placement')).toBe(
        'right',
      );
    });
  });
});

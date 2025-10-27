import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { ICON_NAME, POPOVER_POSITION } from '@ovhcloud/ods-react';

import { buildIamMock, mockUseAuthorizationIam } from '@/commons/tests-utils/Mock.utils';
import { renderActionMenu } from '@/commons/tests-utils/Render.utils';

describe('ActionMenu', () => {
  beforeEach(() => {
    mockUseAuthorizationIam.mockReturnValue(buildIamMock());
  });

  it('renders menu actions correctly', () => {
    const { container } = renderActionMenu();

    act(() => {
      const trigger = screen.getByTestId('navigation-action-trigger-action');
      fireEvent.click(trigger);
    });

    const buttons = screen.getAllByTestId('manager-button');
    expect(buttons).toHaveLength(2);
    expect(buttons[0]).toBeInTheDocument();
    expect(buttons[1]).toBeInTheDocument();

    const icon = container.querySelector('span[class*="chevron-down"]');
    expect(icon).toBeInTheDocument();
  });

  it('renders compact menu with classic ellipsis correctly', () => {
    const { container } = renderActionMenu({ isCompact: true });
    const icon = container.querySelector('span[class*="ellipsis-vertical"]');
    expect(icon).toBeInTheDocument();
  });

  it('renders compact menu with custom icon menu correctly', () => {
    const { container } = renderActionMenu({
      icon: ICON_NAME.ellipsisHorizontal,
    });
    const icon = container.querySelector('span[class*="ellipsis-horizontal"]');
    expect(icon).toBeInTheDocument();
  });

  it('renders compact menu with popover position right', async () => {
    const { container } = renderActionMenu({
      popoverPosition: POPOVER_POSITION.right,
    });

    act(() => {
      const trigger = screen.getByTestId('navigation-action-trigger-action');
      fireEvent.click(trigger);
    });

    await waitFor(() => {
      const popover = container.parentElement?.querySelector('div[data-scope="popover"]');
      expect(popover?.children[0].getAttribute('data-placement')).toBe('right');
    });
  });

  it('renders correctly when IAM is loading', () => {
    mockUseAuthorizationIam.mockReturnValue(
      buildIamMock({
        isAuthorized: false,
        isLoading: true, // ✅ no isFetched here
      }),
    );

    const { container } = renderActionMenu();
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders correctly when IAM is unauthorized', () => {
    mockUseAuthorizationIam.mockReturnValue(
      buildIamMock({
        isAuthorized: false,
        data: {
          urn: 'urn:v18:eu:resource:m--components:test',
          authorizedActions: [],
          unauthorizedActions: ['vrackServices:apiovh:iam/resource/tag/remove'],
        },
      }),
    );

    const { container } = renderActionMenu();
    expect(container.firstChild).toBeInTheDocument();
  });
});

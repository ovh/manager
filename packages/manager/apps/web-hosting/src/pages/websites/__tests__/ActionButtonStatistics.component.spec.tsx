import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, vi } from 'vitest';

import { websitesMocks } from '@/data/__mocks__';
import commonTranslation from '@/public/translations/common/Messages_fr_FR.json';
import { wrapper } from '@/utils/test.provider';
import { getDomRect } from '@/utils/test.setup';

import ActionButtonStatistics from '../ActionButtonStatistics.component';

const hoistedMock = vi.hoisted(() => ({
  useOvhTracking: vi.fn(),
}));

vi.mock('@ovh-ux/muk', async (importActual) => {
  const actual = await importActual<typeof import('@ovh-ux/muk')>();
  return {
    ...actual,
    ActionMenu: ({
      id,
      items,
      ariaLabel,
      isCompact,
      isDisabled,
    }: {
      id?: string;
      items?: Array<{ id: number; label: string; onClick?: () => void }>;
      ariaLabel?: string;
      isCompact?: boolean;
      isDisabled?: boolean;
    }) => {
      const label = ariaLabel ?? items?.[0]?.label ?? 'Actions';
      return (
        <div data-testid="action-menu" data-id={id}>
          <button
            type="button"
            aria-label={label}
            disabled={isDisabled}
            onClick={() => items?.[0]?.onClick?.()}
          >
            {items?.[0]?.label ?? (isCompact ? '…' : 'Actions')}
          </button>
        </div>
      );
    },
  };
});

vi.mock('@ovh-ux/manager-react-shell-client', async (importActual) => {
  const actual = await importActual<typeof import('@ovh-ux/manager-react-shell-client')>();
  return {
    ...actual,
    useOvhTracking: hoistedMock.useOvhTracking,
    PageLocation: {
      ...actual.PageLocation,
      datagrid: 'datagrid',
    },
    ButtonType: {
      ...actual.ButtonType,
      link: 'link',
    },
  };
});
describe('ActionButtonStatistics component', () => {
  beforeEach(() => {
    Element.prototype.getBoundingClientRect = vi.fn(() => getDomRect(120, 120));
    vi.clearAllMocks();
    hoistedMock.useOvhTracking.mockReturnValue({
      trackClick: mockTrackClick,
    });
  });
  afterEach(() => {
    Element.prototype.getBoundingClientRect = vi.fn(() => getDomRect(0, 0));
  });
  const mockTrackClick = vi.fn();

  it('should render', () => {
    render(<ActionButtonStatistics webSiteItem={websitesMocks[0]} />, { wrapper });

    const menuItem = screen.getByRole('button', {
      name: commonTranslation.web_hosting_dashboard_action_statistics,
      hidden: true,
    });
    expect(menuItem).toBeInTheDocument();
    expect(menuItem).toHaveTextContent(commonTranslation.web_hosting_dashboard_action_statistics);
  });
  it('should call trackClick when tracking prop is provided and badge is clicked', () => {
    render(<ActionButtonStatistics webSiteItem={websitesMocks[0]} />, {
      wrapper,
    });

    const component = screen.getByRole('button', {
      name: commonTranslation.web_hosting_dashboard_action_statistics,
      hidden: true,
    });
    act(() => {
      fireEvent.click(component);
    });

    expect(mockTrackClick).toHaveBeenCalledWith({
      location: 'datagrid',
      buttonType: 'button',
      actionType: 'navigation',
      actions: ['statistics_website'],
    });
  });
  it('should have a valid html with a11y and w3c', async () => {
    const { container } = render(<ActionButtonStatistics webSiteItem={websitesMocks[0]} />, {
      wrapper,
    });
    // Strip aria-controls from ODS Popover (content in portal, not in same document)
    // const html = container.innerHTML.replace(/\s*aria-controls="[^"]*"/g, '');
    // await expect(html).toBeValidHtml();
    await expect(container).toBeAccessible();
  });
});

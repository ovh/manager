import { act, fireEvent, render } from '@testing-library/react';
import { describe, expect } from 'vitest';

import { websitesMocks } from '@/data/__mocks__';
import commonTranslation from '@/public/translations/common/Messages_fr_FR.json';
import { wrapper } from '@/utils/test.provider';

import ActionButtonStatistics from '../ActionButtonStatistics.component';

const hoistedMock = vi.hoisted(() => ({
  useOvhTracking: vi.fn(),
}));

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
  const mockTrackClick = vi.fn();
  beforeEach(() => {
    hoistedMock.useOvhTracking.mockReturnValue({
      trackClick: mockTrackClick,
      trackPage: vi.fn(),
      trackCurrentPage: vi.fn(),
    });
    mockTrackClick.mockClear();
  });

  it('should render', () => {
    const { getByTestId } = render(<ActionButtonStatistics webSiteItem={websitesMocks[0]} />, {
      wrapper,
    });

    const actionMenu = getByTestId('action-menu');
    expect(actionMenu).toBeInTheDocument();

    const menuItem = getByTestId('action-item-1');
    expect(menuItem).toBeInTheDocument();
    expect(menuItem).toHaveTextContent(commonTranslation.web_hosting_dashboard_action_statistics);
  });
  it('should call trackClick when tracking prop is provided and badge is clicked', () => {
    const { getByTestId } = render(<ActionButtonStatistics webSiteItem={websitesMocks[0]} />, {
      wrapper,
    });

    const component = getByTestId('action-item-1');
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
});

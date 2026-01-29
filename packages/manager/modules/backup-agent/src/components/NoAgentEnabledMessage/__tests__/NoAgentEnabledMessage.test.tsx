import { render, screen } from '@testing-library/react';

import { urls } from '@/routes/routes.constants';
import { LinksMock } from '@/test-utils/mocks/manager-react-components';
import { OdsMessageMock } from '@/test-utils/mocks/ods-components';
import { TransMock, useTranslationMock } from '@/test-utils/mocks/react-i18next';
import { useLocationMock } from '@/test-utils/mocks/react-router-dom';

import { NoAgentEnabledMessage } from '../NoAgentEnabledMessage.component';

vi.mock('react-i18next', () => ({
  useTranslation: useTranslationMock,
  Trans: TransMock,
}));

vi.mock('@ovhcloud/ods-components/react', () => ({
  OdsMessage: OdsMessageMock,
}));

vi.mock('@ovh-ux/manager-react-components', () => ({
  Links: LinksMock,
}));

const useQueryMock = vi.fn();
vi.mock('@tanstack/react-query', () => ({
  useQuery: (...args: unknown[]) => useQueryMock(...args),
  useQueryClient: vi.fn(),
}));

vi.mock('@/data/queries/agents.queries', () => ({
  agentsQueries: {
    withClient: () => ({
      list: () => ({ queryKey: ['agents'], queryFn: vi.fn() }),
    }),
  },
}));

vi.mock('@/data/selectors/agents.selectors', () => ({
  selectHasAgentEnabled: vi.fn(),
}));

const useGuideUtilsMock = vi.fn();
vi.mock('@/hooks/useGuideUtils', () => ({
  useGuideUtils: () => useGuideUtilsMock(),
}));

useLocationMock.mockReturnValue({ pathname: urls.dashboardTenant });
vi.mock('react-router-dom', () => ({
  useLocation: useLocationMock,
}));

let showBannerMock = true;
const setNoShowBannerMock = vi.fn();
vi.mock('@/hooks/useShowNoAgentEnabledMessage', () => ({
  useShowNoAgentEnabledMessage: () => ({
    showBanner: showBannerMock,
    setNoShowBanner: setNoShowBannerMock,
  }),
}));

describe('NoAgentEnabledMessage', () => {
  it('should not render when isPending is true', () => {
    useQueryMock.mockReturnValue({ isPending: true, data: false });

    const { container } = render(<NoAgentEnabledMessage />);
    expect(container).toBeEmptyDOMElement();
  });

  it('should not render when data is true (agent enabled) and not pending', () => {
    useQueryMock.mockReturnValue({ isPending: false, data: true });

    const { container } = render(<NoAgentEnabledMessage />);
    expect(container).toBeEmptyDOMElement();
  });

  it('should not render when not in a "/services/**" pages', () => {
    useLocationMock.mockReturnValue({ pathname: urls.listingVaults });
    useQueryMock.mockReturnValue({ isPending: false, data: false });

    render(<NoAgentEnabledMessage />);

    const { container } = render(<NoAgentEnabledMessage />);
    expect(container).toBeEmptyDOMElement();
  });

  it('should render message and call setNoShowBanner onOdsRemove click', () => {
    const guideUrl = 'http://guide-url';
    useGuideUtilsMock.mockReturnValue({ agent: guideUrl });
    useLocationMock.mockReturnValue({ pathname: urls.dashboardTenant });

    render(<NoAgentEnabledMessage />);
    expect(screen.getByTestId('trans-no_agent_enabled_banner')).toBeInTheDocument();

    const link = screen.getByTestId('link');
    expect(link).toHaveAttribute('href', guideUrl);

    const odsMessage = screen.getByTestId('ods-message-remove-button');
    odsMessage.click();

    expect(setNoShowBannerMock).toHaveBeenCalled();
  });

  it('should not render when showBanner is false', () => {
    showBannerMock = false;

    const { container } = render(<NoAgentEnabledMessage />);
    expect(container).toBeEmptyDOMElement();
  });
});

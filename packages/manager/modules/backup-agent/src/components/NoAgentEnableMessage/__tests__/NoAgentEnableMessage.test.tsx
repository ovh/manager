import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { LinksMock } from '@/test-utils/mocks/manager-react-components';
import { OdsMessageMock } from '@/test-utils/mocks/ods-components';
import { TransMock, useTranslationMock } from '@/test-utils/mocks/react-i18next';
import { useLocationMock } from '@/test-utils/mocks/react-router-dom';

import { NoAgentEnableMessage } from '../NoAgentEnableMessage.component';

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

const useHasAgentEnabledMock = vi.fn();
vi.mock('@/data/hooks/agents/useHasAgentEnabled', () => ({
  useHasAgentEnabled: () => useHasAgentEnabledMock(),
}));

const useGuideUtilsMock = vi.fn();
vi.mock('@/hooks/useGuideUtils', () => ({
  useGuideUtils: () => useGuideUtilsMock(),
}));

useLocationMock.mockReturnValue({ pathname: '/services' });
vi.mock('react-router-dom', () => ({
  useLocation: useLocationMock,
}));

describe('NoAgentEnableMessage', () => {
  it('should render nothing when isPending is true', () => {
    useHasAgentEnabledMock.mockReturnValue({ isPending: true, data: true });
    useGuideUtilsMock.mockReturnValue({ agent: 'http://guide-url' });

    const { container } = render(<NoAgentEnableMessage />);
    expect(container).toBeEmptyDOMElement();
  });

  it('should render nothing when data is true (agent enabled)', () => {
    useHasAgentEnabledMock.mockReturnValue({ isPending: false, data: true });
    useGuideUtilsMock.mockReturnValue({ agent: 'http://guide-url' });
    useLocationMock.mockReturnValue({ pathname: '/' });

    const { container } = render(<NoAgentEnableMessage />);
    expect(container).toBeEmptyDOMElement();
  });

  it('should render message when no agent is enabled and not pending', () => {
    useHasAgentEnabledMock.mockReturnValue({ isPending: false, data: true });
    useGuideUtilsMock.mockReturnValue({ agent: 'http://guide-url' });
    useLocationMock.mockReturnValue({ pathname: '/services' });

    render(<NoAgentEnableMessage />);

    expect(screen.getByTestId('trans-no_agent_enabled_banner')).toBeInTheDocument();
    const link = screen.getByTestId('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'http://guide-url');
  });
});

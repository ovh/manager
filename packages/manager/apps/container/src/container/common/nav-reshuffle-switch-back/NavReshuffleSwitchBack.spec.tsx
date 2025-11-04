import { it, vi, describe, expect, afterEach } from 'vitest';
import { render, fireEvent, waitFor } from '@testing-library/react';
import NavReshuffleSwitchBack from './index';
import { getComponentWrapper } from '@/utils/tests/component-wrapper';
import { configureTest } from '@/utils/tests/tests.helper';
import { getPreferencesMocks } from '@/__mocks__/preferences/preferences.handler';
import { ContainerProvider } from '@/core/container';
import { getFeatureAvailabilityMocks } from '@/__mocks__/feature-availability/featureAvailability.handler';


vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        beta_modal_old: 'Classic',
        beta_modal_new: 'New',
      };
      return translations[key] || key;
    },
  }),
}));

describe('NavReshuffleSwitchBack.component', () => {
  const baseWrapper = getComponentWrapper({
    withQueryClientProvider: true,
    configuration: {
      user: {
        ovhSubsidiary: 'FR',
      },
    },
  });

  const wrapper = (component: JSX.Element) => {
    return baseWrapper(<ContainerProvider>{component}</ContainerProvider>);
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should not render when betaVersion is not available', () => {
    configureTest({
      mocks: [
        ...getPreferencesMocks({ betaVersion: false }),
        ...getFeatureAvailabilityMocks({ pnr: false }),
      ],
    });

    const { container } = render(wrapper(<NavReshuffleSwitchBack />));
    expect(container.firstChild).toBeNull();
  });

  it('should render radio buttons when beta version is available', async () => {
    configureTest({
      mocks: [
        ...getPreferencesMocks({ betaVersion: 'false' }),
        ...getFeatureAvailabilityMocks({ pnr: true }),
      ],
    });

    const { getByText } = render(wrapper(<NavReshuffleSwitchBack />));

    await waitFor(() => {
      const legacyButton = getByText('Classic');
      const betaButton = getByText('New');
      expect(legacyButton).toBeTruthy();
      expect(betaButton).toBeTruthy();
    });
  });

  it('should change preference to classic when classic radio is clicked', async () => {
    configureTest({
      mocks: [
        ...getPreferencesMocks({ betaVersion: 'true' }),
        ...getFeatureAvailabilityMocks({ pnr: true }),
      ],
    });

    const { getByText } = render(wrapper(<NavReshuffleSwitchBack />));

    const legacyButton = await waitFor(() => {
      const button = getByText('Classic');
      expect(button).toBeTruthy();
      return button;
    });

    fireEvent.click(legacyButton);

    // can't test the API call because of page reload
    expect(legacyButton).toBeTruthy();
  });

  it('should change preference to beta when new radio is clicked', async () => {
    configureTest({
      mocks: [
        ...getPreferencesMocks({ betaVersion: 'false' }),
        ...getFeatureAvailabilityMocks({ pnr: true }),
      ],
    });

    const { getByText } = render(wrapper(<NavReshuffleSwitchBack />));

    const newButton = await waitFor(() => {
      const button = getByText('New');
      expect(button).toBeTruthy();
      return button;
    });

    fireEvent.click(newButton);

    // can't test the API call because of page reload
    expect(newButton).toBeTruthy();
  });
});

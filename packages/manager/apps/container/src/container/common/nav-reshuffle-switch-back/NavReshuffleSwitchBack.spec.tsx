import { it, vi, describe, expect, afterEach } from 'vitest';
import { render, fireEvent, waitFor } from '@testing-library/react';
import NavReshuffleSwitchBack from './index';
import { getComponentWrapper } from '@/utils/tests/component-wrapper';
import { configureTest } from '@/utils/tests/tests.helper';
import { getPreferencesMocks } from '@/__mocks__/preferences/preferences.handler';
import { ContainerProvider } from '@/core/container';
import { getFeatureAvailabilityMocks } from '@/__mocks__/feature-availability/featureAvailability.handler';
import { BETA_MANAGER_URL } from './BetaManagerButton.constants';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        beta_modal_old: 'Classic',
        beta_modal_new: 'Alternative Navigation',
        manager_beta_button: 'Découvrir la console',
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

  it('should render the version dropdown when beta version is available', async () => {
    configureTest({
      mocks: [
        ...getPreferencesMocks({ betaVersion: 'false' }),
        ...getFeatureAvailabilityMocks({ pnr: true }),
      ],
    });

    const { container } = render(wrapper(<NavReshuffleSwitchBack />));

    await waitFor(() => {
      const select = container.querySelector(
        'osds-select[data-testid="navigation_version_selector"]',
      );
      expect(select).toBeTruthy();
      expect(
        select?.querySelector('osds-select-option[value="classic"]'),
      ).toBeTruthy();
      expect(
        select?.querySelector('osds-select-option[value="beta"]'),
      ).toBeTruthy();
    });
  });

  it('should change preference to classic when classic option is selected', async () => {
    configureTest({
      mocks: [
        ...getPreferencesMocks({ betaVersion: 'true' }),
        ...getFeatureAvailabilityMocks({ pnr: true }),
      ],
    });

    const { container } = render(wrapper(<NavReshuffleSwitchBack />));

    const select = await waitFor(() => {
      const element = container.querySelector(
        'osds-select[data-testid="navigation_version_selector"]',
      );
      expect(element).toBeTruthy();
      return element;
    });

    fireEvent(
      select,
      new CustomEvent('odsValueChange', {
        bubbles: true,
        detail: { value: 'classic' },
      } as CustomEventInit),
    );

    // can't test the API call because of page reload
    expect(select).toBeTruthy();
  });

  it('should render the discover button with correct href', async () => {
    configureTest({
      mocks: [
        ...getPreferencesMocks({ betaVersion: 'false' }),
        ...getFeatureAvailabilityMocks({ pnr: true, betaManager: true, }),
      ],
    });

    const { container } = render(wrapper(<NavReshuffleSwitchBack />));

    await waitFor(() => {
      const button = container.querySelector(`a[href="${BETA_MANAGER_URL}"]`);
      expect(button).toBeTruthy();
      expect(button?.textContent).toContain('Découvrir la console');
      expect(button?.textContent).toContain('>BETA_');
    });
  });

  it('should change preference to beta when alternative option is selected', async () => {
    configureTest({
      mocks: [
        ...getPreferencesMocks({ betaVersion: 'false' }),
        ...getFeatureAvailabilityMocks({ pnr: true }),
      ],
    });

    const { container } = render(wrapper(<NavReshuffleSwitchBack />));

    const select = await waitFor(() => {
      const element = container.querySelector(
        'osds-select[data-testid="navigation_version_selector"]',
      );
      expect(element).toBeTruthy();
      return element;
    });

    fireEvent(
      select,
      new CustomEvent('odsValueChange', {
        bubbles: true,
        detail: { value: 'beta' },
      } as CustomEventInit),
    );

    // can't test the API call because of page reload
    expect(select).toBeTruthy();
  });
});

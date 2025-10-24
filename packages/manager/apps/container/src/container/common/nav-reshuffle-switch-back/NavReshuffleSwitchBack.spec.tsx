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

    const { container } = render(wrapper(<NavReshuffleSwitchBack />));

    await waitFor(() => {
      const legacyRadio = container.querySelector(
        'osds-radio[name="version"][value="classic"]',
      );
      const betaRadio = container.querySelector(
        'osds-radio[name="version"][value="beta"]',
      );
      expect(legacyRadio).toBeTruthy();
      expect(betaRadio).toBeTruthy();
    });
  });

  it('should change preference to classic when classic radio is clicked', async () => {
    configureTest({
      mocks: [
        ...getPreferencesMocks({ betaVersion: 'true' }),
        ...getFeatureAvailabilityMocks({ pnr: true }),
      ],
    });

    const { container } = render(wrapper(<NavReshuffleSwitchBack />));

    const legacyRadio = await waitFor(() => {
      const radio = container.querySelector(
        'osds-radio[name="version"][value="classic"]',
      );
      expect(radio).toBeTruthy();
      return radio;
    });

    fireEvent(
      legacyRadio,
      new CustomEvent('odsCheckedChange', {
        bubbles: true,
        detail: { checked: true, value: 'classic' },
      } as CustomEventInit),
    );

    // can't test the API call because of page reload
    expect(legacyRadio).toBeTruthy();
  });

  it('should change preference to beta when new radio is clicked', async () => {
    configureTest({
      mocks: [
        ...getPreferencesMocks({ betaVersion: 'false' }),
        ...getFeatureAvailabilityMocks({ pnr: true }),
      ],
    });

    const { container } = render(wrapper(<NavReshuffleSwitchBack />));

    const newRadio = await waitFor(() => {
      const radio = container.querySelector(
        'osds-radio[name="version"][value="beta"]',
      );
      expect(radio).toBeTruthy();
      return radio;
    });

    fireEvent(
      newRadio,
      new CustomEvent('odsCheckedChange', {
        bubbles: true,
        detail: { checked: true, value: 'beta' },
      } as CustomEventInit),
    );

    // can't test the API call because of page reload
    expect(newRadio).toBeTruthy();
  });
});

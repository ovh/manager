import { vi } from 'vitest';
import {
  mockPciCommon,
  mockReactComponents,
  mockSections,
  mockHooks,
  mockConstants,
  mockI18n,
} from './index';

// Setup all mocks globally
export const setupAllMocks = () => {
  // Mock react-i18next
  vi.mock('react-i18next', () => mockI18n);

  // Mock @ovh-ux/manager-pci-common
  vi.mock('@ovh-ux/manager-pci-common', async (importOriginal) => {
    const actual = (await importOriginal()) as Record<string, unknown>;
    return {
      ...actual,
      ...mockPciCommon,
    };
  });

  // Mock @ovh-ux/manager-react-components
  vi.mock('@ovh-ux/manager-react-components', async (importOriginal) => {
    const actual = (await importOriginal()) as Record<string, unknown>;
    return {
      ...actual,
      ...mockReactComponents,
    };
  });

  // Mock component sections
  vi.mock(
    '@/pages/home/edit/general-information-section/GeneralInformationSection',
    () => ({
      default: mockSections.GeneralInformationSection,
    }),
  );

  vi.mock('@/pages/home/edit/hds-section/HdsSection', () => ({
    default: mockSections.HdsSection,
  }));

  vi.mock('@/pages/home/edit/remove-section/RemoveSection', () => ({
    default: mockSections.RemoveSection,
  }));

  // Mock hooks
  vi.mock('@/hooks/useTabs/useTabs', () => ({
    useTabs: mockHooks.useTabs,
  }));

  vi.mock('@/hooks/useActivationUrl', () => ({
    useActivationUrl: mockHooks.useActivationUrl,
  }));

  vi.mock('@/pages/home/edit/hds-section/useHds', () => ({
    useIsHdsFeatureAvailabilityEnabled:
      mockHooks.useIsHdsFeatureAvailabilityEnabled,
    useIsAValidHdsSupportLevel: mockHooks.useIsAValidHdsSupportLevel,
  }));

  // Mock constants
  vi.mock('@/constants', () => mockConstants);
};

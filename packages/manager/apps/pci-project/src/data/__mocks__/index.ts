/* eslint-disable @typescript-eslint/no-explicit-any */
import { vi } from 'vitest';
import React from 'react';
import { TProject } from '@ovh-ux/manager-pci-common';

// Mock project data
export const mockProject: TProject = {
  access: 'full',
  creationDate: '2023-01-01',
  description: 'Test Project',
  expiration: null,
  iam: { displayName: 'Test', id: 'iam-1', urn: 'urn', tags: {} },
  manualQuota: false,
  orderId: 123,
  planCode: 'plan',
  projectName: 'Test Project',
  project_id: 'project-1',
  status: 'ok',
  unleash: false,
};

// Mock discovery project data
export const mockDiscoveryProject: TProject = {
  ...mockProject,
  planCode: 'discovery',
};

// Mock functions
export const mockIsDiscoveryProject = vi.fn();
export const mockUseProject = vi.fn();
export const mockUseTabs = vi.fn();
export const mockUseProjectUrl = vi.fn();
export const mockUseIsHdsFeatureAvailabilityEnabled = vi.fn();
export const mockUseIsAValidHdsSupportLevel = vi.fn();
export const mockUseActivationUrl = vi.fn();
export const mockGoToActivation = vi.fn();
export const mockUseFeatureAvailability = vi.fn();

// Mock translation function
export const mockT = vi.fn((key: string, params?: Record<string, string>) => {
  const translations: Record<string, string> = {
    // QuickAccessCard translations
    pci_project_quick_access_card_aria_label: `Access ${params?.title} - ${params?.description}`,
    pci_project_quick_access_icon_alt: `${params?.service} icon`,
    pci_project_quick_access_link_aria_label: `Link to ${params?.description}`,

    // DiscoveryBanner translations
    pci_projects_project_banner_discovery_title:
      'pci_projects_project_banner_discovery_title',
    pci_projects_project_banner_discovery_message:
      'pci_projects_project_banner_discovery_message',
    pci_projects_project_banner_discovery_cta:
      'pci_projects_project_banner_discovery_cta',

    // DocumentationSection translations
    pci_project_documentation_section_title: 'Documentation',
    pci_project_documentation_section_description: 'Find help and resources',

    // Default fallback
    [key]: key,
  };
  return translations[key] || key;
});

// Setup default mocks
export const setupDefaultMocks = () => {
  mockUseProject.mockReturnValue({ data: mockProject });
  mockIsDiscoveryProject.mockReturnValue(false);
  mockUseIsHdsFeatureAvailabilityEnabled.mockReturnValue(true);
  mockUseIsAValidHdsSupportLevel.mockReturnValue(true);
  mockUseTabs.mockReturnValue([
    { label: 'Home', to: '/home' },
    { label: 'Edit', to: '/edit' },
  ]);
  mockUseProjectUrl.mockReturnValue({
    home: '/home',
    edit: '/edit',
  });
  mockUseActivationUrl.mockReturnValue({
    goToActivation: mockGoToActivation,
  });
  mockUseFeatureAvailability.mockReturnValue({
    data: { HDS: true },
  });
};

// Mock @ovh-ux/manager-pci-common
export const mockPciCommon = {
  isDiscoveryProject: (project: { planCode?: string } | null | undefined) =>
    project?.planCode === 'discovery',
  useProject: mockUseProject,
  TabsPanel: ({ tabs }: { tabs: Array<{ label: string; to: string }> }) =>
    React.createElement(
      'div',
      { 'data-testid': 'tabs-panel' },
      tabs.map((tab, index) =>
        React.createElement(
          'div',
          { key: index, 'data-testid': `tab-${index}` },
          tab.label,
        ),
      ),
    ),
};

// Mock @ovh-ux/manager-react-components
export const mockReactComponents = {
  useProjectUrl: mockUseProjectUrl,
  useFeatureAvailability: mockUseFeatureAvailability,
  BaseLayout: ({
    children,
    breadcrumb,
    header,
    tabs,
  }: {
    children: React.ReactNode;
    breadcrumb: React.ReactNode;
    header: {
      title?: string;
      badge?: { color: string; size: string; label: string };
      changelogButton?: React.ReactNode;
    };
    tabs: React.ReactNode;
  }) =>
    React.createElement(
      'div',
      { 'data-testid': 'base-layout' },
      React.createElement('div', { 'data-testid': 'breadcrumb' }, breadcrumb),
      React.createElement(
        'div',
        { 'data-testid': 'header' },
        JSON.stringify(header),
      ),
      React.createElement('div', { 'data-testid': 'tabs' }, tabs),
      React.createElement('div', { 'data-testid': 'content' }, children),
    ),
  // Mock React Router components
  Link: ({
    to,
    children,
    ...props
  }: {
    to: string;
    children: React.ReactNode;
    [key: string]: any;
  }) => React.createElement('a', { href: to, ...props }, children),
  ChangelogButton: ({
    links,
  }: {
    links: Array<{ href: string; label: string }>;
  }) =>
    React.createElement(
      'div',
      { 'data-testid': 'changelog-button' },
      `Changelog (${links.length} links)`,
    ),
  Notifications: () =>
    React.createElement(
      'div',
      { 'data-testid': 'notifications' },
      'Notifications',
    ),
};

// Mock component sections
export const mockSections = {
  GeneralInformationSection: ({
    isDiscovery,
    project,
  }: {
    isDiscovery: boolean;
    project: TProject;
  }) =>
    React.createElement(
      'div',
      {
        'data-testid': 'general-information-section',
        'data-discovery': isDiscovery,
        'data-project-id': project.project_id,
      },
      'General Information Section',
    ),
  HdsSection: ({ project }: { project: TProject }) =>
    React.createElement(
      'div',
      {
        'data-testid': 'hds-section',
        'data-project-id': project.project_id,
      },
      'HDS Section',
    ),
  RemoveSection: ({ isDiscovery }: { isDiscovery: boolean }) =>
    React.createElement(
      'div',
      {
        'data-testid': 'remove-section',
        'data-discovery': isDiscovery,
      },
      'Remove Section',
    ),
};

// Mock hooks
export const mockHooks = {
  useTabs: mockUseTabs,
  useIsHdsFeatureAvailabilityEnabled: mockUseIsHdsFeatureAvailabilityEnabled,
  useIsAValidHdsSupportLevel: mockUseIsAValidHdsSupportLevel,
  useActivationUrl: mockUseActivationUrl,
  useProject: mockUseProject,
  useProjectUrl: mockUseProjectUrl,
  useFeatureAvailability: mockUseFeatureAvailability,
};

// Mock constants
export const mockConstants = {
  ROADMAP_CHANGELOG_LINKS: [{ label: 'Test Link', href: 'https://test.com' }],
};

// Mock react-i18next
export const mockI18n = {
  useTranslation: () => ({
    t: mockT,
  }),
};

// Mock shell context
export const mockShellContext = {
  environment: {
    getUser: () => ({ ovhSubsidiary: 'FR' }),
    getRegion: () => 'EU',
  },
  shell: {
    navigation: {
      navigateTo: vi.fn(),
      getURL: vi.fn().mockResolvedValue('https://test.com'),
    },
  },
};

// Mock React Router
export const mockReactRouter = {
  useParams: vi.fn(),
  useNavigate: vi.fn(),
  Link: ({
    to,
    children,
    ...props
  }: {
    to: string;
    children: React.ReactNode;
    [key: string]: any;
  }) => React.createElement('a', { href: to, ...props }, children),
};

// Mock data for components
export const mockQuickAccessItem = {
  icon: 'test-icon.svg',
  title: 'Test Service',
  description: 'Create a new service',
  link: 'services/new',
};

export const mockDashboardSections = [
  {
    id: 'section1',
    title: 'Section 1',
    items: [
      {
        icon: 'icon1.svg',
        title: 'Item 1',
        description: 'Description 1',
        link: '/item1',
        label: 'Item 1',
      },
    ],
  },
  {
    id: 'section2',
    title: 'Section 2',
    items: [
      {
        icon: 'icon2.svg',
        title: 'Item 2',
        description: 'Description 2',
        link: '/item2',
        label: 'Item 2',
      },
    ],
  },
];

export const mockOtherActionItem = {
  icon: 'book' as const,
  label: 'Other action',
  link: '/other',
};

export const mockBottomSectionItem = {
  label: 'Billing Item',
  description: 'A billing item',
  link: '/billing',
  price: '$10',
  validUntil: 'Jan 1',
};

export const mockCommunityLinks = [
  {
    term: 'forum',
    href: 'https://community.example.com',
    description: 'Community forum',
    trackingName: 'forum',
  },
];

export const mockDocumentationLinks = [
  {
    term: 'getting_started',
    href: 'https://docs.example.com/start',
    description: 'Get started',
    trackingName: 'start',
  },
];

// Setup and clear mocks functions
export const setupAllMocks = () => {
  setupDefaultMocks();
};

export const clearAllMocks = () => {
  vi.clearAllMocks();
  setupDefaultMocks();
};

// Utilitaires de test centralisés pour pci-project-app
// Basé sur les bonnes pratiques du guide de test PCI Volume Backup

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ReactElement } from 'react';
import { vi } from 'vitest';
import { render, RenderOptions, renderHook } from '@testing-library/react';
import { TProject } from '@ovh-ux/manager-pci-common';
import { createOptimalWrapper, shellContext } from './lightweight-wrappers';

// ============================================================================
// TYPES POUR LES DONNÉES DE TEST
// ============================================================================

export type TMockProject = {
  id: string;
  description: string;
  aggregatedStatus: string;
  project_id: string;
  planCode: string;
  isDefault: boolean;
  status: string;
  creationDate: string;
  lastUpdate: string;
};

export type TMockUser = {
  ovhSubsidiary: string;
  nichandle: string;
  email: string;
};

// ============================================================================
// DONNÉES DE TEST CENTRALISÉES
// ============================================================================

export const MOCKED_PROJECT_ID = 'project-123';
export const MOCKED_USER_ID = 'user-123';

export const MOCKED_USER: TMockUser = {
  ovhSubsidiary: 'FR',
  nichandle: 'test-user',
  email: 'test@example.com',
};

export const MOCKED_PROJECT: TMockProject = {
  id: MOCKED_PROJECT_ID,
  description: 'Test Project',
  aggregatedStatus: 'active',
  project_id: MOCKED_PROJECT_ID,
  planCode: 'test-plan-code',
  isDefault: false,
  status: 'ok',
  creationDate: '2024-01-01T00:00:00.000Z',
  lastUpdate: '2024-01-01T00:00:00.000Z',
};

export const MOCKED_DEFAULT_PROJECT: TMockProject = {
  ...MOCKED_PROJECT,
  isDefault: true,
};

export const MOCKED_PROJECTS = [
  MOCKED_PROJECT,
  {
    ...MOCKED_PROJECT,
    id: 'project-456',
    project_id: 'project-456',
    description: 'Another Project',
    isDefault: false,
  },
  MOCKED_DEFAULT_PROJECT,
];

// ============================================================================
// MOCKS POUR LES LIBRAIRIES EXTERNES
// ============================================================================

// Mock project data pour pci-common
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

// ============================================================================
// HELPERS POUR LES MOCKS
// ============================================================================

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

// Setup and clear mocks functions
export const setupAllMocks = () => {
  setupDefaultMocks();
};

export const clearAllMocks = () => {
  vi.clearAllMocks();
  setupDefaultMocks();
};

export const createMockUseResourcesV6 = (overrides: any = {}) => ({
  flattenData: undefined,
  isError: false,
  totalCount: 0,
  hasNextPage: false,
  fetchNextPage: vi.fn(),
  isLoading: true,
  setSorting: vi.fn(),
  search: undefined,
  sorting: undefined,
  filters: undefined,
  error: null,
  ...overrides,
});

export const createMockUseProject = (overrides: any = {}) => ({
  data: MOCKED_PROJECT,
  isLoading: false,
  error: null,
  ...overrides,
});

export const createMockUseNotifications = () => ({
  addError: vi.fn(),
  addSuccess: vi.fn(),
  addInfo: vi.fn(),
  addWarning: vi.fn(),
});

export const createMockUseNavigate = () => vi.fn();

export const createMockUseParams = (overrides: any = {}) => ({
  projectId: MOCKED_PROJECT_ID,
  ...overrides,
});

export const createMockUseSearchParams = (overrides: any = {}) => [
  new URLSearchParams(overrides),
  vi.fn(),
];

// ============================================================================
// HELPERS POUR LES TESTS DE COMPOSANTS
// ============================================================================

export const renderWithProviders = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => {
  const Wrapper = createOptimalWrapper({ queries: true, shell: true });
  return render(ui, { wrapper: Wrapper, ...options });
};

export const renderWithCustomProviders = (
  ui: ReactElement,
  contextValue = shellContext,
  options?: Omit<RenderOptions, 'wrapper'>,
) => {
  const Wrapper = createOptimalWrapper(
    { queries: true, shell: true },
    contextValue,
  );
  return render(ui, { wrapper: Wrapper, ...options });
};

// Helpers pour les tests de hooks
export const renderHookWithProviders = (hook: () => any, options?: any) => {
  const Wrapper = createOptimalWrapper({ queries: true, shell: true });
  return renderHook(hook, { wrapper: Wrapper, ...options });
};

// ============================================================================
// HELPERS POUR LES ASSERTIONS
// ============================================================================

export const assertElementExists = (testId: string) => {
  const element = document.querySelector(`[data-testid="${testId}"]`);
  expect(element).toBeInTheDocument();
  return element;
};

export const assertElementNotExists = (testId: string) => {
  const element = document.querySelector(`[data-testid="${testId}"]`);
  expect(element).not.toBeInTheDocument();
};

export const assertTextContent = (testId: string, expectedText: string) => {
  const element = assertElementExists(testId);
  expect(element).toHaveTextContent(expectedText);
};

export const assertButtonEnabled = (testId: string) => {
  const button = document.querySelector(
    `[data-testid="${testId}"]`,
  ) as HTMLButtonElement;
  expect(button).not.toBeDisabled();
};

export const assertButtonDisabled = (testId: string) => {
  const button = document.querySelector(
    `[data-testid="${testId}"]`,
  ) as HTMLButtonElement;
  expect(button).toBeDisabled();
};

// ============================================================================
// HELPERS POUR LES INTERACTIONS UTILISATEUR
// ============================================================================

export const clickButton = async (testId: string) => {
  const button = document.querySelector(
    `[data-testid="${testId}"]`,
  ) as HTMLButtonElement;
  expect(button).toBeInTheDocument();
  await button.click();
};

export const fillInput = async (testId: string, value: string) => {
  const input = document.querySelector(
    `[data-testid="${testId}"]`,
  ) as HTMLInputElement;
  expect(input).toBeInTheDocument();
  input.value = value;
  input.dispatchEvent(new Event('input', { bubbles: true }));
};

export const submitForm = async (testId: string) => {
  const form = document.querySelector(
    `[data-testid="${testId}"]`,
  ) as HTMLFormElement;
  expect(form).toBeInTheDocument();
  await form.submit();
};

// ============================================================================
// HELPERS POUR LES TESTS DE NAVIGATION
// ============================================================================

export const assertNavigationCalled = (
  mockNavigate: any,
  expectedPath: string,
) => {
  expect(mockNavigate).toHaveBeenCalledWith(expectedPath);
};

export const assertNavigationNotCalled = (mockNavigate: any) => {
  expect(mockNavigate).not.toHaveBeenCalled();
};

// ============================================================================
// HELPERS POUR LES TESTS D'API
// ============================================================================

export const assertApiCall = (mockApi: any, expectedParams: any) => {
  expect(mockApi).toHaveBeenCalledWith(expectedParams);
};

export const assertApiNotCalled = (mockApi: any) => {
  expect(mockApi).not.toHaveBeenCalled();
};

// ============================================================================
// HELPERS POUR LES TESTS DE NOTIFICATIONS
// ============================================================================

export const assertNotificationCalled = (
  mockNotification: any,
  expectedMessage: string,
) => {
  expect(mockNotification).toHaveBeenCalledWith(expectedMessage);
};

export const assertNotificationNotCalled = (mockNotification: any) => {
  expect(mockNotification).not.toHaveBeenCalled();
};

// ============================================================================
// HELPERS POUR LES TESTS DE LOADING STATES
// ============================================================================

export const assertLoadingState = (testId: string) => {
  const loadingElement = document.querySelector(`[data-testid="${testId}"]`);
  expect(loadingElement).toBeInTheDocument();
};

export const assertNotLoadingState = (testId: string) => {
  const loadingElement = document.querySelector(`[data-testid="${testId}"]`);
  expect(loadingElement).not.toBeInTheDocument();
};

// ============================================================================
// HELPERS POUR LES TESTS D'ERREURS
// ============================================================================

export const assertErrorState = (testId: string, expectedError?: string) => {
  const errorElement = document.querySelector(`[data-testid="${testId}"]`);
  expect(errorElement).toBeInTheDocument();
  if (expectedError) {
    expect(errorElement).toHaveTextContent(expectedError);
  }
};

export const assertNoErrorState = (testId: string) => {
  const errorElement = document.querySelector(`[data-testid="${testId}"]`);
  expect(errorElement).not.toBeInTheDocument();
};

// ============================================================================
// HELPERS POUR LES TESTS DE FORMULAIRES
// ============================================================================

export const fillForm = async (formData: Record<string, string>) => {
  await Promise.all(
    Object.entries(formData).map(([fieldName, value]) =>
      fillInput(`${fieldName}-input`, value),
    ),
  );
};

export const assertFormValues = (formData: Record<string, string>) => {
  Object.entries(formData).forEach(([fieldName, expectedValue]) => {
    const input = document.querySelector(
      `[data-testid="${fieldName}-input"]`,
    ) as HTMLInputElement;
    expect(input).toHaveValue(expectedValue);
  });
};

// ============================================================================
// HELPERS POUR LES TESTS DE MODALES
// ============================================================================

export const assertModalOpen = (testId: string) => {
  const modal = document.querySelector(`[data-testid="${testId}"]`);
  expect(modal).toBeInTheDocument();
};

export const assertModalClosed = (testId: string) => {
  const modal = document.querySelector(`[data-testid="${testId}"]`);
  expect(modal).not.toBeInTheDocument();
};

export const closeModal = async (testId: string) => {
  const closeButton = document.querySelector(
    `[data-testid="${testId}-close"]`,
  ) as HTMLButtonElement;
  if (closeButton) {
    await closeButton.click();
  }
};

// ============================================================================
// HELPERS POUR LES TESTS DE DATAGRID
// ============================================================================

export const assertDatagridRendered = () => {
  const datagrid = document.querySelector('[data-testid="datagrid"]');
  expect(datagrid).toBeInTheDocument();
};

export const assertDatagridLoading = () => {
  const loadingRow = document.querySelector('[data-testid="loading-row"]');
  expect(loadingRow).toBeInTheDocument();
};

export const assertDatagridData = (expectedData: any[]) => {
  expectedData.forEach((_item, index) => {
    const row = document.querySelector(`[data-testid="datagrid-row-${index}"]`);
    expect(row).toBeInTheDocument();
  });
};

// ============================================================================
// HELPERS POUR LES TESTS DE BREADCRUMBS
// ============================================================================

export const assertBreadcrumbItems = (expectedItems: string[]) => {
  expectedItems.forEach((item, index) => {
    const breadcrumbItem = document.querySelector(
      `[data-testid="breadcrumb-item-${index}"]`,
    );
    expect(breadcrumbItem).toHaveTextContent(item);
  });
};

// ============================================================================
// HELPERS POUR LES TESTS DE PERFORMANCE
// ============================================================================

export const measureRenderTime = async (renderFunction: () => void) => {
  const startTime = performance.now();
  await renderFunction();
  const endTime = performance.now();
  return endTime - startTime;
};

export const assertRenderTimeUnder = async (
  renderFunction: () => void,
  maxTimeMs: number,
) => {
  const renderTime = await measureRenderTime(renderFunction);
  expect(renderTime).toBeLessThan(maxTimeMs);
};

// ============================================================================
// HELPERS POUR LES TESTS DE TRADUCTION
// ============================================================================

export const assertTranslationKey = (testId: string, expectedKey: string) => {
  const element = document.querySelector(`[data-testid="${testId}"]`);
  expect(element).toHaveTextContent(expectedKey);
};

export const assertTranslationWithParams = (
  testId: string,
  expectedKey: string,
  params: Record<string, string>,
) => {
  const element = document.querySelector(`[data-testid="${testId}"]`);
  let expectedText = expectedKey;
  Object.entries(params).forEach(([key, value]) => {
    expectedText = expectedText.replace(`{{${key}}}`, value);
  });
  expect(element).toHaveTextContent(expectedText);
};

// ============================================================================
// HELPERS POUR LES TESTS DE TRACKING
// ============================================================================

export const assertTrackingCalled = (
  mockTracking: any,
  expectedEvent: string,
) => {
  expect(mockTracking).toHaveBeenCalledWith(expectedEvent);
};

export const assertTrackingNotCalled = (mockTracking: any) => {
  expect(mockTracking).not.toHaveBeenCalled();
};

// ============================================================================
// HELPERS POUR LES TESTS DE VALIDATION
// ============================================================================

export const assertValidationError = (
  fieldName: string,
  expectedError: string,
) => {
  const errorElement = document.querySelector(
    `[data-testid="${fieldName}-error"]`,
  );
  expect(errorElement).toBeInTheDocument();
  expect(errorElement).toHaveTextContent(expectedError);
};

export const assertNoValidationError = (fieldName: string) => {
  const errorElement = document.querySelector(
    `[data-testid="${fieldName}-error"]`,
  );
  expect(errorElement).not.toBeInTheDocument();
};

// ============================================================================
// HELPERS POUR LES TESTS DE RESPONSIVE
// ============================================================================

export const setViewport = (width: number, height: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  });
  window.dispatchEvent(new Event('resize'));
};

// ============================================================================
// HELPERS POUR LES TESTS D'ACCESSIBILITÉ
// ============================================================================

export const assertAriaLabel = (testId: string, expectedLabel: string) => {
  const element = document.querySelector(`[data-testid="${testId}"]`);
  expect(element).toHaveAttribute('aria-label', expectedLabel);
};

export const assertAriaDescribedBy = (
  testId: string,
  expectedDescription: string,
) => {
  const element = document.querySelector(`[data-testid="${testId}"]`);
  expect(element).toHaveAttribute('aria-describedby', expectedDescription);
};

// ============================================================================
// HELPERS POUR LES TESTS DE THÈME
// ============================================================================

export const assertThemeClass = (testId: string, expectedTheme: string) => {
  const element = document.querySelector(`[data-testid="${testId}"]`);
  expect(element).toHaveClass(`theme-${expectedTheme}`);
};

// ============================================================================
// HELPERS POUR LES TESTS DE FOCUS
// ============================================================================

export const assertElementFocused = (testId: string) => {
  const element = document.querySelector(
    `[data-testid="${testId}"]`,
  ) as HTMLElement;
  expect(element).toHaveFocus();
};

export const assertElementNotFocused = (testId: string) => {
  const element = document.querySelector(
    `[data-testid="${testId}"]`,
  ) as HTMLElement;
  expect(element).not.toHaveFocus();
};

// ============================================================================
// EXPORT DE TOUS LES HELPERS
// ============================================================================

export const testHelpers = {
  // Données de test
  MOCKED_PROJECT_ID,
  MOCKED_USER_ID,
  MOCKED_USER,
  MOCKED_PROJECT,
  MOCKED_DEFAULT_PROJECT,
  MOCKED_PROJECTS,

  // Mocks pour librairies externes
  mockProject,
  mockDiscoveryProject,
  mockPciCommon,
  mockReactComponents,
  mockSections,
  mockHooks,
  mockConstants,
  mockI18n,
  mockReactRouter,
  mockQuickAccessItem,
  mockDashboardSections,
  mockOtherActionItem,
  mockBottomSectionItem,
  mockCommunityLinks,
  mockDocumentationLinks,

  // Helpers de mock
  createMockUseResourcesV6,
  createMockUseProject,
  createMockUseNotifications,
  createMockUseNavigate,
  createMockUseParams,
  createMockUseSearchParams,
  setupDefaultMocks,
  setupAllMocks,
  clearAllMocks,

  // Helpers de rendu
  renderWithProviders,
  renderWithCustomProviders,
  renderHookWithProviders,

  // Helpers d'assertion
  assertElementExists,
  assertElementNotExists,
  assertTextContent,
  assertButtonEnabled,
  assertButtonDisabled,

  // Helpers d'interaction
  clickButton,
  fillInput,
  submitForm,

  // Helpers de navigation
  assertNavigationCalled,
  assertNavigationNotCalled,

  // Helpers d'API
  assertApiCall,
  assertApiNotCalled,

  // Helpers de notifications
  assertNotificationCalled,
  assertNotificationNotCalled,

  // Helpers de loading
  assertLoadingState,
  assertNotLoadingState,

  // Helpers d'erreurs
  assertErrorState,
  assertNoErrorState,

  // Helpers de formulaires
  fillForm,
  assertFormValues,

  // Helpers de modales
  assertModalOpen,
  assertModalClosed,
  closeModal,

  // Helpers de datagrid
  assertDatagridRendered,
  assertDatagridLoading,
  assertDatagridData,

  // Helpers de breadcrumbs
  assertBreadcrumbItems,

  // Helpers de performance
  measureRenderTime,
  assertRenderTimeUnder,

  // Helpers de traduction
  assertTranslationKey,
  assertTranslationWithParams,

  // Helpers de tracking
  assertTrackingCalled,
  assertTrackingNotCalled,

  // Helpers de validation
  assertValidationError,
  assertNoValidationError,

  // Helpers de responsive
  setViewport,

  // Helpers d'accessibilité
  assertAriaLabel,
  assertAriaDescribedBy,

  // Helpers de thème
  assertThemeClass,

  // Helpers de focus
  assertElementFocused,
  assertElementNotFocused,
};

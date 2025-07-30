// Utilitaires de test centralisés pour pci-project-app
// Basé sur les bonnes pratiques du guide de test PCI Volume Backup

/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactElement } from 'react';
import { vi } from 'vitest';
import { render, RenderOptions, renderHook } from '@testing-library/react';
import { createTestWrapper, shellContext } from './test-wrappers';

// Types pour les données de test
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

// Données de test centralisées
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

// Helpers pour les mocks
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

// Helpers pour les tests de composants
export const renderWithProviders = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => {
  const Wrapper = createTestWrapper();
  return render(ui, { wrapper: Wrapper, ...options });
};

export const renderWithCustomProviders = (
  ui: ReactElement,
  contextValue = shellContext,
  options?: Omit<RenderOptions, 'wrapper'>,
) => {
  const Wrapper = createTestWrapper(contextValue);
  return render(ui, { wrapper: Wrapper, ...options });
};

// Helpers pour les tests de hooks
export const renderHookWithProviders = (hook: () => any, options?: any) => {
  const Wrapper = createTestWrapper();
  return renderHook(hook, { wrapper: Wrapper, ...options });
};

// Helpers pour les assertions
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

// Helpers pour les interactions utilisateur
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

// Helpers pour les tests de navigation
export const assertNavigationCalled = (
  mockNavigate: any,
  expectedPath: string,
) => {
  expect(mockNavigate).toHaveBeenCalledWith(expectedPath);
};

export const assertNavigationNotCalled = (mockNavigate: any) => {
  expect(mockNavigate).not.toHaveBeenCalled();
};

// Helpers pour les tests d'API
export const assertApiCall = (mockApi: any, expectedParams: any) => {
  expect(mockApi).toHaveBeenCalledWith(expectedParams);
};

export const assertApiNotCalled = (mockApi: any) => {
  expect(mockApi).not.toHaveBeenCalled();
};

// Helpers pour les tests de notifications
export const assertNotificationCalled = (
  mockNotification: any,
  expectedMessage: string,
) => {
  expect(mockNotification).toHaveBeenCalledWith(expectedMessage);
};

export const assertNotificationNotCalled = (mockNotification: any) => {
  expect(mockNotification).not.toHaveBeenCalled();
};

// Helpers pour les tests de loading states
export const assertLoadingState = (testId: string) => {
  const loadingElement = document.querySelector(`[data-testid="${testId}"]`);
  expect(loadingElement).toBeInTheDocument();
};

export const assertNotLoadingState = (testId: string) => {
  const loadingElement = document.querySelector(`[data-testid="${testId}"]`);
  expect(loadingElement).not.toBeInTheDocument();
};

// Helpers pour les tests d'erreurs
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

// Helpers pour les tests de formulaires
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

// Helpers pour les tests de modales
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

// Helpers pour les tests de datagrid
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

// Helpers pour les tests de breadcrumbs
export const assertBreadcrumbItems = (expectedItems: string[]) => {
  expectedItems.forEach((item, index) => {
    const breadcrumbItem = document.querySelector(
      `[data-testid="breadcrumb-item-${index}"]`,
    );
    expect(breadcrumbItem).toHaveTextContent(item);
  });
};

// Helpers pour les tests de performance
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

// Helpers pour les tests de traduction
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

// Helpers pour les tests de tracking
export const assertTrackingCalled = (
  mockTracking: any,
  expectedEvent: string,
) => {
  expect(mockTracking).toHaveBeenCalledWith(expectedEvent);
};

export const assertTrackingNotCalled = (mockTracking: any) => {
  expect(mockTracking).not.toHaveBeenCalled();
};

// Helpers pour les tests de validation
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

// Helpers pour les tests de responsive
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

// Helpers pour les tests d'accessibilité
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

// Helpers pour les tests de thème
export const assertThemeClass = (testId: string, expectedTheme: string) => {
  const element = document.querySelector(`[data-testid="${testId}"]`);
  expect(element).toHaveClass(`theme-${expectedTheme}`);
};

// Helpers pour les tests de focus
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

// Export de tous les helpers
export const testHelpers = {
  // Données de test
  MOCKED_PROJECT_ID,
  MOCKED_USER_ID,
  MOCKED_USER,
  MOCKED_PROJECT,
  MOCKED_DEFAULT_PROJECT,
  MOCKED_PROJECTS,

  // Helpers de mock
  createMockUseResourcesV6,
  createMockUseProject,
  createMockUseNotifications,
  createMockUseNavigate,
  createMockUseParams,
  createMockUseSearchParams,

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

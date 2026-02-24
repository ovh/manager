import React from 'react';

import { useParams } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useGetAttachedDomains } from '@/data/hooks/webHostingDashboard/useWebHostingDashboard';
import {
  useGetHostingDatabase,
  useGetHostingDatabases,
} from '@/data/hooks/webHostingDatabase/useWebHostingDatabase';
import { useGetModuleLanguages } from '@/data/hooks/webHostingModule/useWebHostingModule';
import { CmsType } from '@/data/types/product/managedWordpress/cms';
import { AssociationType } from '@/data/types/product/website';
import { WebsiteFormData, zForm } from '@/utils/formSchemas.utils';
import { wrapperWithI18n } from '@/utils/test.provider';

import { DomainCmsAdvancedOptions } from '../DomainCmsAdvancedOptions';

const mockDatabases = ['testdb1.mysql.db', 'testdb2.mysql.db'];
const mockDatabaseDetails = {
  name: 'testdb1.mysql.db',
  user: 'testuser',
  port: 3306,
};
const mockAttachedDomains = ['example.com', 'test.example.com'];
const mockLanguages = ['fr', 'en', 'de'];

const defaultAdvancedModeValues: Partial<WebsiteFormData> = {
  advancedInstallation: true,
  module: CmsType.WORDPRESS,
  associationType: AssociationType.EXISTING,
  selectedDatabase: 'testdb1.mysql.db',
  databaseServer: 'test-server',
  databaseName: 'test-db',
  databasePort: '3306',
  databaseUser: 'test-user',
  databasePassword: 'ValidPass123',
  adminName: 'admin',
  adminPassword: 'ValidPass123',
  moduleDomain: 'example.com',
  moduleLanguage: 'fr',
  moduleInstallPath: 'test',
  name: 'test',
  fqdn: 'test.example.com',
};

vi.mock('@/data/hooks/webHostingDatabase/useWebHostingDatabase', () => ({
  useGetHostingDatabases: vi.fn(),
  useGetHostingDatabase: vi.fn(),
}));

vi.mock('@/data/hooks/webHostingDashboard/useWebHostingDashboard', () => ({
  useGetAttachedDomains: vi.fn(),
}));

vi.mock('@/data/hooks/webHostingModule/useWebHostingModule', () => ({
  useGetModuleLanguages: vi.fn(),
}));

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useParams: vi.fn(),
  };
});

const mockT = (key: string) => key;

const TestComponent = ({ initialValues }: { initialValues?: Partial<WebsiteFormData> }) => {
  const { control, watch, setValue, formState } = useForm<WebsiteFormData>({
    resolver: zodResolver(zForm(mockT).WEBSITE_FORM_SCHEMA),
    mode: 'onTouched',
    defaultValues: {
      associationType: AssociationType.EXISTING,
      advancedInstallation: false,
      module: CmsType.NONE,
      name: '',
      fqdn: '',
      ...initialValues,
    } as WebsiteFormData,
  });

  const controlValues = watch();

  return (
    <DomainCmsAdvancedOptions
      control={control}
      controlValues={controlValues}
      setValue={setValue}
      errors={formState.errors}
    />
  );
};

describe('DomainCmsAdvancedOptions - Mode avancé', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useParams).mockReturnValue({
      serviceName: 'test-service',
    } as ReturnType<typeof useParams>);

    (useGetHostingDatabases as ReturnType<typeof vi.fn>).mockReturnValue({
      data: mockDatabases,
    });

    (useGetHostingDatabase as ReturnType<typeof vi.fn>).mockReturnValue({
      data: null,
    });

    (useGetAttachedDomains as ReturnType<typeof vi.fn>).mockReturnValue({
      data: mockAttachedDomains,
    });

    (useGetModuleLanguages as ReturnType<typeof vi.fn>).mockReturnValue({
      data: mockLanguages,
      isLoading: false,
    });
  });

  it('should render advanced installation checkbox', () => {
    render(<TestComponent />, { wrapper: wrapperWithI18n });

    const checkbox = screen.getByRole('checkbox', {
      name: /installation en mode avancé/i,
    });

    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();
  });

  it('should show advanced options when checkbox is checked', async () => {
    const user = userEvent.setup();
    render(<TestComponent />, { wrapper: wrapperWithI18n });

    const checkbox = screen.getByRole('checkbox', {
      name: /installation en mode avancé/i,
    });

    await user.click(checkbox);

    await waitFor(() => {
      expect(screen.getByTestId('database-select')).toBeInTheDocument();
    });
  });

  it('should hide advanced options when checkbox is unchecked', async () => {
    const user = userEvent.setup();
    render(<TestComponent initialValues={defaultAdvancedModeValues} />, {
      wrapper: wrapperWithI18n,
    });

    await waitFor(() => {
      expect(screen.getByTestId('database-select')).toBeInTheDocument();
    });

    const checkbox = screen.getByRole('checkbox', {
      name: /installation en mode avancé/i,
    });

    await user.click(checkbox);

    await waitFor(() => {
      expect(screen.queryByTestId('database-select')).not.toBeInTheDocument();
    });
  });

  it('should display database options when advanced mode is enabled', async () => {
    render(<TestComponent initialValues={defaultAdvancedModeValues} />, {
      wrapper: wrapperWithI18n,
    });

    await waitFor(() => {
      const databaseSelect = screen.getByTestId('database-select');
      expect(databaseSelect).toBeInTheDocument();
    });
  });

  it('should auto-fill database fields when database is selected', async () => {
    (useGetHostingDatabase as ReturnType<typeof vi.fn>).mockReturnValue({
      data: mockDatabaseDetails,
    });

    render(
      <TestComponent
        initialValues={{
          ...defaultAdvancedModeValues,
          selectedDatabase: 'testdb1.mysql.db',
        }}
      />,
      { wrapper: wrapperWithI18n },
    );

    await waitFor(() => {
      const serverInput = screen.getByTestId('database-server-input');
      expect(serverInput).toBeInTheDocument();
      expect(serverInput).toBeDisabled();
      expect(serverInput).toHaveValue(mockDatabaseDetails.name);
    });

    const nameInput = screen.getByTestId('database-name-input');
    expect(nameInput).toBeInTheDocument();
    expect(nameInput).toBeDisabled();
    expect(nameInput).toHaveValue(mockDatabaseDetails.name);
  });

  it('should accept valid password format', async () => {
    const user = userEvent.setup();
    render(
      <TestComponent
        initialValues={{
          ...defaultAdvancedModeValues,
          databasePassword: '',
        }}
      />,
      { wrapper: wrapperWithI18n },
    );

    await waitFor(() => {
      const passwordInput = screen.getByTestId('database-password-input');
      expect(passwordInput).toBeInTheDocument();
    });

    const passwordInput = screen.getByTestId('database-password-input');

    await user.type(passwordInput, 'ValidPass123');

    const hasInvalidAttr =
      passwordInput.hasAttribute('invalid') ||
      passwordInput.getAttribute('aria-invalid') === 'true';
    expect(hasInvalidAttr).toBe(false);
  });

  it('should display domain options', async () => {
    render(<TestComponent initialValues={defaultAdvancedModeValues} />, {
      wrapper: wrapperWithI18n,
    });

    await waitFor(() => {
      const domainSelect = screen.getByTestId('module-domain-select');
      expect(domainSelect).toBeInTheDocument();
    });
  });

  it('should display language options based on selected CMS', async () => {
    render(<TestComponent initialValues={defaultAdvancedModeValues} />, {
      wrapper: wrapperWithI18n,
    });

    await waitFor(() => {
      const languageSelect = screen.getByTestId('module-language-select');
      expect(languageSelect).toBeInTheDocument();
    });
  });

  it('should display installation path with ./www/ prefix', async () => {
    render(<TestComponent initialValues={defaultAdvancedModeValues} />, {
      wrapper: wrapperWithI18n,
    });

    await waitFor(() => {
      const pathInput = screen.getByTestId('module-install-path-input');
      expect(pathInput).toBeInTheDocument();
    });

    const prefix = screen.getByText('./www/');
    expect(prefix).toBeInTheDocument();
  });

  it('should allow entering installation path', async () => {
    const user = userEvent.setup();
    render(<TestComponent initialValues={defaultAdvancedModeValues} />, {
      wrapper: wrapperWithI18n,
    });

    await waitFor(() => {
      const pathInput = screen.getByTestId('module-install-path-input');
      expect(pathInput).toBeInTheDocument();
    });

    const pathInput = screen.getByTestId('module-install-path-input');
    await user.clear(pathInput);
    await user.type(pathInput, 'myfolder');

    expect(pathInput).toHaveValue('myfolder');
  });

  it('should display tooltip with password rules', async () => {
    render(<TestComponent initialValues={defaultAdvancedModeValues} />, {
      wrapper: wrapperWithI18n,
    });

    await waitFor(() => {
      const passwordInput = screen.getByTestId('database-password-input');
      expect(passwordInput).toBeInTheDocument();
    });

    const tooltipTriggers = screen.getAllByRole('button', {
      hidden: true,
    });
    expect(tooltipTriggers.length).toBeGreaterThanOrEqual(2);
  });

  it('should display language select when advanced mode is enabled', async () => {
    render(<TestComponent initialValues={defaultAdvancedModeValues} />, {
      wrapper: wrapperWithI18n,
    });

    await waitFor(() => {
      const languageSelectContainer = screen.getByTestId('module-language-select');
      expect(languageSelectContainer).toBeInTheDocument();
    });
  });
});

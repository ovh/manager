import React from 'react';

import { render, screen } from '@testing-library/react';
import { beforeEach, describe, it, vi } from 'vitest';

import { useShareCatalog } from '@/data/hooks/catalog/useShareCatalog';
import { useGetProject } from '@/hooks/useGetProject';
import CreateSharePage from '@/pages/create/CreateShare.page';

vi.mock('@/hooks/useGetProject', () => ({
  useGetProject: vi.fn(),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
  Trans: ({ i18nKey }: { i18nKey: string }) => i18nKey,
}));

vi.mock('@ovh-ux/manager-pci-common', () => ({
  PciDiscoveryBanner: ({ project }: { project: { isDiscovery?: boolean } }) =>
    project ? <div>Discovery banner</div> : null,
}));

vi.mock('@/components/breadcrumb/Breadcrumb.component', () => ({
  Breadcrumb: ({ items }: { items: { label: string }[] }) => (
    <div>
      {items.map(({ label }) => (
        <span key={label}>{label}</span>
      ))}
    </div>
  ),
}));

vi.mock('@/pages/create/components/form/CreateShareForm.component', () => ({
  CreateShareForm: () => <div>CreateShareForm</div>,
}));

vi.mock('@/data/hooks/catalog/useShareCatalog', () => ({
  useShareCatalog: vi.fn(),
}));

vi.mock('@/hooks/useGetUser', () => ({
  useGetUser: () => ({
    ovhSubsidiary: 'FR',
  }),
}));

vi.mock('@ovhcloud/ods-react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@ovhcloud/ods-react')>();
  return {
    ...actual,
    Spinner: () => <div>Loading</div>,
  };
});

const mockUseGetProject = vi.mocked(useGetProject);
const mockUseShareCatalog = vi.mocked(useShareCatalog);

describe('CreateShare page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseGetProject.mockReturnValue(undefined);
    mockUseShareCatalog.mockReturnValue({ isLoading: false } as ReturnType<typeof useShareCatalog>);
  });

  it('should render breadcrumb and create form', () => {
    render(<CreateSharePage />);

    expect(screen.getByText('title')).toBeVisible();
    expect(screen.getByText('CreateShareForm')).toBeVisible();
  });

  it('should render PciDiscoveryBanner when project is defined', () => {
    mockUseGetProject.mockReturnValue({
      id: 'project-id',
      name: 'My project',
      url: 'https://example.com',
      isDiscovery: true,
    } as ReturnType<typeof useGetProject>);

    render(<CreateSharePage />);

    expect(screen.getByText('Discovery banner')).toBeVisible();
  });

  it('should not render PciDiscoveryBanner when project is undefined', () => {
    render(<CreateSharePage />);

    expect(screen.queryByText('Discovery banner')).not.toBeInTheDocument();
  });

  it('should show loading state when useShareCatalog is loading', () => {
    mockUseShareCatalog.mockReturnValue({ isLoading: true } as ReturnType<typeof useShareCatalog>);

    render(<CreateSharePage />);

    expect(screen.getByText('Loading')).toBeVisible();
    expect(screen.queryByText('CreateShareForm')).not.toBeInTheDocument();
  });
});

import { render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import GuideMenu from './GuideMenu.component';

describe('GuideMenu Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should match guides links', () => {
    const { container } = render(<GuideMenu />);

    const guide1 = container.querySelector(
      'ods-link[label="pci_projects_project_storages_cold_archives_guides_storage-backup_title"]',
    );
    expect(guide1).toHaveAttribute('href', 'https://docs.ovh.com/fr/storage/');

    const guide2 = container.querySelector(
      'ods-link[label="pci_projects_project_storages_cold_archives_guides_overview_title"]',
    );
    expect(guide2).toHaveAttribute(
      'href',
      'https://docs.ovh.com/fr/storage/object-storage/cold-archive/overview/',
    );

    const guide3 = container.querySelector(
      'ods-link[label="pci_projects_project_storages_cold_archives_guides_getting-started-with-cold-archive_title"]',
    );
    expect(guide3).toHaveAttribute(
      'href',
      'https://docs.ovh.com/fr/storage/object-storage/cold-archive/getting-started/',
    );

    const guide4 = container.querySelector(
      'ods-link[label="pci_projects_project_storages_cold_archives_guides_manage-your-data_title"]',
    );
    expect(guide4).toHaveAttribute(
      'href',
      'https://docs.ovh.com/fr/storage/object-storage/s3/getting-started-with-object-storage/',
    );
  });
});

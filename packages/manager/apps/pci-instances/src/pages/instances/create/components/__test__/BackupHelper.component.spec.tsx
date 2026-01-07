import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import BackupHelper from '../backup/BackupHelper.component';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { renderWithMockedWrappers } from '@/__tests__/wrapperRenders';
import { GUIDE_LINKS } from '@/hooks/url/useGuideLink.constant';

describe('Considering BackupHelper component', () => {
  it('should display default auto backup text guide', async () => {
    renderWithMockedWrappers(<BackupHelper />);

    await userEvent.click(screen.getByText('common:pci_instances_common_help'));

    await waitFor(() => {
      expect(
        screen.getByText(
          'creation:pci_instance_creation_backup_setting_help_description',
        ),
      ).toBeVisible();

      expect(
        screen.getByText(
          'creation:pci_instance_creation_backup_setting_help_auto_backup_description',
        ),
      ).toBeVisible();

      expect(
        screen.getByText(
          'creation:pci_instance_creation_backup_setting_help_custom_backup_description',
        ),
      ).toBeVisible();

      expect(
        screen.getByText(
          'creation:pci_instance_creation_backup_setting_help_replication_description',
        ),
      ).toBeVisible();

      expect(
        screen.getByText(
          'creation:pci_instance_creation_backup_setting_help_ui_guide',
        ),
      ).toBeVisible();
    });
  });

  it('should display link to workflow management', async () => {
    renderWithMockedWrappers(<BackupHelper />);

    await userEvent.click(screen.getByText('common:pci_instances_common_help'));

    const links = screen.getAllByRole('link');
    const guideLink = links.find(
      (link) => link.getAttribute('href') === '/foo/bar/workflow',
    );

    expect(guideLink).toBeDefined();
  });

  it('should track the guide link', async () => {
    renderWithMockedWrappers(<BackupHelper />);

    await userEvent.click(screen.getByText('common:pci_instances_common_help'));

    const links = screen.getAllByRole('link');
    const guideLink = links.find(
      (link) => link.getAttribute('href') === GUIDE_LINKS.BACKUP.FR,
    );

    expect(guideLink).toBeDefined();

    await userEvent.click(guideLink!);

    await waitFor(() => {
      expect(useOvhTracking().trackClick).toHaveBeenCalledWith({
        location: PageLocation.funnel,
        buttonType: ButtonType.externalLink,
        actionType: 'action',
        actions: ['add_instance', 'go-to-see-documentation_backup'],
      });
    });
  });
});

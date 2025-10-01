import { organizationList } from '@ovh-ux/manager-module-vcd-api';
import { vi } from 'vitest';

import { assertTextVisibility } from '@ovh-ux/manager-core-test-utils';
import { screen } from '@testing-library/react';

import { labels, renderTest } from '../../../../test-utils';

describe('Network ACL Add new acl', () => {
  beforeAll(() => {
    if (!(HTMLElement.prototype as any).close) {
      (HTMLElement.prototype as any).close = vi.fn();
    }
  });
  it('Display  the drawer and his elements', async () => {
    await renderTest({
      initialRoute: `/${organizationList[0].id}/network-acl/add-network-acl`,
    });

    // Drawer
    const drawer = await screen.findByTestId('drawer', {}, { timeout: 20000 });
    expect(drawer).toBeInTheDocument();
    expect(drawer).toHaveAttribute('is-open', 'true');

    const cancelButton = document.querySelector(
      `ods-button[label="${labels.commun.actions.cancel}"]`,
    );
    const confirmButton = document.querySelector(
      `ods-button[label="${labels.commun.actions.confirm}"]`,
    );

    expect(cancelButton).not.toBeNull();
    expect(confirmButton).not.toBeNull();
    expect(confirmButton).toHaveAttribute('is-disabled', 'true');
    // Title
    await assertTextVisibility(
      labels.networkAcl.managed_vcd_network_acl_ip_cta_add_ip,
    );

    // Form
    const ipInput = await screen.findByLabelText(
      labels.networkAcl.managed_vcd_network_acl_ip_name,
    );
    const descriptionInput = await screen.findByLabelText(
      labels.commun.dashboard.description,
    );

    expect(ipInput).toBeInTheDocument();
    expect(descriptionInput).toBeInTheDocument();
  });
});

describe('Network ACL modify existing acl', () => {
  beforeAll(() => {
    if (!(HTMLElement.prototype as any).close) {
      (HTMLElement.prototype as any).close = vi.fn();
    }
  });
  it('Display  the drawer and his elements', async () => {
    await renderTest({
      initialRoute: `/${organizationList[0].id}/network-acl/edit-network-acl?network=0.0.0.0%2F0&description=Network+ACLs+disabled`,
    });

    await assertTextVisibility(
      labels.networkAcl.managed_vcd_network_acl_drawer_header_edit_ip,
    );

    const ipInput = (await screen.findByLabelText(
      labels.networkAcl.managed_vcd_network_acl_ip_name,
    )) as any;
    const descriptionInput = (await screen.findByLabelText(
      labels.commun.dashboard.description,
    )) as any;
    expect(ipInput.value).toBe('0.0.0.0/0');
    expect(descriptionInput.value).toBe('Network ACLs disabled');
  });
});

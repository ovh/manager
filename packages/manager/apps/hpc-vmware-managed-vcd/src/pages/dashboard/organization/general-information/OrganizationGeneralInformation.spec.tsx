import userEvents from '@testing-library/user-event';
import { screen, waitFor, fireEvent, within } from '@testing-library/react';
import { renderTest, labels } from '../../../../test-utils';
import { organizationList } from '../../../../../mocks/vcd-organization/vcd-organization.mock';

const changeInputAndSubmit = async () => {
  const input = screen.getByLabelText('edit-input');
  const event = new CustomEvent('odsValueChange');
  Object.defineProperty(event, 'target', { value: { value: 'new name' } });
  await waitFor(() => fireEvent(input, event));

  const modifyButton = screen.getByText(
    labels.dashboard.managed_vcd_dashboard_edit_modal_cta_edit,
    { exact: true },
  );

  return waitFor(() => userEvents.click(modifyButton));
};

const checkModal = async ({
  container,
  isVisible,
}: {
  container: HTMLElement;
  isVisible: boolean;
}) =>
  waitFor(
    () => {
      const modal = container.querySelector('osds-modal');
      return isVisible
        ? expect(modal).toBeInTheDocument()
        : expect(modal).not.toBeInTheDocument();
    },
    { timeout: 30000 },
  );

describe('Organization General Information Page', () => {
  it('modify the name of the company', async () => {
    const { container } = await renderTest({
      initialRoute: `/${organizationList[1].id}`,
    });

    await waitFor(
      () =>
        expect(
          screen.getByText(
            labels.dashboard.managed_vcd_dashboard_data_protection,
          ),
        ).toBeVisible(),
      { timeout: 30000 },
    );

    let editButton;
    await waitFor(
      () => {
        editButton = screen.getAllByTestId('editIcon').at(0);
        return expect(editButton).not.toHaveAttribute('disabled');
      },
      { timeout: 30000 },
    );
    await waitFor(() => userEvents.click(editButton));

    await checkModal({ container, isVisible: true });

    await changeInputAndSubmit();

    await checkModal({ container, isVisible: false });

    expect(
      screen.queryByText(
        labels.dashboard.managed_vcd_dashboard_edit_name_modal_success,
      ),
    ).toBeVisible();
  });

  it('trying to update name displays an error if update organization service is KO', async () => {
    const { container } = await renderTest({
      initialRoute: `/${organizationList[0].id}/edit-name`,
      isOrganizationUpdateKo: true,
    });

    await checkModal({ container, isVisible: true });

    await changeInputAndSubmit();

    await checkModal({ container, isVisible: true });

    await waitFor(
      () =>
        expect(
          within(
            container.querySelector('osds-modal') as HTMLElement,
          ).getByText('Organization update error', { exact: false }),
        ).toBeVisible(),
      { timeout: 30000 },
    );
  });

  it('modify the description of the company', async () => {
    const { container } = await renderTest({
      initialRoute: `/${organizationList[1].id}`,
    });

    await waitFor(
      () =>
        expect(
          screen.getByText(
            labels.dashboard.managed_vcd_dashboard_data_protection,
          ),
        ).toBeVisible(),
      { timeout: 30000 },
    );

    let editButton;
    await waitFor(
      () => {
        editButton = screen.getAllByTestId('editIcon').at(1);
        return expect(editButton).not.toHaveAttribute('disabled');
      },
      { timeout: 30000 },
    );
    await waitFor(() => userEvents.click(editButton));

    await checkModal({ container, isVisible: true });

    await changeInputAndSubmit();

    await checkModal({ container, isVisible: false });

    expect(
      screen.queryByText(
        labels.dashboard.managed_vcd_dashboard_edit_description_modal_success,
      ),
    ).toBeVisible();
  });

  it('trying to update description displays an error if update organization service is KO', async () => {
    const { container } = await renderTest({
      initialRoute: `/${organizationList[0].id}/edit-description`,
      isOrganizationUpdateKo: true,
    });

    await checkModal({ container, isVisible: true });

    await changeInputAndSubmit();

    await checkModal({ container, isVisible: true });

    await waitFor(
      () =>
        expect(
          within(
            container.querySelector('osds-modal') as HTMLElement,
          ).getByText('Organization update error', { exact: false }),
        ).toBeVisible(),
      { timeout: 30000 },
    );
  });
});

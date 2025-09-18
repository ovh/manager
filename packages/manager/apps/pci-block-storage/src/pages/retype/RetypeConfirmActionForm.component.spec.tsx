import { render } from '@testing-library/react';

import { describe, vi } from 'vitest';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { userEvent } from '@testing-library/user-event';
import { RetypeConfirmActionForm } from '@/pages/retype/RetypeConfirmActionForm.component';

describe('RetypeConfirmActionForm', () => {
  it('should display warning message if not pending or error', () => {
    const { getByText, queryByText, queryByTestId } = render(
      <RetypeConfirmActionForm
        warningMessage="warning message"
        confirmWord="DETACH"
        errorElement={<div>error message</div>}
        onSubmit={vi.fn()}
        onClose={vi.fn()}
        isPending={false}
        isError={false}
      />,
    );

    expect(getByText('warning message')).toBeVisible();
    expect(queryByTestId('skeleton')).toBeNull();
    expect(queryByText('error message')).toBeNull();
  });

  it('should display confirmation input if not pending or error', () => {
    const { getByText, getByRole, queryByText, queryByTestId } = render(
      <RetypeConfirmActionForm
        warningMessage="warning message"
        confirmWord="DETACH"
        errorElement={<div>error message</div>}
        onSubmit={vi.fn()}
        onClose={vi.fn()}
        isPending={false}
        isError={false}
      />,
    );

    expect(
      getByText(
        'retype:pci_projects_project_storages_blocks_retype_confirm_action_label',
      ),
    ).toBeVisible();
    expect(getByRole('textbox')).toBeVisible();
    expect(queryByTestId('skeleton')).toBeNull();
    expect(queryByText('error message')).toBeNull();
  });

  it('should display error message if on error', () => {
    const { getByText, queryByTestId, queryByText } = render(
      <RetypeConfirmActionForm
        warningMessage="warning message"
        confirmWord="DETACH"
        errorElement={<div>error message</div>}
        onSubmit={vi.fn()}
        onClose={vi.fn()}
        isPending={false}
        isError
      />,
    );

    expect(getByText('error message')).toBeVisible();
    expect(queryByText('warning message')).toBeNull();
    expect(queryByTestId('skeleton')).toBeNull();
  });

  it('should display skeleton if on pending', () => {
    const { getByTestId, queryByText } = render(
      <RetypeConfirmActionForm
        warningMessage="warning message"
        confirmWord="DETACH"
        errorElement={<div>error message</div>}
        onSubmit={vi.fn()}
        onClose={vi.fn()}
        isPending
        isError={false}
      />,
    );

    expect(getByTestId('skeleton')).toBeVisible();
    expect(queryByText('warning message')).toBeNull();
    expect(queryByText('error message')).toBeNull();
  });

  describe('input error message', () => {
    it('should not be displayed if input nothing has been done', () => {
      const { queryByText } = render(
        <RetypeConfirmActionForm
          warningMessage="warning message"
          confirmWord="DETACH"
          errorElement={<div>error message</div>}
          onSubmit={vi.fn()}
          onClose={vi.fn()}
          isPending={false}
          isError={false}
        />,
      );

      expect(queryByText(`${NAMESPACES.FORM}:error_pattern`)).toBeNull();
    });

    it('should not be displayed if input is different the confirm word not blured', async () => {
      const { queryByText, getByRole } = render(
        <RetypeConfirmActionForm
          warningMessage="warning message"
          confirmWord="DETACH"
          errorElement={<div>error message</div>}
          onSubmit={vi.fn()}
          onClose={vi.fn()}
          isPending={false}
          isError={false}
        />,
      );

      await userEvent.type(getByRole('textbox'), 'blah');

      expect(queryByText(`${NAMESPACES.FORM}:error_pattern`)).toBeNull();
    });

    it('should be displayed if input is different the confirm word and blurred', async () => {
      const { getByText, getByRole } = render(
        <RetypeConfirmActionForm
          warningMessage="warning message"
          confirmWord="DETACH"
          errorElement={<div>error message</div>}
          onSubmit={vi.fn()}
          onClose={vi.fn()}
          isPending={false}
          isError={false}
        />,
      );

      await userEvent.type(getByRole('textbox'), 'blah');
      await userEvent.click(
        getByText(
          'retype:pci_projects_project_storages_blocks_retype_confirm_action_label',
        ),
      );

      expect(getByText(`${NAMESPACES.FORM}:error_pattern`)).toBeVisible();
    });

    it('should not be displayed if input is equal to the confirm word', async () => {
      const { getByText, queryByText, getByRole } = render(
        <RetypeConfirmActionForm
          warningMessage="warning message"
          confirmWord="DETACH"
          errorElement={<div>error message</div>}
          onSubmit={vi.fn()}
          onClose={vi.fn()}
          isPending={false}
          isError={false}
        />,
      );

      await userEvent.type(getByRole('textbox'), 'DETACH');
      await userEvent.click(
        getByText(
          'retype:pci_projects_project_storages_blocks_retype_confirm_action_label',
        ),
      );

      expect(queryByText(`${NAMESPACES.FORM}:error_pattern`)).toBeNull();
    });
  });

  describe('confirm button', () => {
    it('should be disabled if pending', () => {
      const { getByText } = render(
        <RetypeConfirmActionForm
          warningMessage="warning message"
          confirmWord="DETACH"
          errorElement={<div>error message</div>}
          onSubmit={vi.fn()}
          onClose={vi.fn()}
          isPending
          isError={false}
        />,
      );

      expect(
        getByText(
          'retype:pci_projects_project_storages_blocks_retype_confirm_action_confirm_button',
        ),
      ).toBeDisabled();
    });

    it('should be disabled if error', () => {
      const { getByText } = render(
        <RetypeConfirmActionForm
          warningMessage="warning message"
          confirmWord="DETACH"
          errorElement={<div>error message</div>}
          onSubmit={vi.fn()}
          onClose={vi.fn()}
          isPending={false}
          isError
        />,
      );

      expect(
        getByText(
          'retype:pci_projects_project_storages_blocks_retype_confirm_action_confirm_button',
        ),
      ).toBeDisabled();
    });

    it('should be disabled if input is empty', () => {
      const { getByText } = render(
        <RetypeConfirmActionForm
          warningMessage="warning message"
          confirmWord="DETACH"
          errorElement={<div>error message</div>}
          onSubmit={vi.fn()}
          onClose={vi.fn()}
          isPending={false}
          isError={false}
        />,
      );

      expect(
        getByText(
          'retype:pci_projects_project_storages_blocks_retype_confirm_action_confirm_button',
        ),
      ).toBeDisabled();
    });

    it('should be disabled if input is different from the conform word', async () => {
      const { getByText, getByRole } = render(
        <RetypeConfirmActionForm
          warningMessage="warning message"
          confirmWord="DETACH"
          errorElement={<div>error message</div>}
          onSubmit={vi.fn()}
          onClose={vi.fn()}
          isPending={false}
          isError={false}
        />,
      );

      await userEvent.type(getByRole('textbox'), 'DETACHH');

      expect(
        getByText(
          'retype:pci_projects_project_storages_blocks_retype_confirm_action_confirm_button',
        ),
      ).toBeDisabled();
    });

    it('should be enabled if input is equal to the confirm word', async () => {
      const { getByText, getByRole } = render(
        <RetypeConfirmActionForm
          warningMessage="warning message"
          confirmWord="DETACH"
          errorElement={<div>error message</div>}
          onSubmit={vi.fn()}
          onClose={vi.fn()}
          isPending={false}
          isError={false}
        />,
      );

      await userEvent.type(getByRole('textbox'), 'DETACH');

      expect(
        getByText(
          'retype:pci_projects_project_storages_blocks_retype_confirm_action_confirm_button',
        ),
      ).toBeEnabled();
    });
  });
});

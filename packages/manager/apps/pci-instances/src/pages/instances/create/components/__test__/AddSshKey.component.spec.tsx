import { describe, expect, it, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddSshKey from '../sshKey/AddSshKey.component';
import { renderWithMockedWrappers } from '@/__tests__/wrapperRenders';

const SSH_KEY_NAME = 'my-new-key';
const SSH_PUBLIC_KEY =
  'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIOzj9np0gzdFixF45N8byvuJeX910/suTIGXUwpfzmL2 fake@test';

const setupTest = () => {
  const onSubmit = vi.fn();

  renderWithMockedWrappers(
    <AddSshKey
      unavailableSshKeyIds={['existing-key']}
      onSubmit={onSubmit}
      onCancel={vi.fn()}
    />,
  );

  return { onSubmit };
};

const fillAndSubmitForm = async () => {
  await userEvent.type(
    screen.getByLabelText(
      'creation:pci_instance_creation_select_sshKey_add_name_label',
    ),
    SSH_KEY_NAME,
  );
  await userEvent.type(
    screen.getByLabelText(
      'creation:pci_instance_creation_select_sshKey_add_key_label',
    ),
    SSH_PUBLIC_KEY,
  );

  const submitButton = screen.getByRole('button', {
    name: 'creation:pci_instance_creation_select_sshKey_add_key_submit_btn',
  });
  await waitFor(() => expect(submitButton).toBeEnabled());
  await userEvent.click(submitButton);
};

describe('Considering AddSshKey component', () => {
  it('should submit the new ssh key with the values typed in the form', async () => {
    const { onSubmit } = setupTest();

    await fillAndSubmitForm();

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        sshKeyId: SSH_KEY_NAME,
        sshPublicKey: SSH_PUBLIC_KEY,
      });
    });
  });

  it('should reset the form once the ssh key is submitted', async () => {
    const { onSubmit } = setupTest();

    await fillAndSubmitForm();

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled();
      expect(
        screen.getByLabelText(
          'creation:pci_instance_creation_select_sshKey_add_name_label',
        ),
      ).toHaveValue('');
    });
  });
});

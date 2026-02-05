import { describe, expect, it } from 'vitest';
import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithMockedWrappers } from '@/__tests__/wrapperRenders';
import { TestCreateInstanceFormWrapper } from '@/__tests__/CreateInstanceFormWrapper';
import PostInstallScript from '../PostInstallScript.component';

const renderComponent = (defaultPostInstallScript: string | null = null) => {
  renderWithMockedWrappers(
    <TestCreateInstanceFormWrapper
      defaultValues={{ postInstallScript: defaultPostInstallScript }}
    >
      <PostInstallScript />
    </TestCreateInstanceFormWrapper>,
  );
};

const toggleLabelRegex = /pci_instance_creation_post_install_script_toggle_label/i;

describe('PostInstallScript', () => {
  it('renders title, description and toggle label', async () => {
    renderComponent();

    await waitFor(() => {
      expect(
        screen.getByText('pci_instance_creation_post_install_script_title'),
      ).toBeVisible();
      expect(
        screen.getByText(
          'pci_instance_creation_post_install_script_description',
        ),
      ).toBeVisible();
      expect(screen.getByLabelText(toggleLabelRegex)).toBeVisible();
    });
  });

  it('renders toggle unchecked and hides textarea when postInstallScript is null', async () => {
    renderComponent(null);

    await waitFor(() => {
      const toggle = screen.getByLabelText(toggleLabelRegex);
      expect(toggle).not.toBeChecked();
    });

    expect(screen.queryByRole('textbox')).toBeNull();
  });

  it('renders toggle checked and textarea when postInstallScript is enabled', async () => {
    renderComponent('');

    await waitFor(() => {
      const toggle = screen.getByLabelText(toggleLabelRegex);
      expect(toggle).toBeChecked();
    });

    expect(screen.getByRole('textbox')).toBeVisible();
    expect(screen.getByRole('textbox')).toHaveValue('');
  });

  it('displays script content in textarea when postInstallScript has value', async () => {
    const scriptContent = '#!/bin/bash\necho "hello"';
    renderComponent(scriptContent);

    await waitFor(() => {
      expect(screen.getByRole('textbox')).toHaveValue(scriptContent);
    });
  });

  it('shows textarea when toggle is turned on', async () => {
    const user = userEvent.setup();
    renderComponent(null);

    await user.click(screen.getByLabelText(toggleLabelRegex));

    await waitFor(() => {
      expect(screen.getByRole('textbox')).toBeVisible();
    });
  });

  it('hides textarea when toggle is turned off', async () => {
    const user = userEvent.setup();
    renderComponent('');

    await act(async () => {
      await user.click(screen.getByLabelText(toggleLabelRegex));
    });

    await waitFor(() => {
      expect(screen.queryByRole('textbox')).toBeNull();
    });
  });

  it('updates form value when typing in textarea', async () => {
    const user = userEvent.setup();
    renderComponent('');

    const textarea = screen.getByRole('textbox');
    await user.type(textarea, 'echo "test"');

    await waitFor(() => {
      expect(textarea).toHaveValue('echo "test"');
    });
  });
});

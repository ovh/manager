import { okmsRoubaix1Mock } from '@key-management-service/mocks/kms/okms.mock';
import { KEY_VALUES_EDITOR_TEST_IDS } from '@secret-manager/components/form/key-values-editor/keyValuesEditor.constants';
import { mockSecret1 } from '@secret-manager/mocks/secrets/secrets.mock';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent, { UserEvent } from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { labels as allLabels } from '@/common/utils/tests/init.i18n';
import { createErrorResponseMock } from '@/common/utils/tests/testUtils';
import { testWrapperBuilder } from '@/common/utils/tests/testWrapperBuilder';

import { EditCustomMetadataDrawerForm } from './EditCustomMetadataDrawerForm.component';

const commonLabels = allLabels.common;
const mockOkmsId = okmsRoubaix1Mock.id;
const mockMetadata = {
  environment: 'production',
  application: 'payment-service',
};
const mockSecret = {
  ...mockSecret1,
  metadata: {
    ...mockSecret1.metadata,
    customMetadata: mockMetadata,
  },
};

const mockUpdateSecret = vi.fn();
const mockUseUpdateSecret = vi.fn();
const mockOnDismiss = vi.fn();

vi.mock('@secret-manager/data/hooks/useUpdateSecret', () => ({
  useUpdateSecret: (): unknown => mockUseUpdateSecret(),
}));

const renderComponent = async () => {
  const defaultProps = {
    secret: mockSecret,
    okmsId: mockOkmsId,
    secretPath: mockSecret.path,
    onDismiss: mockOnDismiss,
  };

  const wrapper = await testWrapperBuilder().withI18next().withQueryClient().build();
  const renderResult = render(<EditCustomMetadataDrawerForm {...defaultProps} />, { wrapper });

  return {
    user: userEvent.setup(),
    ...renderResult,
  };
};

const submitForm = async (user: UserEvent) => {
  const submitButton = screen.getByRole('button', {
    name: commonLabels.actions.validate,
  });

  await act(() => user.click(submitButton));

  return submitButton;
};

describe('EditCustomMetadataDrawerForm component test suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock implementations
    mockUseUpdateSecret.mockReturnValue({
      mutateAsync: mockUpdateSecret,
      isPending: false,
      error: null,
    });
  });

  describe('when component renders successfully', () => {
    it('should render form with correct default values', async () => {
      await renderComponent();

      // Should render KeyValuesEditor
      expect(
        screen.getByTestId(KEY_VALUES_EDITOR_TEST_IDS.pairItemKeyInput(0)),
      ).toBeInTheDocument();

      // We should see two key-value pairs (environment and application)
      expect(
        screen.getByTestId(KEY_VALUES_EDITOR_TEST_IDS.pairItemKeyInput(0)),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId(KEY_VALUES_EDITOR_TEST_IDS.pairItemKeyInput(1)),
      ).toBeInTheDocument();
    });
  });

  describe('when update secret is successful', () => {
    it('should call updateSecret with correct parameters on form submission', async () => {
      // GIVEN
      const user = userEvent.setup();
      mockUpdateSecret.mockResolvedValue({});

      await renderComponent();

      // Wait for form to be rendered
      expect(
        await screen.findByTestId(KEY_VALUES_EDITOR_TEST_IDS.pairItemKeyInput(0)),
      ).toBeInTheDocument();

      // WHEN
      const submitButton = screen.getByRole('button', {
        name: commonLabels.actions.validate,
      });
      await act(() => user.click(submitButton));

      // THEN
      await waitFor(() => {
        expect(mockUpdateSecret).toHaveBeenCalledWith({
          okmsId: mockOkmsId,
          path: mockSecret.path,
          cas: expect.any(Number) as number,
          data: {
            metadata: {
              customMetadata: expect.objectContaining(mockMetadata) as Record<string, string>,
            },
          },
        });
      });
    });

    it('should call onDismiss after successful update', async () => {
      // GIVEN
      mockUpdateSecret.mockResolvedValue({});

      const { user } = await renderComponent();

      // Wait for form to be rendered
      expect(
        await screen.findByTestId(KEY_VALUES_EDITOR_TEST_IDS.pairItemKeyInput(0)),
      ).toBeInTheDocument();

      // WHEN
      await submitForm(user);

      // THEN
      await waitFor(() => {
        expect(mockOnDismiss).toHaveBeenCalled();
      });
    });
  });

  describe('when update secret fails', () => {
    it('should display error message when update fails', async () => {
      // GIVEN
      const updateError = createErrorResponseMock('Update failed');

      mockUseUpdateSecret.mockReturnValue({
        mutateAsync: mockUpdateSecret,
        isPending: false,
        error: updateError,
      });

      // WHEN
      await renderComponent();

      // THEN
      expect(screen.getByText('Update failed')).toBeInTheDocument();
    });

    it('should not call onDismiss when update fails', async () => {
      // GIVEN
      mockUpdateSecret.mockRejectedValue(new Error('Update failed'));

      const { user } = await renderComponent();

      // Wait for form to be rendered
      expect(
        await screen.findByTestId(KEY_VALUES_EDITOR_TEST_IDS.pairItemKeyInput(0)),
      ).toBeInTheDocument();

      // WHEN
      await submitForm(user);

      // THEN
      await waitFor(() => {
        expect(mockOnDismiss).not.toHaveBeenCalled();
      });
    });
  });

  describe('when update is pending', () => {
    it('should show loading state on submit button during update', async () => {
      // GIVEN
      mockUseUpdateSecret.mockReturnValue({
        mutateAsync: mockUpdateSecret,
        isPending: true,
        error: null,
      });

      // WHEN
      const { user } = await renderComponent();

      // Wait for form to be rendered
      expect(
        await screen.findByTestId(KEY_VALUES_EDITOR_TEST_IDS.pairItemKeyInput(0)),
      ).toBeInTheDocument();

      // THEN
      const submitButton = await submitForm(user);

      // The submit button should contain a spinner while loading
      await waitFor(() => {
        expect(submitButton.querySelector('[data-ods="spinner"]')).toBeInTheDocument();
      });
    });
  });
});

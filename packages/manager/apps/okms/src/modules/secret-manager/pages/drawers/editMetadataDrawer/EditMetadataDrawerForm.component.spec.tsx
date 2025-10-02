import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, act } from '@testing-library/react';
import userEvent, { UserEvent } from '@testing-library/user-event';
import { mockSecret1 } from '@secret-manager/mocks/secrets/secrets.mock';
import { Secret } from '@secret-manager/types/secret.type';
import { SecretSmartConfig } from '@secret-manager/utils/secretSmartConfig';
import { getOdsButtonByLabel } from '@ovh-ux/manager-core-test-utils';
import { SECRET_FORM_FIELD_TEST_IDS } from '@secret-manager/components/form/form.constants';
import { EditMetadataDrawerForm } from './EditMetadataDrawerForm.component';
import { labels as allLabels } from '@/utils/tests/init.i18n';
import {
  createErrorResponseMock,
  renderWithI18n,
} from '@/utils/tests/testUtils';
import { changeOdsInputValueByTestId } from '@/utils/tests/uiTestHelpers';

const labels = allLabels.secretManager;
const commonLabels = allLabels.common;

const mockUpdateSecret = vi.fn();
const mockUseUpdateSecret = vi.fn();
const mockUseSecretMetadataSchema = vi.fn();

vi.mock('@secret-manager/data/hooks/useUpdateSecret', () => ({
  useUpdateSecret: () => mockUseUpdateSecret(),
}));

const mockSecret: Secret = mockSecret1;
const mockSecretConfig: SecretSmartConfig = {
  casRequired: {
    value: true,
    origin: 'DOMAIN',
  },
  deactivateVersionAfter: {
    value: '10d10h10m10s',
    origin: 'SECRET',
  },
  maxVersions: {
    value: 5,
    origin: 'SECRET',
  },
  isCasRequiredSetOnOkms: true,
};

const mockOnDismiss = vi.fn();

const renderComponent = async () => {
  const user = userEvent.setup();

  const defaultProps = {
    secret: mockSecret,
    okmsId: 'test-okms-id',
    secretPath: 'test-secret-path',
    secretConfig: mockSecretConfig,
    onDismiss: mockOnDismiss,
  };

  const renderResult = await renderWithI18n(
    <EditMetadataDrawerForm {...defaultProps} />,
  );

  return {
    user,
    ...renderResult,
  };
};

const submitForm = async (container: HTMLElement, user: UserEvent) => {
  const submitButton = await getOdsButtonByLabel({
    container,
    label: commonLabels.actions.validate,
  });
  await act(() => user.click(submitButton));

  return submitButton;
};

describe('EditMetadataDrawerForm component test suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock implementations
    mockUseUpdateSecret.mockReturnValue({
      mutateAsync: mockUpdateSecret,
      isPending: false,
      error: null,
    });

    mockUseSecretMetadataSchema.mockReturnValue({
      safeParse: vi.fn().mockReturnValue({ success: true, data: {} }),
    });
  });

  describe('when component renders successfully', () => {
    it('should render form fields with correct default values', async () => {
      await renderComponent();

      // Should render form fields
      const input1 = screen.getByTestId(
        SECRET_FORM_FIELD_TEST_IDS.DEACTIVATE_VERSION_AFTER,
      );
      expect(input1).toBeInTheDocument();
      expect(input1).toHaveValue(mockSecretConfig.deactivateVersionAfter.value);

      const input2 = screen.getByTestId(
        SECRET_FORM_FIELD_TEST_IDS.MAX_VERSIONS,
      );
      expect(input2).toBeInTheDocument();
      expect(input2).toHaveValue(mockSecretConfig.maxVersions.value);

      const input3 = screen.getByTestId(
        SECRET_FORM_FIELD_TEST_IDS.CAS_REQUIRED_ACTIVE,
      );
      expect(input3).toBeInTheDocument();
      expect(input3).toHaveAttribute('is-checked', 'true');

      const input4 = screen.getByTestId(
        SECRET_FORM_FIELD_TEST_IDS.CAS_REQUIRED_INACTIVE,
      );
      expect(input4).toBeInTheDocument();
      expect(input4).not.toHaveAttribute('is-checked', 'true');
    });
  });

  describe('when update secret is successful', () => {
    it('should call updateSecret with correct parameters on form submission', async () => {
      // GIVEN
      const user = userEvent.setup();
      mockUpdateSecret.mockResolvedValue({});

      const { container } = await renderComponent();

      // WHEN
      const submitButton = await getOdsButtonByLabel({
        container,
        label: commonLabels.actions.validate,
      });
      await act(() => user.click(submitButton));

      // THEN
      await waitFor(() => {
        expect(mockUpdateSecret).toHaveBeenCalledWith({
          okmsId: 'test-okms-id',
          path: 'test-secret-path',
          cas: expect.any(Number),
          data: {
            metadata: expect.objectContaining({
              casRequired: mockSecretConfig.casRequired.value,
              deactivateVersionAfter:
                mockSecretConfig.deactivateVersionAfter.value,
              maxVersions: mockSecretConfig.maxVersions.value,
            }),
          },
        });
      });
    });

    it('should call onDismiss after successful update', async () => {
      // GIVEN
      mockUpdateSecret.mockResolvedValue({});

      const { container, user } = await renderComponent();

      // WHEN
      await submitForm(container, user);

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

      const { container, user } = await renderComponent();

      // WHEN
      await submitForm(container, user);

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
      const { container, user } = await renderComponent();

      // THEN
      const submitButton = await submitForm(container, user);
      expect(submitButton).toHaveAttribute('is-loading', 'true');
    });
  });

  describe('form validation', () => {
    it('should display form errors', async () => {
      const { container, user } = await renderComponent();

      await changeOdsInputValueByTestId(
        SECRET_FORM_FIELD_TEST_IDS.DEACTIVATE_VERSION_AFTER,
        'invalid-duration',
      );

      await submitForm(container, user);

      // Check if the error is displayed
      await waitFor(() => {
        expect(
          container.querySelector(
            `ods-form-field[error="${labels.error_invalid_duration}"]`,
          ),
        ).toBeInTheDocument();
      });
    });
  });
});

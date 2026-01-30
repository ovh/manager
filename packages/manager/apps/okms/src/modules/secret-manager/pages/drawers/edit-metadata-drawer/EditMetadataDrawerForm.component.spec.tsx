import { SECRET_FORM_FIELD_TEST_IDS } from '@secret-manager/components/form/form.constants';
import { mockSecret1 } from '@secret-manager/mocks/secrets/secrets.mock';
import { Secret } from '@secret-manager/types/secret.type';
import { SecretSmartConfig } from '@secret-manager/utils/secretSmartConfig';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent, { UserEvent } from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { labels as allLabels } from '@/common/utils/tests/init.i18n';
import { createErrorResponseMock } from '@/common/utils/tests/testUtils';
import { testWrapperBuilder } from '@/common/utils/tests/testWrapperBuilder';
import { changeOdsInputValueByTestId } from '@/common/utils/tests/uiTestHelpers';

import { EditMetadataDrawerForm } from './EditMetadataDrawerForm.component';

const labels = allLabels.secretManager;
const commonLabels = allLabels.common;

const mockUpdateSecret = vi.fn();
const mockUseUpdateSecret = vi.fn();

vi.mock('@secret-manager/data/hooks/useUpdateSecret', () => ({
  useUpdateSecret: (): unknown => mockUseUpdateSecret(),
}));

const mockUseOkmsById = vi.fn();
vi.mock('@key-management-service/data/hooks/useOkms', () => ({
  useOkmsById: (okmsId: string): unknown => mockUseOkmsById(okmsId),
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
  maxVersionsDefault: 10,
};

const mockOnDismiss = vi.fn();

// Mock the useSecretSmartConfig hook
vi.mock('@secret-manager/hooks/useSecretSmartConfig', () => ({
  useSecretSmartConfig: (): unknown => ({
    isPending: false,
    isError: false,
    secretConfig: mockSecretConfig,
  }),
}));

const renderComponent = async () => {
  const defaultProps = {
    secret: mockSecret,
    okmsId: 'test-okms-id',
    secretPath: 'test-secret-path',
    secretConfig: mockSecretConfig,
    onDismiss: mockOnDismiss,
  };

  const wrapper = await testWrapperBuilder().withI18next().withQueryClient().build();

  const rendered = render(<EditMetadataDrawerForm {...defaultProps} />, { wrapper });

  // Wait the radio group to be rendered to avoid warnings
  await waitFor(() => {
    expect(screen.getByTestId(SECRET_FORM_FIELD_TEST_IDS.CAS_REQUIRED_ACTIVE)).toBeInTheDocument();
  });

  return rendered;
};

const submitForm = async (user: UserEvent) => {
  const submitButton = screen.getByRole('button', {
    name: commonLabels.actions.validate,
  });
  await act(async () => {
    await user.click(submitButton);
  });

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
  });

  describe('when component renders successfully', () => {
    it('should render form fields with correct default values', async () => {
      await renderComponent();

      // Should render form fields
      const input1 = screen.getByTestId(SECRET_FORM_FIELD_TEST_IDS.DEACTIVATE_VERSION_AFTER);
      expect(input1).toBeInTheDocument();
      expect(input1).toHaveValue(mockSecretConfig.deactivateVersionAfter.value);

      const input2 = screen.getByTestId(SECRET_FORM_FIELD_TEST_IDS.MAX_VERSIONS);
      expect(input2).toBeInTheDocument();
      expect(input2).toHaveValue(mockSecretConfig.maxVersions.value);

      const input3 = screen.getByRole('radio', {
        name: allLabels.secretManager.activated,
      });
      expect(input3).toBeInTheDocument();
      expect(input3).toBeChecked();

      const input4 = screen.getByRole('radio', {
        name: allLabels.common.status.disabled,
      });
      expect(input4).toBeInTheDocument();
      expect(input4).not.toBeChecked();
    });
  });

  describe('when update secret is successful', () => {
    it('should call updateSecret with correct parameters on form submission', async () => {
      // GIVEN
      const user = userEvent.setup();
      mockUpdateSecret.mockResolvedValue({});

      await renderComponent();

      // WHEN
      const submitButton = screen.getByRole('button', {
        name: commonLabels.actions.validate,
      });
      await act(() => user.click(submitButton));

      // THEN
      await waitFor(() => {
        expect(mockUpdateSecret).toHaveBeenCalledWith({
          okmsId: 'test-okms-id',
          path: 'test-secret-path',
          cas: expect.any(Number) as number,
          data: {
            metadata: expect.objectContaining({
              casRequired: mockSecretConfig.casRequired.value,
              deactivateVersionAfter: mockSecretConfig.deactivateVersionAfter.value,
              maxVersions: mockSecretConfig.maxVersions.value,
            }) as Record<string, unknown>,
          },
        });
      });
    });

    it('should call onDismiss after successful update', async () => {
      const user = userEvent.setup();
      // GIVEN
      mockUpdateSecret.mockResolvedValue({});

      await renderComponent();

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
      const user = userEvent.setup();
      // GIVEN
      mockUpdateSecret.mockRejectedValue(new Error('Update failed'));

      await renderComponent();

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
      const user = userEvent.setup();
      // GIVEN
      mockUseUpdateSecret.mockReturnValue({
        mutateAsync: mockUpdateSecret,
        isPending: true,
        error: null,
      });

      // WHEN
      await renderComponent();

      // THEN
      const submitButton = await submitForm(user);

      // The submit button should contain a spinner while loading
      await waitFor(() => {
        expect(submitButton.querySelector('[data-ods="spinner"]')).toBeInTheDocument();
      });
    });
  });

  // TODO: [ODS19] Fix this test when ODS19 is migrated
  // Test is flaky, and there is a lot of chance that is is somehow related to ODS19
  describe.skip('form validation', () => {
    it('should display form errors', async () => {
      const user = userEvent.setup();
      const { container } = await renderComponent();

      await changeOdsInputValueByTestId(
        SECRET_FORM_FIELD_TEST_IDS.DEACTIVATE_VERSION_AFTER,
        'invalid-duration',
      );

      await submitForm(user);

      // Check if the error is displayed
      await waitFor(() => {
        expect(
          container.querySelector(`ods-form-field[error="${labels.error_invalid_duration}"]`),
        ).toBeInTheDocument();
      });
    });
  });
});

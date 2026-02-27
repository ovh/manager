import { useSearchParams } from 'react-router-dom';

import { okmsRoubaix1Mock } from '@key-management-service/mocks/kms/okms.mock';
import { SECRET_FORM_FIELD_TEST_IDS } from '@secret-manager/components/form/form.constants';
import { KEY_VALUES_EDITOR_TEST_IDS } from '@secret-manager/components/form/key-values-editor/keyValuesEditor.constants';
import { mockSecretConfigOkms } from '@secret-manager/mocks/secret-config-okms/secretConfigOkms.mock';
import { mockSecretConfigReference } from '@secret-manager/mocks/secret-reference/secretReference.mock';
import { SECRET_FORM_TEST_IDS } from '@secret-manager/pages/create-secret/SecretForm.constants';
import {
  MOCK_DATA_VALID_JSON,
  MOCK_PATH_VALID,
} from '@secret-manager/utils/tests/secret.constants';
import { act, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { labels } from '@/common/utils/tests/init.i18n';
import { testWrapperBuilder } from '@/common/utils/tests/testWrapperBuilder';
import { assertTextVisibility } from '@/common/utils/tests/uiTestHelpers';
import {
  changeInputValueByTestId,
  clickJsonEditorToggle,
} from '@/common/utils/tests/uiTestHelpers';

import { SecretForm } from './SecretForm.component';

vi.mock('react-router-dom', async (importOriginal) => {
  const module: typeof import('react-router-dom') = await importOriginal();
  return {
    ...module,
    useNavigate: () => vi.fn(),
    useSearchParams: vi.fn(),
  };
});

vi.mocked(useSearchParams).mockReturnValue([new URLSearchParams(), vi.fn()]);

// Mock the useOkmsById hook
const mockUseOkmsById = vi.fn();
vi.mock('@key-management-service/data/hooks/useOkms', () => ({
  useOkmsById: (okmsId: string): unknown => mockUseOkmsById(okmsId),
}));

// Mock the useSecretConfigOkms hook
const mockUseSecretConfigOkms = vi.fn();
vi.mock('@secret-manager/data/hooks/useSecretConfigOkms', () => ({
  useSecretConfigOkms: (okmsId: string): unknown => mockUseSecretConfigOkms(okmsId),
}));

// Mock the useSecretConfigReference hook
const mockUseSecretConfigReference = vi.fn();
vi.mock('@secret-manager/data/hooks/useSecretConfigReference', () => ({
  useSecretConfigReference: (region: string): unknown => mockUseSecretConfigReference(region),
}));

/**
 * Renders the secret form
 */
const renderSecretForm = async (okmsId?: string) => {
  const wrapper = await testWrapperBuilder().withI18next().withQueryClient().build();
  return render(<SecretForm okmsId={okmsId} />, { wrapper });
};

const MOCK_OKMS_ID = 'a1c3e7f8-5fc5-4c4e-8eac-60076ac25c00';

describe('Secrets creation form test suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock implementations
    mockUseOkmsById.mockReturnValue({
      data: okmsRoubaix1Mock,
      isPending: false,
      error: null,
    });
    mockUseSecretConfigOkms.mockReturnValue({
      data: mockSecretConfigOkms,
      isPending: false,
      error: null,
    });
    mockUseSecretConfigReference.mockReturnValue({
      data: mockSecretConfigReference,
      isPending: false,
      error: null,
    });
  });
  it.each([
    { shouldButtonBeDisabled: true },
    {
      data: MOCK_DATA_VALID_JSON,

      shouldButtonBeDisabled: true,
    },
    {
      path: MOCK_PATH_VALID,

      shouldButtonBeDisabled: true,
    },
    { selectedOkmsId: MOCK_OKMS_ID, shouldButtonBeDisabled: true },
    {
      data: MOCK_DATA_VALID_JSON,
      path: MOCK_PATH_VALID,

      shouldButtonBeDisabled: true,
    },
    {
      data: MOCK_DATA_VALID_JSON,
      path: MOCK_PATH_VALID,
      selectedOkmsId: MOCK_OKMS_ID,
      shouldButtonBeDisabled: false,
    },
  ])(
    'should check the form validity for data: $data, path: $path and a selectedOkms: $selectedOkmsId',
    async ({ data, path, selectedOkmsId, shouldButtonBeDisabled }) => {
      // GIVEN
      const user = userEvent.setup();
      await renderSecretForm(selectedOkmsId);
      await assertTextVisibility(labels.secretManager.create_secret_form_secret_section_title);

      // WHEN
      await clickJsonEditorToggle(user);

      if (path) {
        await changeInputValueByTestId(SECRET_FORM_TEST_IDS.INPUT_PATH, path);
      }
      if (data) {
        const input = await screen.findByTestId(SECRET_FORM_FIELD_TEST_IDS.INPUT_DATA);

        // clean first the input
        await act(() => user.clear(input));
        // then type the new value
        const escaped = data.replace(/{/g, '{{');
        await act(() => user.type(input, escaped));
      }

      // THEN
      const submitButton = screen.getByTestId(SECRET_FORM_TEST_IDS.SUBMIT_BUTTON);
      expect(submitButton).toBeInTheDocument();

      await waitFor(() =>
        shouldButtonBeDisabled
          ? expect(submitButton).toBeDisabled()
          : expect(submitButton).toBeEnabled(),
      );
    },
  );

  it('should hide optional fields when toggles are disabled', async () => {
    // GIVEN
    await renderSecretForm(MOCK_OKMS_ID);
    await assertTextVisibility(labels.secretManager.create_secret_form_secret_section_title);

    // THEN - fields should not be visible
    expect(
      screen.queryByTestId(SECRET_FORM_FIELD_TEST_IDS.DEACTIVATE_VERSION_AFTER),
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId(SECRET_FORM_FIELD_TEST_IDS.MAX_VERSIONS)).not.toBeInTheDocument();
    expect(
      screen.queryByTestId(SECRET_FORM_FIELD_TEST_IDS.CAS_REQUIRED_ACTIVE),
    ).not.toBeInTheDocument();
  });

  it('should show optional fields when toggles are enabled', async () => {
    // GIVEN
    const user = userEvent.setup();
    await renderSecretForm(MOCK_OKMS_ID);
    await assertTextVisibility(labels.secretManager.create_secret_form_secret_section_title);

    // WHEN - enable deactivate version after toggle
    await act(() =>
      user.click(
        screen.getByRole('checkbox', {
          name: labels.secretManager.enable_deactivate_version_after,
        }),
      ),
    );

    // THEN - field should be visible
    await waitFor(() => {
      expect(
        screen.getByTestId(SECRET_FORM_FIELD_TEST_IDS.DEACTIVATE_VERSION_AFTER),
      ).toBeInTheDocument();
    });

    // WHEN - enable max versions toggle
    await act(() =>
      user.click(
        screen.getByRole('checkbox', {
          name: labels.secretManager.enable_max_versions,
        }),
      ),
    );

    // THEN - field should be visible
    await waitFor(() => {
      expect(screen.getByTestId(SECRET_FORM_FIELD_TEST_IDS.MAX_VERSIONS)).toBeInTheDocument();
    });

    // WHEN - enable CAS required toggle
    await act(() =>
      user.click(
        screen.getByRole('checkbox', {
          name: labels.secretManager.enable_cas_required,
        }),
      ),
    );

    // THEN - field should be visible
    await waitFor(() => {
      expect(
        screen.getByTestId(SECRET_FORM_FIELD_TEST_IDS.CAS_REQUIRED_ACTIVE),
      ).toBeInTheDocument();
    });
  });

  describe('custom metadata section', () => {
    it('should render the custom metadata section with toggle', async () => {
      await renderSecretForm(MOCK_OKMS_ID);
      await assertTextVisibility(labels.secretManager.create_secret_form_secret_section_title);

      expect(screen.getByTestId(SECRET_FORM_TEST_IDS.CUSTOM_METADATA_SECTION)).toBeInTheDocument();
      expect(
        screen.getByRole('checkbox', {
          name: labels.secretManager.custom_metadata_title,
        }),
      ).toBeInTheDocument();
    });

    it('should show KeyValuesEditor with one row and Add row button when toggle is enabled', async () => {
      const user = userEvent.setup();
      await renderSecretForm(MOCK_OKMS_ID);
      await assertTextVisibility(labels.secretManager.create_secret_form_secret_section_title);

      await act(() =>
        user.click(
          screen.getByRole('checkbox', {
            name: labels.secretManager.custom_metadata_title,
          }),
        ),
      );

      const customMetadataSection = screen.getByTestId(
        SECRET_FORM_TEST_IDS.CUSTOM_METADATA_SECTION,
      );
      await waitFor(() => {
        expect(
          within(customMetadataSection).getByTestId(KEY_VALUES_EDITOR_TEST_IDS.pairItemKeyInput(0)),
        ).toBeInTheDocument();
      });
      expect(
        within(customMetadataSection).getByRole('button', {
          name: labels.secretManager.add_row,
        }),
      ).toBeInTheDocument();
    });

    it('should add a second key-value row when clicking Add row', async () => {
      const user = userEvent.setup();
      await renderSecretForm(MOCK_OKMS_ID);
      await assertTextVisibility(labels.secretManager.create_secret_form_secret_section_title);

      await act(() =>
        user.click(
          screen.getByRole('checkbox', {
            name: labels.secretManager.custom_metadata_title,
          }),
        ),
      );

      const customMetadataSection = screen.getByTestId(
        SECRET_FORM_TEST_IDS.CUSTOM_METADATA_SECTION,
      );
      await waitFor(() => {
        expect(
          within(customMetadataSection).getByTestId(KEY_VALUES_EDITOR_TEST_IDS.pairItemKeyInput(0)),
        ).toBeInTheDocument();
      });

      await act(() =>
        user.click(
          within(customMetadataSection).getByRole('button', {
            name: labels.secretManager.add_row,
          }),
        ),
      );

      await waitFor(() => {
        expect(
          within(customMetadataSection).getByTestId(KEY_VALUES_EDITOR_TEST_IDS.pairItemKeyInput(1)),
        ).toBeInTheDocument();
      });
    });
  });
});

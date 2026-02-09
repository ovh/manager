import { useSearchParams } from 'react-router-dom';

import { okmsRoubaix1Mock } from '@key-management-service/mocks/kms/okms.mock';
import { SECRET_FORM_FIELD_TEST_IDS } from '@secret-manager/components/form/form.constants';
import { mockSecretConfigOkms } from '@secret-manager/mocks/secret-config-okms/secretConfigOkms.mock';
import { mockSecretConfigReference } from '@secret-manager/mocks/secret-reference/secretReference.mock';
import { SECRET_FORM_TEST_IDS } from '@secret-manager/pages/create-secret/SecretForm.constants';
import {
  MOCK_DATA_VALID_JSON,
  MOCK_PATH_VALID,
} from '@secret-manager/utils/tests/secret.constants';
import { act, render, screen, waitFor } from '@testing-library/react';
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
    useHref: vi.fn((link: string) => link),
    useSearchParams: vi.fn(),
  };
});

// Mocking ODS Input component
vi.mock('@ovhcloud/ods-components/react', async () => {
  const { odsInputMock, odsTextareaMock, odsSwitchMock, odsSwitchItemMock, odsQuantityMock } =
    await import('@/common/utils/tests/odsMocks');
  const original = await vi.importActual('@ovhcloud/ods-components/react');
  return {
    ...original,
    OdsInput: vi.fn(odsInputMock),
    OdsTextarea: vi.fn(odsTextareaMock),
    OdsSwitch: vi.fn(odsSwitchMock),
    OdsSwitchItem: vi.fn(odsSwitchItemMock),
    OdsQuantity: vi.fn(odsQuantityMock),
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
});

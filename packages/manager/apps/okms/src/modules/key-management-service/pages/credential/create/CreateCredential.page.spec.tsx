import { credentialMock2 } from '@key-management-service/mocks/credentials/credentials.mock';
import { identityUserMock1 } from '@key-management-service/mocks/identity/identityUsers.mock';
import { okmsRoubaix1Mock } from '@key-management-service/mocks/kms/okms.mock';
import { kmsServicesMock } from '@key-management-service/mocks/services/services.mock';
import { KMS_ROUTES_URLS } from '@key-management-service/routes/routes.constants';
import { OKMS } from '@key-management-service/types/okms.type';
import { act, screen, waitFor, within } from '@testing-library/react';
import userEvent, { UserEvent } from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { labels } from '@/common/utils/tests/init.i18n';
import { renderTestApp } from '@/common/utils/tests/renderTestApp';
import {
  assertModalVisibility,
  assertTitleVisibility,
  changeInputValueByTestId,
} from '@/common/utils/tests/uiTestHelpers';

const WAIT_TIMEOUT = { timeout: 5000 };
const mockOkmsItem: OKMS = {
  ...okmsRoubaix1Mock,
  iam: {
    ...okmsRoubaix1Mock.iam,
    displayName: kmsServicesMock.resource.displayName,
  },
};
const mockCreatedCredentials = credentialMock2;
const mockCredentialsCreatePageUrl = KMS_ROUTES_URLS.credentialCreate(mockOkmsItem.id);
const mockIdentityUser = identityUserMock1;

/* HELPERS */

const renderPage = async (options: { fromCSR: boolean }) => {
  const { container } = await renderTestApp(mockCredentialsCreatePageUrl, {
    fromCSR: options.fromCSR,
  });

  // Check title
  await assertTitleVisibility({
    title: labels.credentials.key_management_service_credential_create_title,
    level: 1,
  });

  return { container };
};

const testStep1Content = () => {
  const inputName = screen.getByTestId('input-name');
  const inputDescription = screen.getByTestId('input-description');
  const inputValidity = screen.getByTestId('input-validity-period');
  const radioMethodKeyWrapper = screen.getByTestId('radio-method-key');
  const radioMethodNoKeyWrapper = screen.getByTestId('radio-method-no-key');
  const radioCertificateTypeECWrapper = screen.getByTestId('radio-certificate-type-ec');
  const radioCertificateTypeRSAWrapper = screen.getByTestId('radio-certificate-type-rsa');

  expect(inputName).toBeInTheDocument();
  expect(inputDescription).toBeInTheDocument();
  expect(inputValidity).toBeInTheDocument();
  expect(radioMethodKeyWrapper).toBeInTheDocument();
  expect(radioMethodNoKeyWrapper).toBeInTheDocument();
  expect(radioCertificateTypeECWrapper).toBeInTheDocument();
  expect(radioCertificateTypeRSAWrapper).toBeInTheDocument();

  // Get the radio input elements within the Radio components
  const inputMethodKey = within(radioMethodKeyWrapper).getByRole('radio');
  const inputMethodNoKey = within(radioMethodNoKeyWrapper).getByRole('radio');
  const inputCertificateTypeEC = within(radioCertificateTypeECWrapper).getByRole('radio');
  const inputCertificateTypeRSA = within(radioCertificateTypeRSAWrapper).getByRole('radio');

  // Check checked state using ODS19 standard checked attribute
  expect(inputMethodKey).not.toBeChecked();
  expect(inputMethodNoKey).toBeChecked();
  expect(inputCertificateTypeEC).toBeChecked();
  expect(inputCertificateTypeRSA).not.toBeChecked();

  const buttonNextStep = screen.getByRole('button', {
    name: labels.credentials.key_management_service_credential_create_cta_add_identities,
  });
  expect(buttonNextStep).toBeDisabled();

  return {
    buttonNextStep,
    inputMethodKey,
    inputMethodNoKey,
    inputCertificateTypeEC,
    inputCertificateTypeRSA,
  };
};

const testStep2Content = async () => {
  // Check title
  await assertTitleVisibility({
    title: labels.credentials.key_management_service_credential_create_identities_title,
    level: 3,
  });

  // Check add users button
  const buttonOpenAddUsersModal = screen.getByRole('button', {
    name: labels.credentials
      .key_management_service_credential_create_identities_users_list_button_add_label,
  });
  expect(buttonOpenAddUsersModal).toBeInTheDocument();

  // Check create credentials button
  const buttonCreateCredentials = screen.getByRole('button', {
    name: labels.credentials
      .key_management_service_credential_create_identities_button_create_label,
  });
  expect(buttonCreateCredentials).toBeInTheDocument();
  expect(buttonCreateCredentials).toBeDisabled();

  return {
    buttonOpenAddUsersModal,
    buttonCreateCredentials,
  };
};

const testStep2ContentAddUsersModal = async (container: HTMLElement) => {
  // Wait for modal to open
  await assertModalVisibility();

  // Check modal title
  await assertTitleVisibility({
    title: labels.credentials.key_management_service_credentials_identity_modal_user_list_headline,
    level: 4,
  });

  // Wait for spinner to disappear
  await waitFor(() => {
    expect(container.querySelector('spinner')).not.toBeInTheDocument();
  }, WAIT_TIMEOUT);

  // Get user 1 card
  const user1Card = await screen.findByText(mockIdentityUser.email);

  // Get submit button
  const buttonAddUsers = screen.getByRole('button', {
    name: labels.common.actions.add,
  });

  return {
    buttonAddUsers,
    user1Card,
  };
};

const testStep3Content = async () => {
  // Check new credentials id
  expect(await screen.findByText(mockCreatedCredentials.id)).toBeVisible();

  // Check "download private key" button
  expect(
    await screen.findByText(
      labels.credentials[
        'key_management_service_credential_create_confirmation_private-key_download_label'
      ],
    ),
  ).toBeInTheDocument();

  // Check for success notification
  expect(
    await screen.findByText(labels.credentials.key_management_service_credential_create_success),
  ).toBeVisible();

  // Get submit button
  const buttonFinish = screen.getByRole('button', {
    name: labels.credentials
      .key_management_service_credential_create_confirmation_button_done_label,
  });

  // Get confirmation checkbox
  const checkboxConfirm = await screen.findByTestId('confirmation-private-key-label');
  expect(checkboxConfirm).toBeInTheDocument();

  return {
    buttonFinish,
    checkboxConfirm,
  };
};

const assertCredentialListPageVisibility = async () => {
  // Check title on kms credentials list page
  await assertTitleVisibility({
    title: mockOkmsItem.iam.displayName,
    level: 1,
  });
};

const testStep1 = async (user: UserEvent) => {
  // Check and get content of step 1
  const { buttonNextStep } = testStep1Content();

  // Fill the name
  await changeInputValueByTestId('input-name', 'test-value-input');

  // Check submit button is enabled
  await waitFor(() => {
    expect(buttonNextStep).toBeEnabled();
  });

  // Submit step 1
  await act(async () => {
    await user.click(buttonNextStep);
  });
};

const testStep1CustomCsr = async (user: UserEvent) => {
  // Check and get content of step 1
  const { buttonNextStep, inputMethodKey, inputCertificateTypeEC, inputCertificateTypeRSA } =
    testStep1Content();

  // Fill the name
  await changeInputValueByTestId('input-name', 'test-value-input');

  // Check submit button is enabled
  await waitFor(() => {
    expect(buttonNextStep).toBeEnabled();
  });

  // choose the custom csr option
  await act(async () => {
    await user.click(inputMethodKey);
  });

  // check that the form has updated properly
  const inputCsr = screen.getByTestId('textarea-csr');
  expect(inputCsr).toBeVisible();
  expect(inputCertificateTypeEC).not.toBeVisible();
  expect(inputCertificateTypeRSA).not.toBeVisible();
  await waitFor(() => {
    expect(buttonNextStep).toBeDisabled();
  });

  // Fill the csr
  await changeInputValueByTestId('textarea-csr', 'custom-csr-value');

  // Check submit button is enabled
  await waitFor(() => {
    expect(buttonNextStep).toBeEnabled();
  });

  // Submit step 1
  await act(async () => {
    await user.click(buttonNextStep);
  });
};

const testStep2 = async (container: HTMLElement, user: UserEvent) => {
  // Check and get content of step 2
  const { buttonOpenAddUsersModal, buttonCreateCredentials } = await testStep2Content();

  // Open user selection modal
  await act(async () => {
    await user.click(buttonOpenAddUsersModal);
  });

  // Check modal title
  const { user1Card, buttonAddUsers } = await testStep2ContentAddUsersModal(container);

  // Select user 1
  await act(async () => {
    await user.click(user1Card);
  });

  // Close modal
  await act(async () => {
    await user.click(buttonAddUsers);
  });

  // Wait for modal to close
  await assertModalVisibility({ state: 'hidden' });

  // Check user1 is added to the list
  expect(await screen.findByText(mockIdentityUser.login, {}, WAIT_TIMEOUT)).toBeInTheDocument();

  // Check submit button is enabled
  await waitFor(() => {
    expect(buttonCreateCredentials).toBeEnabled();
  }, WAIT_TIMEOUT);

  // Submit step 2
  await act(async () => {
    await user.click(buttonCreateCredentials);
  });
};

const testStep3 = async (user: UserEvent) => {
  // Check and get step 3 content
  const { buttonFinish, checkboxConfirm } = await testStep3Content();

  expect(buttonFinish).toBeDisabled();

  // Check confirmation checkbox
  await act(async () => {
    await user.click(checkboxConfirm);
  });

  await waitFor(() => {
    expect(buttonFinish).toBeEnabled();
  });

  // Submit step 3
  await act(async () => {
    await user.click(buttonFinish);
  });
};

/* TESTS */

describe('Create Credentials Page test suite', () => {
  it('should display the page correctly', async () => {
    await renderPage({ fromCSR: false });
    const { buttonNextStep } = testStep1Content();
    expect(buttonNextStep).toBeDisabled();
  });

  it('should execute the credential creation workflow correctly', async () => {
    const user = userEvent.setup();
    const { container } = await renderPage({ fromCSR: false });

    await testStep1(user);

    await testStep2(container, user);

    await testStep3(user);

    await assertCredentialListPageVisibility();
  });

  it('should skip step 3 if credentials comes from CSR', async () => {
    const user = userEvent.setup();
    const { container } = await renderPage({ fromCSR: true });

    await testStep1CustomCsr(user);
    await testStep2(container, user);

    await assertCredentialListPageVisibility();
  });
});

import { credentialMock2 } from '@key-management-service/mocks/credentials/credentials.mock';
import { identityUserMock1 } from '@key-management-service/mocks/identity/identityUsers.mock';
import { okmsRoubaix1Mock } from '@key-management-service/mocks/kms/okms.mock';
import { kmsServicesMock } from '@key-management-service/mocks/services/services.mock';
import { KMS_ROUTES_URLS } from '@key-management-service/routes/routes.constants';
import { OKMS } from '@key-management-service/types/okms.type';
import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent, { UserEvent } from '@testing-library/user-event';
import { describe, it } from 'vitest';

import { assertOdsModalVisibility, getOdsButtonByLabel } from '@ovh-ux/manager-core-test-utils';

import { labels } from '@/common/utils/tests/init.i18n';
import { renderTestApp } from '@/common/utils/tests/renderTestApp';

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

  // Wait for initial loading (okms data) to complete - check for both progressbar and page-spinner
  await waitFor(
    () => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      expect(screen.queryByTestId('page-spinner')).not.toBeInTheDocument();
    },
    { timeout: 10_000 },
  );

  // Wait for Suspense to resolve and page content to load
  await waitFor(
    () => {
      // Check that loading components are gone
      const loadingElements = container.querySelectorAll('[class*="loading"], [class*="spinner"]');
      expect(loadingElements.length).toBe(0);
    },
    { timeout: 10_000 },
  );

  // Check title - wait for it to appear
  await waitFor(
    () => {
      expect(
        screen.getByText(labels.credentials.key_management_service_credential_create_title),
      ).toBeVisible();
    },
    { timeout: 10_000 },
  );

  return { container };
};

const testContentStep1 = async (container: HTMLElement) => {
  const inputName = screen.getByTestId('input-name');
  const inputDescription = screen.getByTestId('input-description');
  const inputValidity = screen.getByTestId('input-validity-period');
  const inputMethodKey = screen.getByTestId('radio-method-key');
  const inputMethodNoKey = screen.getByTestId('radio-method-no-key');
  const inputCertificateTypeEC = screen.getByTestId('radio-certificate-type-ec');
  const inputCertificateTypeRSA = screen.getByTestId('radio-certificate-type-rsa');

  expect(inputName).toBeInTheDocument();
  expect(inputDescription).toBeInTheDocument();
  expect(inputValidity).toBeInTheDocument();
  expect(inputMethodKey).toBeInTheDocument();
  expect(inputMethodKey).toHaveAttribute('is-checked', 'false');
  expect(inputMethodNoKey).toBeInTheDocument();
  expect(inputMethodNoKey).toHaveAttribute('is-checked', 'true');
  expect(inputCertificateTypeEC).toBeInTheDocument();
  expect(inputCertificateTypeEC).toHaveAttribute('is-checked', 'true');
  expect(inputCertificateTypeRSA).toBeInTheDocument();
  expect(inputCertificateTypeRSA).toHaveAttribute('is-checked', 'false');

  const buttonNextStep = await getOdsButtonByLabel({
    container,
    disabled: true,
    label: labels.credentials.key_management_service_credential_create_cta_add_identities,
  });
  expect(buttonNextStep).toBeDisabled();

  return {
    buttonNextStep,
    inputName,
    inputDescription,
    inputValidity,
    inputMethodKey,
    inputMethodNoKey,
    inputCertificateTypeEC,
    inputCertificateTypeRSA,
  };
};

const testContentStep2 = async (container: HTMLElement) => {
  // Check title
  expect(
    await screen.findByText(
      labels.credentials.key_management_service_credential_create_identities_title,
    ),
  ).toBeVisible();

  // Check add users button
  const buttonAddUsersModal = await getOdsButtonByLabel({
    container,
    label:
      labels.credentials
        .key_management_service_credential_create_identities_users_list_button_add_label,
  });

  // Check create credentials button
  const buttonCreateCredentials = await getOdsButtonByLabel({
    container,
    disabled: true,
    label:
      labels.credentials.key_management_service_credential_create_identities_button_create_label,
  });
  expect(buttonCreateCredentials).toBeDisabled();

  return {
    buttonAddUsersModal,
    buttonCreateCredentials,
  };
};

const testContentStep2AddUsersModal = async (container: HTMLElement) => {
  // Wait for modal to open
  await waitFor(async () => {
    await assertOdsModalVisibility({ container, isVisible: true });
  }, WAIT_TIMEOUT);

  // Check modal title
  expect(
    await screen.findByText(
      labels.credentials.key_management_service_credentials_identity_modal_user_list_headline,
    ),
  ).toBeVisible();

  // Check a spinner is shown
  await waitFor(() => {
    expect(container.querySelector('ods-spinner')).toBeInTheDocument();
  }, WAIT_TIMEOUT);

  // Wait for spinner to disappear
  await waitFor(() => {
    expect(container.querySelector('ods-spinner')).not.toBeInTheDocument();
  }, WAIT_TIMEOUT);

  // Get user 1 card
  const user1Card = screen.getByText(mockIdentityUser.email);

  // Get submit button
  const buttonAddUsers = await getOdsButtonByLabel({
    container,
    label: labels.credentials.key_management_service_credentials_identity_modal_user_list_add,
  });

  return {
    buttonAddUsers,
    user1Card,
  };
};

const testContentStep3 = async (container: HTMLElement) => {
  // Check new credentials id
  expect(await screen.findByText(mockCreatedCredentials.id)).toBeVisible();

  // Check "download private key" button
  await getOdsButtonByLabel({
    container,
    isLink: true,
    label:
      labels.credentials[
        'key_management_service_credential_create_confirmation_private-key_download_label'
      ],
  });

  // Check for success notification
  expect(
    await screen.findByText(labels.credentials.key_management_service_credential_create_success),
  ).toBeVisible();

  // Get submit button
  const buttonFinish = await getOdsButtonByLabel({
    container,
    disabled: true,
    label:
      labels.credentials.key_management_service_credential_create_confirmation_button_done_label,
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
  // Wait for navigation and loading to complete
  await waitFor(
    () => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      expect(screen.queryByTestId('page-spinner')).not.toBeInTheDocument();
    },
    { timeout: 10_000 },
  );

  // Wait for page to fully load before checking content
  await waitFor(
    () => {
      // Check kms display name
      expect(screen.getByText(mockOkmsItem.iam.displayName)).toBeVisible();
    },
    { timeout: 10_000 },
  );

  // Check headline on credentials list page
  await waitFor(
    () => {
      expect(
        screen.getByText(labels.credentials.key_management_service_credential_headline),
      ).toBeVisible();
    },
    { timeout: 10_000 },
  );
};

const testStep1 = async (container: HTMLElement, user: UserEvent) => {
  // Check and get content of step 1
  const { inputName, buttonNextStep } = await testContentStep1(container);

  // Fill the name
  fireEvent.input(inputName, { target: { value: 'test-value-input' } });

  // Check submit button is enabled
  await waitFor(() => {
    expect(buttonNextStep).toBeEnabled();
  });

  // Submit step 1
  await act(async () => {
    await user.click(buttonNextStep);
  });
};

const testStep1CustomCsr = async (container: HTMLElement, user: UserEvent) => {
  // Check and get content of step 1
  const {
    inputName,
    buttonNextStep,
    inputMethodKey,
    inputCertificateTypeEC,
    inputCertificateTypeRSA,
  } = await testContentStep1(container);

  // Fill the name
  fireEvent.input(inputName, { target: { value: 'test-value-input' } });

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
  fireEvent.input(inputCsr, { target: { value: 'custom-csr-value' } });

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
  const { buttonAddUsersModal, buttonCreateCredentials } = await testContentStep2(container);

  // Open user selection modal
  await act(async () => {
    await user.click(buttonAddUsersModal);
  });

  // Check modal title
  const { user1Card, buttonAddUsers } = await testContentStep2AddUsersModal(container);

  // Select user 1
  await act(async () => {
    await user.click(user1Card);
  });

  // Close modal
  await act(async () => {
    await user.click(buttonAddUsers);
  });

  // Wait for modal to close
  await waitFor(async () => {
    await assertOdsModalVisibility({ container, isVisible: false });
  }, WAIT_TIMEOUT);

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

const testStep3 = async (container: HTMLElement, user: UserEvent) => {
  // Check and get step 3 content
  const { buttonFinish, checkboxConfirm } = await testContentStep3(container);

  expect(buttonFinish).toBeDisabled();

  // Check confirmation checkbox
  fireEvent.click(checkboxConfirm);

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
    const { container } = await renderPage({ fromCSR: false });
    const { buttonNextStep } = await testContentStep1(container);
    expect(buttonNextStep).toBeDisabled();
  });

  it('should execute the credential creation workflow correctly', async () => {
    const user = userEvent.setup();
    const { container } = await renderPage({ fromCSR: false });

    await testStep1(container, user);

    await testStep2(container, user);

    await testStep3(container, user);

    await assertCredentialListPageVisibility();
  });

  it('should skip step 3 if credentials comes from CSR', async () => {
    const user = userEvent.setup();
    const { container } = await renderPage({ fromCSR: true });

    await testStep1CustomCsr(container, user);
    await testStep2(container, user);

    await assertCredentialListPageVisibility();
  });
});

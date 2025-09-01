import React from 'react';
import { describe, vi, expect, test, beforeEach, afterEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getOdsButtonByLabel } from '@ovh-ux/manager-core-test-utils';
import {
  CertificateType,
  DownloadKmsPublicCaLink,
} from './DownloadKmsPublicCaLink';
import * as api from '@/data/api/okms';
import { initiateTextFileDownload } from '@/utils/dom/download';
import { OKMS } from '@/types/okms.type';

const addErrorMock = vi.fn();
vi.mock('@ovh-ux/manager-react-components', () => ({
  useNotifications: () => ({
    addError: addErrorMock,
  }),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (translationKey: string) => translationKey,
  }),
}));

vi.mock('@/utils/dom/download', () => ({
  initiateTextFileDownload: vi.fn(),
}));

const mockOkms = {
  id: 'test-okms-id',
  region: 'test-region',
} as OKMS;

const mockCertificates = {
  publicCA:
    '-----BEGIN CERTIFICATE-----\nMIIDDummyCertificate\n-----END CERTIFICATE-----',
  publicRsaCA:
    '-----BEGIN CERTIFICATE-----\nMIIDummyRsaCertificate\n-----END CERTIFICATE-----',
};

const renderComponentAndGetLink = async ({
  type,
  label,
}: {
  type: CertificateType;
  label: string;
}) => {
  const { container } = render(
    <DownloadKmsPublicCaLink okms={mockOkms} type={type} />,
  );

  const downloadLink = await getOdsButtonByLabel({
    container,
    label,
    isLink: true,
  });

  return { downloadLink };
};

describe('DownloadKmsPublicCaLink component tests suite', () => {
  beforeEach(() => {
    vi.spyOn(api, 'getOkmsPublicCa').mockResolvedValue(mockCertificates);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('should render publicCa download link correctly', async () => {
    const { downloadLink } = await renderComponentAndGetLink({
      type: 'publicCa',
      label: 'key_management_service_dashboard_button_label_download_ca',
    });
    expect(downloadLink).toBeInTheDocument();
  });

  test('should render publicRsaCa download link correctly', async () => {
    const { downloadLink } = await renderComponentAndGetLink({
      type: 'publicRsaCa',
      label: 'key_management_service_dashboard_button_label_download_rsa_ca',
    });
    expect(downloadLink).toBeInTheDocument();
  });

  test('should download publicCa certificate when clicked', async () => {
    const { downloadLink } = await renderComponentAndGetLink({
      type: 'publicCa',
      label: 'key_management_service_dashboard_button_label_download_ca',
    });

    const user = userEvent.setup();
    await waitFor(() => user.click(downloadLink));

    await waitFor(() => {
      expect(api.getOkmsPublicCa).toHaveBeenCalledWith(mockOkms.id);
    });

    await waitFor(() => {
      expect(initiateTextFileDownload).toHaveBeenCalledWith({
        text: mockCertificates.publicCA,
        filename: 'okms_test-region_public_ca.pem',
      });
    });
  });

  test('should download publicRsaCa certificate when clicked', async () => {
    const { downloadLink } = await renderComponentAndGetLink({
      type: 'publicRsaCa',
      label: 'key_management_service_dashboard_button_label_download_rsa_ca',
    });

    const user = userEvent.setup();
    await waitFor(() => user.click(downloadLink));

    await waitFor(() => {
      expect(api.getOkmsPublicCa).toHaveBeenCalledWith(mockOkms.id);
    });

    await waitFor(() => {
      expect(initiateTextFileDownload).toHaveBeenCalledWith({
        text: mockCertificates.publicRsaCA,
        filename: 'okms_test-region_public_rsa_ca.pem',
      });
    });
  });

  test('should show error notification when download fails', async () => {
    // Override the successful mock with an error
    vi.spyOn(api, 'getOkmsPublicCa').mockRejectedValueOnce(
      new Error('API Error'),
    );

    const { downloadLink } = await renderComponentAndGetLink({
      type: 'publicCa',
      label: 'key_management_service_dashboard_button_label_download_ca',
    });

    const user = userEvent.setup();
    await waitFor(() => user.click(downloadLink));

    await waitFor(() => {
      // Error notification should be shown
      expect(addErrorMock).toHaveBeenCalledWith(
        'key_management_service_dashboard_error_download_ca',
      );
    });
  });
});

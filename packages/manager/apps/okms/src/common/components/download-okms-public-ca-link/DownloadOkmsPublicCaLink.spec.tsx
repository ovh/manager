import * as api from '@key-management-service/data/api/okms';
import { OKMS } from '@key-management-service/types/okms.type';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { getOdsButtonByLabel } from '@ovh-ux/manager-core-test-utils';

import { initiateTextFileDownload } from '@/common/utils/dom/download';

import { CertificateType, DownloadOkmsPublicCaLink } from './DownloadOkmsPublicCaLink';

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

vi.mock('@/common/utils/dom/download', () => ({
  initiateTextFileDownload: vi.fn(),
}));

const mockOkms = {
  id: 'test-okms-id',
  region: 'test-region',
} as OKMS;

const mockCertificates = {
  publicCA: '-----BEGIN CERTIFICATE-----\nMIIDDummyCertificate\n-----END CERTIFICATE-----',
  publicRsaCA: '-----BEGIN CERTIFICATE-----\nMIIDummyRsaCertificate\n-----END CERTIFICATE-----',
};

const renderComponentAndGetLink = async ({
  type,
  label,
}: {
  type: CertificateType;
  label: string;
}) => {
  const { container } = render(<DownloadOkmsPublicCaLink okms={mockOkms} type={type} />);

  const downloadLink = await getOdsButtonByLabel({
    container,
    label,
    isLink: true,
    timeout: 2000,
  });

  return { downloadLink };
};

describe('DownloadOkmsPublicCaLink component tests suite', () => {
  beforeEach(() => {
    vi.spyOn(api, 'getOkmsPublicCa').mockResolvedValue(mockCertificates);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const buttons: {
    type: CertificateType;
    label: string;
    expectedCa: 'publicCA' | 'publicRsaCA';
    expectedFilename: string;
    expectedCertificate: string;
  }[] = [
    {
      type: 'publicCaRest',
      label: 'key_management_service_dashboard_button_label_download_ca',
      expectedCa: 'publicCA',
      expectedFilename: 'okms_test-region_public_ca.pem',
      expectedCertificate: mockCertificates.publicCA,
    },
    {
      type: 'publicCaKmip',
      label: 'key_management_service_dashboard_button_label_download_ca',
      expectedCa: 'publicCA',
      expectedFilename: 'okms_test-region_public_ca.pem',
      expectedCertificate: mockCertificates.publicCA,
    },
    {
      type: 'publicCaRsaKmip',
      label: 'key_management_service_dashboard_button_label_download_rsa_ca',
      expectedCa: 'publicRsaCA',
      expectedFilename: 'okms_test-region_public_rsa_ca.pem',
      expectedCertificate: mockCertificates.publicRsaCA,
    },
  ];

  test.each(buttons)('should render $type download link correctly', async ({ type, label }) => {
    const { downloadLink } = await renderComponentAndGetLink({
      type,
      label,
    });
    expect(downloadLink).toBeInTheDocument();
  });

  test.each(buttons)(
    'should download $expectedCa certificate when clicked on $type button',
    async ({ type, label, expectedFilename, expectedCertificate }) => {
      const { downloadLink } = await renderComponentAndGetLink({
        type,
        label,
      });

      const user = userEvent.setup();
      await waitFor(() => user.click(downloadLink));

      await waitFor(() => {
        expect(api.getOkmsPublicCa).toHaveBeenCalledWith(mockOkms.id);
      });

      await waitFor(() => {
        expect(initiateTextFileDownload).toHaveBeenCalledWith({
          text: expectedCertificate,
          filename: expectedFilename,
        });
      });
    },
  );

  test('should download publicRsaCa certificate when clicked', async () => {
    const { downloadLink } = await renderComponentAndGetLink({
      type: 'publicCaRsaKmip',
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
    vi.spyOn(api, 'getOkmsPublicCa').mockRejectedValueOnce(new Error('API Error'));

    const { downloadLink } = await renderComponentAndGetLink({
      type: 'publicCaRest',
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

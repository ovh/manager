import { download as exportToCsvDownload } from 'export-to-csv';
import { describe, expect, vi } from 'vitest';

import { attachedDomainDigStatusMock, websitesMocks } from '@/data/__mocks__';
import commonTranslation from '@/public/translations/common/Messages_fr_FR.json';
import { render, screen } from '@/utils/test.provider';

import Websites from './Websites.page';

const hoistedMock = vi.hoisted(() => ({
  useWebHostingAttachedDomaindigStatus: vi.fn(),
  useWebHostingAttachedDomain: vi.fn(),
  createObjectURL: vi.fn().mockReturnValue('mock-url'),
  open: vi.fn(),
}));

vi.mock(
  '@/data/hooks/webHostingAttachedDomaindigStatus/useWebHostingAttachedDomaindigStatus',
  () => {
    return {
      useWebHostingAttachedDomaindigStatus: hoistedMock.useWebHostingAttachedDomaindigStatus,
    };
  },
);

vi.mock('@/data/hooks/webHostingAttachedDomain/useWebHostingAttachedDomain', () => {
  return {
    useWebHostingAttachedDomain: hoistedMock.useWebHostingAttachedDomain,
  };
});

vi.mock('export-to-csv', () => ({
  generateCsv: () => vi.fn().mockReturnValue('csv-content'),
  mkConfig: vi.fn().mockReturnValue({ filename: 'websites.csv' }),
  download: vi.fn().mockImplementation(() => vi.fn()),
}));

describe('Websites page', () => {
  beforeEach(() => {
    hoistedMock.useWebHostingAttachedDomaindigStatus.mockReturnValue({
      data: attachedDomainDigStatusMock,
      isLoading: false,
    });
    hoistedMock.useWebHostingAttachedDomain.mockReturnValue({
      data: websitesMocks,
      isLoading: false,
    });
    global.URL.createObjectURL = hoistedMock.createObjectURL;
    window.open = hoistedMock.open;
  });
  // @TODO: this test can fail randomly for no apparent reason, I think there's
  // an issue in ODS that cause `has-error` to be empty randomly so let's
  // unskip this test when it is fixed
  it.skip('should render correctly', () => {
    const { container } = render(<Websites />);
    expect(container).toBeInTheDocument();
  });
  // @TODO: this test can fail randomly for no apparent reason, I think there's
  // an issue in ODS that cause `has-error` to be empty randomly so let's
  // unskip this test when it is fixed
  it.skip('should display all headers with correct text', () => {
    render(<Websites />);
    const headers = [
      {
        id: 'header-fqdn',
        text: commonTranslation.web_hosting_status_header_fqdn,
      },
      {
        id: 'header-diagnostic',
        text: commonTranslation.web_hosting_status_header_diagnostic,
      },
      {
        id: 'header-path',
        text: commonTranslation.web_hosting_status_header_path,
      },
      {
        id: 'header-serviceName',
        text: commonTranslation.web_hosting_status_header_serviceName,
      },
      {
        id: 'header-displayName',
        text: commonTranslation.web_hosting_status_header_displayName,
      },
      {
        id: 'header-offer',
        text: commonTranslation.web_hosting_status_header_offer,
      },
      {
        id: 'header-git',
        text: commonTranslation.web_hosting_status_header_git,
      },
      {
        id: 'header-ownLog',
        text: commonTranslation.web_hosting_status_header_ownlog,
      },
      {
        id: 'header-CDN',
        text: commonTranslation.web_hosting_status_header_cdn,
      },
      {
        id: 'header-ssl',
        text: commonTranslation.web_hosting_status_header_ssl,
      },
      {
        id: 'header-firewall',
        text: commonTranslation.web_hosting_status_header_firewall,
      },
      {
        id: 'header-boostOffer',
        text: commonTranslation.web_hosting_status_header_boostOffer,
      },
      { id: 'header-actions', text: '' },
    ];
    headers.forEach(({ id, text }) => {
      const headerElement = screen.getByTestId(id);
      expect(headerElement).toBeInTheDocument();
      expect(headerElement.querySelector('span')).toHaveTextContent(text);
    });
  });
  // @TODO: this test can fail randomly for no apparent reason, I think there's
  // an issue in ODS that cause `has-error` to be empty randomly so let's
  // unskip this test when it is fixed
  it.skip('should display order and export buttons', () => {
    render(<Websites />);
    const orderButton = screen.getByTestId('websites-page-order-button');
    expect(orderButton).toBeInTheDocument();
    const exportButton = screen.getByTestId('websites-page-export-button');
    expect(exportButton).toBeInTheDocument();
  });
  // @TODO: this test can fail randomly for no apparent reason, I think there's
  // an issue in ODS that cause `has-error` to be empty randomly so let's
  // unskip this test when it is fixed
  it.skip('should open order URL in new tab when clicking order button', () => {
    render(<Websites />);
    const orderButton = screen.getByTestId('websites-page-order-button');
    orderButton.click();
    expect(hoistedMock.open).toHaveBeenCalledWith(expect.any(String), '_blank');
  });
  // @TODO: this test can fail randomly for no apparent reason, I think there's
  // an issue in ODS that cause `has-error` to be empty randomly so let's
  // unskip this test when it is fixed
  it.skip('should trigger export when clicking export button', () => {
    render(<Websites />);
    const exportButton = screen.getByTestId('websites-page-export-button');
    exportButton.click();
    const exportDisplayedButton = screen.getByTestId('websites-page-export-button-1');
    exportDisplayedButton.click();
    expect(hoistedMock.createObjectURL).toHaveBeenCalled();
    expect(exportToCsvDownload).toHaveBeenCalled();
  });
});

import React from 'react';
import { describe, expect, vi } from 'vitest';
import { download } from 'export-to-csv';
import Websites from './Websites.page';
import { render, screen } from '@/utils/test.provider';
import { attachedDomainDigStatusMock, websitesMocks } from '@/data/__mocks__';
import commonTranslation from '@/public/translations/common/Messages_fr_FR.json';

const hoistedMock = vi.hoisted(() => ({
  useWebHostingAttachedDomaindigStatus: vi.fn(),
  useWebHostingAttachedDomain: vi.fn(),
  createObjectURL: vi.fn().mockReturnValue('mock-url'),
  open: vi.fn(),
}));

vi.mock(
  '@/data/hooks/webHostingAttachedDomaindigStatus/useWebHostingAttachedDomaindigStatus',
  async (importActual) => {
    const actual = await importActual<
      typeof import('@/data/hooks/webHostingAttachedDomaindigStatus/useWebHostingAttachedDomaindigStatus')
    >();
    return {
      ...actual,
      useWebHostingAttachedDomaindigStatus:
        hoistedMock.useWebHostingAttachedDomaindigStatus,
    };
  },
);
vi.mock(
  '@/data/hooks/webHostingAttachedDomain/useWebHostingAttachedDomain',
  async (importActual) => {
    const actual = await importActual<
      typeof import('@/data/hooks/webHostingAttachedDomain/useWebHostingAttachedDomain')
    >();
    return {
      ...actual,
      useWebHostingAttachedDomain: hoistedMock.useWebHostingAttachedDomain,
    };
  },
);

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

  it('should render correctly', async () => {
    const { container } = render(<Websites />);
    expect(container).toBeInTheDocument();
  });

  it('should display all headers with correct text', async () => {
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
  it('should display order and export buttons', async () => {
    render(<Websites />);
    const orderButton = screen.getByTestId('websites-page-order-button');
    expect(orderButton).toBeInTheDocument();
    const exportButton = screen.getByTestId('websites-page-export-button');
    expect(exportButton).toBeInTheDocument();
  });

  it('should open order URL in new tab when clicking order button', async () => {
    render(<Websites />);
    const orderButton = screen.getByTestId('websites-page-order-button');

    await orderButton.click();

    expect(hoistedMock.open).toHaveBeenCalledWith(expect.any(String), '_blank');
  });

  it('should trigger export when clicking export button', async () => {
    render(<Websites />);

    const exportButton = screen.getByTestId('websites-page-export-button');
    await exportButton.click();

    const exportDisplayedButton = screen.getByTestId(
      'websites-page-export-button-1',
    );

    await exportDisplayedButton.click();

    expect(hoistedMock.createObjectURL).toHaveBeenCalled();
    expect(download).toHaveBeenCalled();
  });
});

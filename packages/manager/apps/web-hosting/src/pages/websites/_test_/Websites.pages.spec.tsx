import React from 'react';
import { describe, expect, vi } from 'vitest';
import { download } from 'export-to-csv';
import Websites from '../Websites.page';
import { render, screen } from '@/test.provider';
import { attachedDomainDigStatusMock, websitesMocks } from '@/api/_mock_';
import commonTranslation from '@/public/translations/common/Messages_fr_FR.json';

const hoistedMock = vi.hoisted(() => ({
  useWebHostingAttachedDomaindigStatus: vi.fn(),
  useWebHostingAttachedDomain: vi.fn(),
  createObjectURL: vi.fn().mockReturnValue('mock-url'),
  open: vi.fn(),
}));

vi.mock('@/hooks', async (importActual) => {
  const actual = await importActual<typeof import('@/hooks')>();
  return {
    ...actual,
    useWebHostingAttachedDomaindigStatus:
      hoistedMock.useWebHostingAttachedDomaindigStatus,
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

    expect(hoistedMock.createObjectURL).toHaveBeenCalled();
    expect(download).toHaveBeenCalled();
  });
});

import React from 'react';
import { describe, expect, vi } from 'vitest';
import Websites from '../Websites.page';
import { render, screen } from '@/test.provider';
import { attachedDomainDigStatusMock, websitesMocks } from '@/api/_mock_';
import commonTranslation from '@/public/translations/common/Messages_fr_FR.json';

const hoistedMock = vi.hoisted(() => ({
  useWebHostingAttachedDomaindigStatus: vi.fn(),
  useWebHostingAttachedDomain: vi.fn(),
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
});

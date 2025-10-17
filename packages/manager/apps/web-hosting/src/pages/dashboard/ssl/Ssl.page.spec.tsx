import React from 'react';

import { download } from 'export-to-csv';
import { describe, expect, vi } from 'vitest';

import commonTranslation from '@/public/translations/ssl/Messages_fr_FR.json';
import { render, screen } from '@/utils/test.provider';

import Ssl from './Ssl.page';

const hoistedMock = vi.hoisted(() => ({
  createObjectURL: vi.fn().mockReturnValue('mock-url'),
  open: vi.fn(),
}));

describe('Ssl page', () => {
  beforeEach(() => {
    global.URL.createObjectURL = hoistedMock.createObjectURL;
    window.open = hoistedMock.open;
  });

  it('should render correctly', () => {
    const { container } = render(<Ssl />);
    expect(container).toBeInTheDocument();
  });

  it('should display all headers with correct text', () => {
    render(<Ssl />);

    const headers = [
      {
        id: 'header-mainDomain',
        text: commonTranslation.cell_main_domain,
      },
      {
        id: 'header-additionalDomain',
        text: commonTranslation.additional_domains_singular_total,
      },
      {
        id: 'header-type',
        text: commonTranslation.cell_certificate_type,
      },
      {
        id: 'header-state',
        text: commonTranslation.cell_state,
      },
      {
        id: 'header-creationDate',
        text: commonTranslation.cell_creation_date,
      },
      {
        id: 'header-expirationDate',
        text: commonTranslation.cell_expiration_date,
      },
      { id: 'header-actions', text: '' },
    ];

    headers.forEach(({ id }) => {
      const headerElement = screen.getByTestId(id);
      expect(headerElement).toBeInTheDocument();
    });
  });
  it('should display export button', () => {
    render(<Ssl />);
    const exportButton = screen.getByTestId('ssl-page-export-button');
    expect(exportButton).toBeInTheDocument();
  });

  it('should trigger export when clicking export button', () => {
    render(<Ssl />);

    const exportButton = screen.getByTestId('ssl-page-export-button');
    exportButton.click();

    expect(hoistedMock.createObjectURL).toHaveBeenCalled();
    expect(download).toHaveBeenCalled();
  });
});

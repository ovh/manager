import React from 'react';
import { describe, expect, vi } from 'vitest';
import { download } from 'export-to-csv';
import Ssl from './Ssl.page';
import { render, screen } from '@/utils/test.provider';
import commonTranslation from '@/public/translations/ssl/Messages_fr_FR.json';

const hoistedMock = vi.hoisted(() => ({
  createObjectURL: vi.fn().mockReturnValue('mock-url'),
  open: vi.fn(),
}));

vi.mock('react-i18next', async (importOriginal) => ({
  ...((await importOriginal()) as Record<string, unknown>),
  Trans: ({ i18nKey }: { i18nKey: string }) => i18nKey,
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      changeLanguage: vi.fn(),
    },
  }),
}));

vi.mock('export-to-csv', () => ({
  generateCsv: () => vi.fn().mockReturnValue('csv-content'),
  mkConfig: vi.fn().mockReturnValue({ filename: 'websites.csv' }),
  download: vi.fn().mockImplementation(() => vi.fn()),
}));

describe('Ssl page', () => {
  beforeEach(() => {
    global.URL.createObjectURL = hoistedMock.createObjectURL;
    window.open = hoistedMock.open;
  });

  it('should render correctly', async () => {
    const { container } = render(<Ssl />);
    expect(container).toBeInTheDocument();
  });

  it('should display all headers with correct text', async () => {
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
  it('should display export button', async () => {
    render(<Ssl />);
    const exportButton = screen.getByTestId('ssl-page-export-button');
    expect(exportButton).toBeInTheDocument();
  });

  it('should trigger export when clicking export button', async () => {
    render(<Ssl />);

    const exportButton = screen.getByTestId('ssl-page-export-button');
    await exportButton.click();

    expect(hoistedMock.createObjectURL).toHaveBeenCalled();
    expect(download).toHaveBeenCalled();
  });
});

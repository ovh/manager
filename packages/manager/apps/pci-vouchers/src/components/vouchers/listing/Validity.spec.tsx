import { ReactNode } from 'react';
import { describe, expect, vi } from 'vitest';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import * as dateFnsLocales from 'date-fns/locale';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

import Validity from '@/components/vouchers/listing/Validity';

const mocks = vi.hoisted(() => ({
  useTranslation: vi.fn(),
}));

vi.mock('react-i18next', () => ({
  useTranslation: mocks.useTranslation,
  initReactI18next: {
    type: '3rdParty',
    init: () => {},
  },
}));

vi.mock('date-fns', () => {
  const formatMock = vi.fn(() => 'formattedDate');
  return {
    format: formatMock,
  };
});

vi.mock('@ovh-ux/manager-react-components', async () => ({
  DataGridTextCell: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

describe('Datagrid Validity Cell', () => {
  it('should display date based on language', async () => {
    mocks.useTranslation.mockImplementationOnce(() => ({
      t: (str: string) => str,
      i18n: {
        language: 'fr_FR',
      },
    }));

    // const trans = useTranslation('common')
    expect(useTranslation).not.toHaveBeenCalled();
    expect(format).not.toHaveBeenCalled();

    render(<Validity date="2007-01-09T09:41:00+00:00"></Validity>);

    const formattedDate = screen.getByText('formattedDate');

    await waitFor(() => {
      expect(useTranslation).toHaveBeenCalled();
      expect(format).toHaveBeenCalledWith(
        new Date('2007-01-09T09:41:00.000Z'),
        'PPpp',
        { locale: dateFnsLocales.fr },
      );
      expect(formattedDate).toBeInTheDocument();
    });
  });

  it('should display date based on language DE', async () => {
    mocks.useTranslation.mockImplementationOnce(() => ({
      t: (str: string) => str,
      i18n: {
        language: 'de_DE',
      },
    }));

    render(<Validity date="2007-01-09T09:41:00+00:00"></Validity>);

    const formattedDate2 = screen.getByText('formattedDate');

    await waitFor(() => {
      expect(useTranslation).toHaveBeenCalled();
      expect(format).toHaveBeenCalledWith(
        new Date('2007-01-09T09:41:00.000Z'),
        'PPpp',
        { locale: dateFnsLocales.de },
      );
      expect(formattedDate2).toBeInTheDocument();
    });
  });
});

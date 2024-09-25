import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { getDateFnsLocale } from '@ovh-ux/manager-core-utils';
import { format } from 'date-fns';
import * as dateFnsLocales from 'date-fns/locale';
import CreationDate from './CreationDate.component';

vi.mock('@ovh-ux/manager-core-utils', () => ({
  getDateFnsLocale: vi.fn(),
}));

describe('CreationDate', () => {
  it('renders formatted date for valid date string', () => {
    vi.mocked(getDateFnsLocale).mockReturnValue('enUS');
    const { getByText } = render(<CreationDate date="2023-10-01T12:00:00Z" />);
    const formattedDate = format(new Date('2023-10-01T12:00:00Z'), 'PPpp', {
      locale: dateFnsLocales.enUS,
    });
    expect(getByText(formattedDate)).toBeInTheDocument();
  });

  it('renders empty string for null date', () => {
    const { container } = render(<CreationDate date={null} />);
    expect(container.textContent).toBe('');
  });

  it('renders formatted date with fallback locale for unsupported locale', () => {
    vi.mocked(getDateFnsLocale).mockReturnValue('unsupportedLocale');
    const { getByText } = render(<CreationDate date="2023-10-01T12:00:00Z" />);
    const formattedDate = format(new Date('2023-10-01T12:00:00Z'), 'PPpp', {
      locale: dateFnsLocales.fr,
    });
    expect(getByText(formattedDate)).toBeInTheDocument();
  });

  it('renders formatted date with default locale for missing locale', () => {
    vi.mocked(getDateFnsLocale).mockReturnValue('');
    const { getByText } = render(<CreationDate date="2023-10-01T12:00:00Z" />);
    const formattedDate = format(new Date('2023-10-01T12:00:00Z'), 'PPpp', {
      locale: dateFnsLocales.fr,
    });
    expect(getByText(formattedDate)).toBeInTheDocument();
  });
});

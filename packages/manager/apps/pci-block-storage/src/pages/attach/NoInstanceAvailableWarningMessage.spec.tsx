import { render } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import NoInstanceWarningMessage from './NoInstanceAvailableWarningMessage';

vi.mock('react-i18next', () => ({
  useTranslation: vi.fn().mockReturnValue({
    t: vi.fn().mockReturnValue('Translated text'),
  }),
}));

describe('NoInstanceWarningMessage', () => {
  it('renders translated text', () => {
    const { getByText } = render(<NoInstanceWarningMessage />);
    expect(getByText('Translated text')).toBeInTheDocument();
  });
});

import { describe, expect, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

import ArrowButton from '@/components/datagrid/pagination/ArrowButton';

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: (str: string) => str,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    };
  },
  initReactI18next: {
    type: '3rdParty',
    init: () => {},
  },
}));

describe('Datagrid Pagination Arrow Button', () => {
  it('should display previous arrow button', async () => {
    render(<ArrowButton direction="left" onClick={() => {}}></ArrowButton>);

    const tooltipContent = screen.getByText('common_pagination_previous_page');
    const icon = screen.getByTestId('icon');

    await waitFor(() => {
      expect(tooltipContent).toBeInTheDocument();

      expect(icon).toHaveAttribute('name', 'chevron-left');
    });
  });

  it('should display next arrow button', async () => {
    render(<ArrowButton direction="right" onClick={() => {}}></ArrowButton>);
    const tooltipContent = screen.getByText('common_pagination_next_page');
    const icon = screen.getByTestId('icon');

    await waitFor(() => {
      expect(tooltipContent).toBeInTheDocument();

      expect(icon).toHaveAttribute('name', 'chevron-right');
    });
  });

  it('should trigger onClick when clicked', async () => {
    const handleClick = vi.fn();

    render(<ArrowButton direction="left" onClick={handleClick}></ArrowButton>);

    const button = screen.getByTestId('button');
    fireEvent.click(button as Element);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should not trigger onClick when clicked on disabled Arrow Button', async () => {
    const handleClick = vi.fn();

    render(
      <ArrowButton
        direction="left"
        disabled
        onClick={handleClick}
      ></ArrowButton>,
    );

    const button = screen.getByTestId('button');
    fireEvent.click(button);
    expect(button).toHaveAttribute('disabled');
    expect(handleClick).toHaveBeenCalledTimes(0);
  });
});

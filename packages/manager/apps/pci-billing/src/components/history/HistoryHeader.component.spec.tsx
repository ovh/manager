import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import HistoryHeader from './HistoryHeader.component';
import * as _useComputeDateHook from './useComputeDate.hook';
import { wrapper } from '@/wrapperRenders';

describe('HistoryHeader', () => {
  const mockUseComputeDate = vi.spyOn(_useComputeDateHook, 'useComputeDate');

  beforeEach(() => {
    mockUseComputeDate.mockReturnValue({
      translationValues: {
        month: 'novembre',
        year: 2023,
        lastMonth: 'octobre',
        previousYear: 2023,
      },
      billingDate: new Date('2023-10-31T23:00:00.000Z'),
      nextMonthDate: new Date('2023-11-30T23:00:00.000Z'),
      prevMonthDate: new Date('2023-09-30T22:00:00.000Z'),
    });
  });

  it('matches snapshot', () => {
    const { asFragment } = render(<HistoryHeader />, { wrapper });

    expect(asFragment()).toMatchSnapshot();
  });

  // Todo: enable this unit test when will move to ods 19
  describe.skip('Previous button', () => {
    it('should disable previous button when previous month is before project creation date', () => {
      const projectCreationDate = '2023-10-15T14:41:56.670833+02:00';
      const { container } = render(
        <HistoryHeader projectCreationDate={projectCreationDate} />,
        { wrapper },
      );

      const previousButton = container.querySelectorAll('osds-button')[0];
      expect(previousButton.hasAttribute('disabled')).toBe(true);
      expect(previousButton.getAttribute('disabled')).toBe('true');
    });

    it('should not disable previous button when previous month is in the same month as project creation', () => {
      const projectCreationDate = '2023-09-15T14:41:56.670833+02:00';
      const { container } = render(
        <HistoryHeader projectCreationDate={projectCreationDate} />,
        { wrapper },
      );

      const previousButton = container.querySelectorAll('osds-button')[0];
      expect(previousButton.hasAttribute('disabled')).toBe(false);
    });
  });
});

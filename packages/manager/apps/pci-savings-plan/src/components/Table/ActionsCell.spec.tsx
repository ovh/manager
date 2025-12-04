import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { usePciUrl } from '@ovh-ux/manager-pci-common';
import { useHref, useSearchParams } from 'react-router-dom';
import ActionsCell from './ActionsCell';
import { SavingsPlanPlanedChangeStatus, SavingsPlanStatus } from '@/types';

const pciUrl = 'pciUrl';
const useSearchParamsMocked = vi
  .fn()
  .mockReturnValue([new URLSearchParams(''), vi.fn]);

vi.mock('@ovh-ux/manager-pci-common');
vi.mock('react-router-dom');

vi.mocked(usePciUrl).mockReturnValue(pciUrl);
vi.mocked(useHref).mockImplementation((relativePath) => relativePath as string);
vi.mocked(useSearchParams).mockImplementation(useSearchParamsMocked);

const mockedActionsCellProps = {
  id: 'fakeId',
  flavor: 'fake-flavor',
  status: SavingsPlanStatus.ACTIVE,
  periodEndAction: SavingsPlanPlanedChangeStatus.TERMINATE,
  onClickEditName: vi.fn(),
  onClickRenew: vi.fn(),
};

describe('Considering ActionsCell', () => {
  it.each([
    SavingsPlanStatus.ACTIVE,
    SavingsPlanStatus.PENDING,
    SavingsPlanStatus.TERMINATED,
  ])('should always display edit name action when status = %s', (status) => {
    render(<ActionsCell {...mockedActionsCellProps} status={status} />);

    const button = screen.getByRole('button', { name: 'edit' });
    expect(button).toHaveAttribute('label', 'edit');
    expect(button).toBeVisible();
  });

  describe.each([SavingsPlanStatus.ACTIVE, SavingsPlanStatus.PENDING])(
    'Given savings plan is %s',
    (status) => {
      it.each([
        {
          periodEndAction: SavingsPlanPlanedChangeStatus.TERMINATE,
          label: 'enableAutoRenew',
        },
        {
          periodEndAction: SavingsPlanPlanedChangeStatus.REACTIVATE,
          label: 'disableAutoRenew',
        },
      ])(
        'should display $label action when periodEndAction $periodEndAction',
        ({ periodEndAction, label }) => {
          render(
            <ActionsCell
              {...mockedActionsCellProps}
              status={status}
              periodEndAction={periodEndAction}
            />,
          );

          const button = screen.getByRole('button', { name: label });
          expect(button).toHaveAttribute('label', label);
          expect(button).toBeVisible();
        },
      );
    },
  );

  describe('Given savings plan is TERMINATED', () => {
    it.each([
      {
        periodEndAction: SavingsPlanPlanedChangeStatus.TERMINATE,
        label: 'enableAutoRenew',
      },
      {
        periodEndAction: SavingsPlanPlanedChangeStatus.REACTIVATE,
        label: 'disableAutoRenew',
      },
    ])(
      'should not display $label action when periodEndAction $periodEndAction',
      ({ periodEndAction, label }) => {
        render(
          <ActionsCell
            {...mockedActionsCellProps}
            status={SavingsPlanStatus.TERMINATED}
            periodEndAction={periodEndAction}
          />,
        );
        const button = screen.queryByRole('button', { name: label });
        expect(button).not.toBeInTheDocument();
      },
    );
  });

  describe.each([
    SavingsPlanStatus.ACTIVE,
    SavingsPlanStatus.PENDING,
    SavingsPlanStatus.TERMINATED,
  ])('Given savings plan is %s', (status) => {
    it.each([
      {
        flavor: 'fake-b3',
        label: 'order_instance',
        href: `${pciUrl}/instances/new`,
      },
      {
        flavor: 'fake-rancher',
        label: 'order_rancher',
        href: `${pciUrl}/rancher/new`,
      },
    ])('should display $label action', ({ flavor, label, href }) => {
      render(
        <ActionsCell
          {...mockedActionsCellProps}
          flavor={flavor}
          status={status}
        />,
      );

      const button = screen.getByRole('link', { name: label });
      expect(button).toHaveAttribute('label', label);
      expect(button).toHaveAttribute('href', href);
      expect(button).toBeVisible();
    });
  });

  it.each([SavingsPlanStatus.ACTIVE, SavingsPlanStatus.TERMINATED])(
    'should not display cancelSavingsPlan action when status = %s',
    (status) => {
      render(<ActionsCell {...mockedActionsCellProps} status={status} />);

      const button = screen.queryByRole('link', { name: 'actions:cancel' });
      expect(button).not.toBeInTheDocument();
    },
  );

  it('should display cancelSavingsPlan action when savings plan is on PENDING', () => {
    render(
      <ActionsCell
        {...mockedActionsCellProps}
        status={SavingsPlanStatus.PENDING}
      />,
    );

    const button = screen.queryByRole('link', { name: 'actions:cancel' });
    expect(button).toHaveAttribute('label', 'actions:cancel');
    expect(button).toHaveAttribute(
      'href',
      `./${mockedActionsCellProps.id}/cancel`,
    );
    expect(button).toBeVisible();
  });

  it('should keep the search query params on cancelSavingsPlan action href when current page is sorted', () => {
    const querySearch = 'sort=status';
    useSearchParamsMocked.mockReturnValue([
      new URLSearchParams(querySearch),
      vi.fn,
    ]);
    render(
      <ActionsCell
        {...mockedActionsCellProps}
        status={SavingsPlanStatus.PENDING}
      />,
    );

    const button = screen.queryByRole('link', { name: 'actions:cancel' });
    expect(button).toHaveAttribute(
      'href',
      `./${mockedActionsCellProps.id}/cancel?${querySearch}`,
    );
  });
});

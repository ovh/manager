import '@/alldoms/setupTests';
import React from 'react';
import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import { wrapper } from '@/alldoms/utils/test.provider';
import Modal from './Modal';
import { serviceInfoDetail } from '@/alldoms/__mocks__/serviceInfoDetail';

describe('Modal', () => {
  const { domains } = serviceInfoDetail.domainAttached.currentState;

  it('display the modal', async () => {
    render(
      <Modal
        modalOpen={true}
        closeModal={null}
        serviceDetail={serviceInfoDetail}
      />,
      { wrapper },
    );
    expect(screen.getByTestId('modal')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('allDom_modal_title')).toBeInTheDocument();
      expect(screen.getByText('allDom_modal_subtitle')).toBeInTheDocument();
      expect(screen.getByText('allDom_modal_choice')).toBeInTheDocument();
      expect(
        screen.getByText('allDom_modal_step_one_message'),
      ).toBeInTheDocument();
    });
  });

  domains.forEach((domain) => {
    it(`should render ${domain.name} checkbox`, async () => {
      render(
        <Modal
          modalOpen={true}
          closeModal={null}
          serviceDetail={serviceInfoDetail}
        />,
        { wrapper },
      );
      await waitFor(async () => {
        const checkbox = await screen.findByTestId(`checkbox-${domain.name}`);
        const input = checkbox.querySelector('input');
        expect(input).toBeInTheDocument();
        expect(input?.checked).toBe(false);
        fireEvent.click(input!);
        expect(input?.checked).toBe(true);
      });
    });
  });

  it('should select all checkboxes when the "select all" checkbox is clicked', async () => {
    render(
      <Modal
        modalOpen={true}
        closeModal={null}
        serviceDetail={serviceInfoDetail}
      />,
      { wrapper },
    );

    const selectAllCheckbox = await screen.findByTestId('checkbox-alldomains');

    expect(selectAllCheckbox).toBeInTheDocument();

    fireEvent.click(selectAllCheckbox);

    await waitFor(async () => {
      await Promise.all(
        domains.map(async (domain) => {
          const checkbox = await screen.findByTestId(`checkbox-${domain.name}`);
          const input = checkbox.querySelector('input');
          expect(input?.checked).toBe(true);
        }),
      );
    });
  });
});

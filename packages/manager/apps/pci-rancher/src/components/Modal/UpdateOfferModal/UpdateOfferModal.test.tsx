import React from 'react';
import userEvent from '@testing-library/user-event';
import { describe, it, vi } from 'vitest';
import { screen, waitFor, act } from '@testing-library/react';
import dashboardTranslation from '../../../../public/translations/dashboard/Messages_fr_FR.json';
import { render } from '../../../utils/test/test.provider';
import UpdateOfferModal, {
  UpdateOfferModalProps,
} from './UpdateOfferModal.component';

const mockedUsedNavigate = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockedUsedNavigate,
}));

vi.mock('@ovh-ux/manager-react-shell-client', () => ({
  useTracking: vi.fn(() => ({
    trackPage: vi.fn(),
    trackClick: vi.fn(),
  })),
}));

const mockPlanInfo: PlanInfo = {
  name: 'STANDARD',
  price: '1234 €',
};

const defaultProps: UpdateOfferModalProps = {
  onClose: vi.fn(),
  onClickUpdate: vi.fn(),
  isUpdatePending: false,
  planInfo: mockPlanInfo,
};

export interface PlanInfo {
  name: string;
  price: string;
}

afterEach(() => {
  vi.clearAllMocks();
});

const setupSpecTest = async (props: UpdateOfferModalProps = defaultProps) =>
  render(<UpdateOfferModal {...props} />);

describe('UpdateOfferModal', () => {
  it("Given that I don't want to update my rancher offer, I should be able to click on the Cancel CTA and close the modal.", async () => {
    setupSpecTest();
    const button = screen.getByText(dashboardTranslation.cancel);

    act(async () => {
      userEvent.click(button);
    });

    waitFor(() => {
      expect(defaultProps.onClose).toHaveBeenCalled();
    });
  });

  it('Given that I want to update my rancher, I should be able to click on the Update CTA and close the modal.', async () => {
    setupSpecTest();
    waitFor(() => {
      const button = screen.getByText(
        dashboardTranslation.updateOfferModalValidateButton,
      );

      act(async () => {
        await userEvent.click(button);
      });

      waitFor(() => {
        expect(defaultProps.onClose).toHaveBeenCalled();
      });
    });
  });
});

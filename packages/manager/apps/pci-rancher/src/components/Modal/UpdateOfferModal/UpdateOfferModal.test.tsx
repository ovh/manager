import React from 'react';
import userEvent from '@testing-library/user-event';
import dashboardTranslation from '@translation/dashboard/Messages_fr_FR.json';
import { render, waitFor } from '@/utils/test/test.provider';
import UpdateOfferModal, {
  UpdateOfferModalProps,
} from './UpdateOfferModal.component';

const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

jest.mock('@ovh-ux/manager-react-shell-client', () => ({
  PageLocation: {
    popup: 'popup',
  },
  ButtonType: {
    button: 'link',
  },
}));

const mockPlanInfo: PlanInfo = {
  name: 'STANDARD',
  price: '1234 €',
};

const defaultProps: UpdateOfferModalProps = {
  onClose: jest.fn(),
  onClickUpdate: jest.fn(),
  isUpdatePending: false,
  planInfo: mockPlanInfo,
};

export interface PlanInfo {
  name: string;
  price: string;
}

afterEach(() => {
  jest.clearAllMocks();
});

const setupSpecTest = async (props: UpdateOfferModalProps = defaultProps) =>
  waitFor(() => render(<UpdateOfferModal {...props} />));

describe('UpdateOfferModal', () => {
  it("Given that I don't want to update my rancher offer, I should be able to click on the Cancel CTA and close the modal.", async () => {
    const screen = await setupSpecTest();
    const button = screen.getByText(dashboardTranslation.cancel);

    await userEvent.click(button);

    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('Given that I want to update my rancher, I should be able to click on the Update CTA and close the modal.', async () => {
    const screen = await setupSpecTest();
    const button = screen.getByText(
      dashboardTranslation.updateOfferModalValidateButton,
    );

    await userEvent.click(button);

    expect(defaultProps.onClose).toHaveBeenCalled();
  });
});

import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, waitFor } from '../../utils/test/test.provider';
import GenerateAccessModal, {
  GenerateAccessModalProps,
} from './GenerateAccesModal';
import dashboardTranslation from '../../public/translations/pci-rancher/dashboard/Messages_fr_FR.json';
import { rancherMocked } from '../../_mock_/rancher';

const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

const defaultProps: GenerateAccessModalProps = {
  toggleModal: jest.fn(),
  rancher: rancherMocked,
  onGenerateAccess: jest.fn(),
  accessDetail: null,
};

afterEach(() => {
  jest.clearAllMocks();
});

const setupSpecTest = async (props: GenerateAccessModalProps = defaultProps) =>
  waitFor(() => render(<GenerateAccessModal {...props} />));

describe('GenerateAccesModal', () => {
  it("Given that I don't want to see my access detail, I should be able to click on the Cancel CTA and close the modal.", async () => {
    const screen = await setupSpecTest();

    const button = screen.getByText(dashboardTranslation.cancel);

    await userEvent.click(button);

    expect(defaultProps.toggleModal).toHaveBeenCalled();
  });

  it('Given that I clicked on Confirm, I should be able to copy/paste the id and pwd newly generated by clicking on the dedicated icon.', async () => {
    const screen = await setupSpecTest({
      ...defaultProps,
      accessDetail: {
        username: 'username',
        password: 'pwd',
      },
    });

    const copyButton = screen.getByLabelText('clipboard');

    const password = screen.getByLabelText('password');

    await userEvent.click(copyButton);

    expect(copyButton).toHaveAttribute('aria-label', 'clipboard');
    expect(copyButton).toHaveAttribute('value', 'username');
    expect(password).toHaveAttribute('value', 'pwd');

    expect(password).not.toBeNull();
  });

  it('Given that I saw my access detail, I should be able to click on the Close CTA to close the modal.', async () => {
    const screen = await setupSpecTest({
      ...defaultProps,
      accessDetail: {
        username: 'username',
        password: 'pwd',
      },
    });

    const button = screen.getByText(dashboardTranslation.close);

    await userEvent.click(button);

    expect(defaultProps.toggleModal).toHaveBeenCalled();
  });

  it('Given that I have all the details I wanted, I should be able to go directly to Rancher platform on a new browser tab by clicking on the primary CTA and modal need to be kept open.', async () => {
    const screen = await setupSpecTest({
      ...defaultProps,
      accessDetail: {
        username: 'username',
        password: 'pwd',
      },
    });

    const button = screen.getByText(dashboardTranslation.rancher_button_acces);

    await userEvent.click(button);

    expect(defaultProps.onGenerateAccess).not.toHaveBeenCalled();
    expect(defaultProps.toggleModal).not.toHaveBeenCalled();
    expect(mockedUsedNavigate).toHaveBeenCalledWith(
      rancherMocked.currentState.url,
    );
  });
});

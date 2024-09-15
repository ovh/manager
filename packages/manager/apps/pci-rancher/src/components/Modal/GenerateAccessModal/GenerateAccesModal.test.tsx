import React from 'react';
import userEvent from '@testing-library/user-event';
import { describe, it, vi } from 'vitest';
import { waitFor, act, screen } from '@testing-library/react';
import dashboardTranslation from '../../../../public/translations/dashboard/Messages_fr_FR.json';
import { render } from '../../../utils/test/test.provider';
import GenerateAccessModal, {
  GenerateAccessModalProps,
} from './GenerateAccesModal.component';
import { rancherMocked } from '../../../_mock_/rancher';

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

const defaultProps: GenerateAccessModalProps = {
  onClose: vi.fn(),
  rancher: rancherMocked,
  onGenerateAccess: vi.fn(),
  accessDetail: null,
};

afterEach(() => {
  vi.clearAllMocks();
});

const setupSpecTest = (props: GenerateAccessModalProps = defaultProps) =>
  waitFor(() => render(<GenerateAccessModal {...props} />));

describe('GenerateAccesModal', () => {
  it("Given that I don't want to see my access detail, I should be able to click on the Cancel CTA and close the modal.", async () => {
    setupSpecTest();

    const button = screen.getByText(dashboardTranslation.cancel);

    act(async () => {
      userEvent.click(button);
    });

    waitFor(() => {
      expect(defaultProps.onClose).toHaveBeenCalled();
    });
  });

  it('Given that I clicked on Confirm, I should be able to copy/paste the id and pwd newly generated by clicking on the dedicated icon.', async () => {
    setupSpecTest({
      ...defaultProps,
      accessDetail: {
        username: 'username',
        password: 'randomtest',
      },
    });

    waitFor(() => {
      const copyButton = screen.getByLabelText('clipboard');
      const password = screen.getByLabelText('password');

      act(async () => {
        userEvent.click(copyButton);
      });

      waitFor(() => {
        expect(copyButton).toHaveAttribute('aria-label', 'clipboard');
        expect(copyButton).toHaveAttribute('value', 'username');
        expect(password).toHaveAttribute('value', 'randomtest');
        expect(password).not.toBeNull();
      });
    });
  });

  it('Given that I saw my access detail, I should be able to click on the Close CTA to close the modal.', async () => {
    setupSpecTest({
      ...defaultProps,
      accessDetail: {
        username: 'username',
        password: 'randomtest',
      },
    });

    waitFor(() => {
      const button = screen.getByText(dashboardTranslation.close);

      act(async () => {
        userEvent.click(button);
      });

      waitFor(() => {
        expect(defaultProps.onClose).toHaveBeenCalled();
      });
    });
  });

  it('Given that I have all the details I wanted, I should be able to go directly to Rancher platform on a new browser tab by clicking on the primary CTA and modal need to be kept open.', async () => {
    setupSpecTest({
      ...defaultProps,
      accessDetail: {
        username: 'username',
        password: 'randomtest',
      },
    });

    waitFor(() => {
      const button = screen.getByText(
        dashboardTranslation.rancher_button_acces,
      );

      act(async () => {
        userEvent.click(button);
      });

      waitFor(() => {
        expect(defaultProps.onGenerateAccess).not.toHaveBeenCalled();
        expect(defaultProps.onClose).not.toHaveBeenCalled();
        expect(button).toHaveAttribute('href', rancherMocked.currentState.url);
      });
    });
  });
});

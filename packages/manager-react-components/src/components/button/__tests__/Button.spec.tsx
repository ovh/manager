import { vitest } from 'vitest';
import { fireEvent, screen } from '@testing-library/react';
import { Button, ButtonProps } from '../index';
import { render } from '../../../utils/test.provider';
import fr_FR from '../translations/Messages_fr_FR.json';
import { useAuthorizationIam } from '../../../hooks/iam';
import { IamAuthorizationResponse } from '../../../hooks/iam/iam.interface';

vitest.mock('../../../hooks/iam', () => ({
  useAuthorizationIam: vitest.fn().mockReturnValue({
    isAuthorized: true,
    isLoading: false,
    isFetched: true,
  }),
}));

const renderComponent = (props: ButtonProps) => {
  return render(<Button {...props} />);
};

const mockedHook =
  useAuthorizationIam as unknown as jest.Mock<IamAuthorizationResponse>;

describe('Button tests', () => {
  afterEach(() => {
    vitest.resetAllMocks();
  });

  describe('should display manager button', () => {
    it('with true value for useAuthorizationIam', () => {
      mockedHook.mockReturnValue({
        isAuthorized: true,
        isLoading: true,
        isFetched: true,
      });
      renderComponent({
        urn: 'urn:v9:eu:resource:manager-react-components:vrz-a878-dsflkds-fdsfsd',
        iamActions: [
          'manager-react-components:apiovh:manager-react-components/attach-action',
        ],
        children: 'foo-manager-button',
      });
      expect(screen.getByTestId('manager-button')).not.toBeNull();
    });

    it('with false value for useAuthorizationIam', () => {
      mockedHook.mockReturnValue({
        isAuthorized: false,
        isLoading: true,
        isFetched: true,
      });
      renderComponent({
        urn: 'urn:v9:eu:resource:manager-react-components:vrz-a878-dsflkds-fdsfsd',
        iamActions: [
          'manager-react-components:apiovh:manager-react-components/attach',
        ],
        children: 'fo manager button',
      });
      expect(screen.getByTestId('manager-button-tooltip')).not.toBeNull();
      expect(screen.getByTestId('manager-button-tooltip')).toHaveAttribute(
        'disabled',
      );
    });
  });

  describe('should display tooltip', () => {
    it('with false value for useAuthorizationIam', () => {
      mockedHook.mockReturnValue({
        isAuthorized: false,
        isLoading: false,
        isFetched: true,
      });
      renderComponent({
        urn: 'urn:v9:eu:resource:manager-react-components:vrz-a878-dsflkds-fdsfsd',
        iamActions: [
          'manager-react-components:apiovh:manager-react-components/attach-action',
        ],
        children: 'foo-manager-button',
      });
      expect(screen.getByTestId('manager-button-tooltip')).not.toBeNull();
      expect(screen.getByTestId('manager-button-tooltip')).toHaveAttribute(
        'disabled',
      );
      const button = screen.getByTestId('manager-button-tooltip');
      fireEvent.mouseOver(button);
      expect(
        screen.getAllByText(fr_FR.common_iam_actions_message),
      ).not.toBeNull();
    });
  });
});

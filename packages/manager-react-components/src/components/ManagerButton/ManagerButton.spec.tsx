import { fireEvent, screen } from '@testing-library/react';
import { ManagerButton, ManagerButtonProps } from './ManagerButton';
import { render } from '../../utils/test.provider';
import fr_FR from './translations/Messages_fr_FR.json';
import { useAuthorizationIam } from '../../hooks/iam';
import { IamAuthorizationResponse } from '../../hooks/iam/iam.interface';

jest.mock('../../hooks/iam');

const renderComponent = (props: ManagerButtonProps) => {
  return render(<ManagerButton {...props} />);
};

const mockedHook =
  useAuthorizationIam as unknown as jest.Mock<IamAuthorizationResponse>;

describe('ManagerButton tests', () => {
  afterEach(() => {
    jest.resetAllMocks();
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
        children: <div>foo-manager-button</div>,
      });
      expect(screen.getAllByText('foo-manager-button')).not.toBeNull();
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
        children: <div>foo-manager-button</div>,
      });
      expect(screen.getAllByText('foo-manager-button')).not.toBeNull();
      expect(
        screen.getByText('foo-manager-button').parentElement,
      ).toBeDisabled();
    });
  });

  describe('should display tooltip', () => {
    it('with false value for useAuthorizationIam', () => {
      mockedHook.mockReturnValue({
        isAuthorized: false,
        isLoading: true,
        isFetched: true,
      });
      renderComponent({
        urn: 'urn:v9:eu:resource:manager-react-components:vrz-a878-dsflkds-fdsfsd',
        iamActions: [
          'manager-react-components:apiovh:manager-react-components/attach-action',
        ],
        children: <div>foo-manager-button</div>,
      });
      expect(screen.getAllByText('foo-manager-button')).not.toBeNull();
      expect(
        screen.getByText('foo-manager-button').parentElement,
      ).toBeDisabled();
      const button = screen.getByText('foo-manager-button');
      fireEvent.mouseOver(button);
      expect(
        screen.getAllByText(fr_FR.common_iam_actions_message),
      ).not.toBeNull();
    });
  });
});

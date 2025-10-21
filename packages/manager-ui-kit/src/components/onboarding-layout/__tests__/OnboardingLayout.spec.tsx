import { vi, vitest } from 'vitest';
import { OdsText } from '@ovhcloud/ods-components/react';
import { fireEvent, screen, act } from '@testing-library/react';
import { render } from '@/setupTest';
import { OnboardingLayout } from '../index';
import placeholderSrc from '../../../../public/assets/placeholder.png';
import { useAuthorizationIam } from '../../../hooks/iam';
import { IamAuthorizationResponse } from '../../../hooks/iam/iam.interface';

vitest.mock('../../../hooks/iam', () => ({
  useAuthorizationIam: vitest.fn().mockReturnValue({
    isAuthorized: true,
    isLoading: false,
    isFetched: true,
  }),
}));

const mockedHook =
  useAuthorizationIam as unknown as jest.Mock<IamAuthorizationResponse>;
const customTitle = 'onboarding title';
const imgAltText = 'img alt text';
const descriptionText = 'description text';
const orderBtnLabel = 'Order Now';
const infoBtnLabel = 'more info';
const children = <>Test Onboarding 1</>;

describe('specs:onboarding', () => {
  describe('default content', () => {
    it('displays default content', () => {
      render(<OnboardingLayout title={customTitle} />);
      expect(screen.getByText(customTitle)).toBeVisible();
      expect(screen.getByAltText('placeholder image')).toBeVisible();
    });
  });
  describe('additional contents', () => {
    it('displays description correctly', () => {
      render(
        <OnboardingLayout
          title={customTitle}
          description={
            <OdsText preset="paragraph" className="text-center">
              {descriptionText}
            </OdsText>
          }
        />,
      );
      expect(screen.getByText(descriptionText)).toBeVisible();
    });
    it('displays img correctly', () => {
      render(
        <OnboardingLayout
          title={customTitle}
          img={{ src: placeholderSrc, alt: imgAltText }}
        />,
      );
      expect(screen.getByAltText(imgAltText)).toBeVisible();
    });
    it('disable order button with false value for useAuthorizationIam', () => {
      mockedHook.mockReturnValue({
        isAuthorized: false,
        isLoading: true,
        isFetched: true,
      });
      render(
        <OnboardingLayout
          title={customTitle}
          img={{ src: placeholderSrc, alt: imgAltText }}
          orderHref="https://example.com/order"
          orderButtonLabel={orderBtnLabel}
          orderIam={{
            urn: 'urn:v1:eu:resource:vrackServices:vrs-bby-zkm-3a9-tlk',
            iamActions: ['vrackServices:apiovh:resource/edit'],
          }}
        />,
      );
      const orderButton = screen.getByText(orderBtnLabel);
      expect(orderButton).toBeVisible();
      expect(orderButton).toHaveAttribute('disabled');
    });
    it('displays order button correctly', () => {
      mockedHook.mockReturnValue({
        isAuthorized: true,
        isLoading: false,
        isFetched: true,
      });
      const onOrderButtonClick = vi.fn();

      render(
        <OnboardingLayout
          title={customTitle}
          orderHref="https://example.com/order"
          orderButtonLabel={orderBtnLabel}
          onOrderButtonClick={onOrderButtonClick}
        />,
      );
      const orderButton = screen.getByText(orderBtnLabel);
      expect(orderButton).toBeVisible();
      act(() => fireEvent.click(orderButton));
      expect(onOrderButtonClick).toHaveBeenCalledTimes(1);
    });
    it('disable buttons', () => {
      render(
        <OnboardingLayout
          title={customTitle}
          moreInfoHref="https://example.com/order"
          moreInfoButtonLabel={infoBtnLabel}
          orderButtonLabel={orderBtnLabel}
          onOrderButtonClick={vi.fn()}
          isMoreInfoButtonDisabled={true}
          isActionDisabled={true}
        />,
      );
      const orderButton = screen.getByText(orderBtnLabel);
      const moreInfoButton = screen.getByText(infoBtnLabel);
      expect(orderButton).toHaveAttribute('disabled');
      expect(moreInfoButton).toHaveAttribute('disabled');
    });

    it('displays children correctly', () => {
      mockedHook.mockReturnValue({
        isAuthorized: true,
        isLoading: false,
        isFetched: true,
      });
      render(
        <OnboardingLayout title={customTitle}>{children}</OnboardingLayout>,
      );
      const card = screen.getByText('Test Onboarding 1');
      expect(card).toBeVisible();
    });
  });
});

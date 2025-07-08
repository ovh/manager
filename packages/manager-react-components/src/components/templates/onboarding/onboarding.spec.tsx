import React from 'react';
import { vi, vitest } from 'vitest';
import { waitFor, fireEvent, screen } from '@testing-library/react';
import { render } from '../../../utils/test.provider';
import {
  OnboardingLayout,
  OnboardingLayoutProps,
} from './onboarding.component';
import { OdsText } from '@ovhcloud/ods-components/react';
import placeholderSrc from './../../../../public/assets/placeholder.png';
import { Card } from '../../navigation/card/card.component';
import { useAuthorizationIam } from '../../../hooks/iam';
import { IamAuthorizationResponse } from '../../../hooks/iam/iam.interface';

const setupSpecTest = async (props: OnboardingLayoutProps) =>
  waitFor(() => render(<OnboardingLayout {...props} />));
vitest.mock('../../../hooks/iam');
const mockedHook =
  useAuthorizationIam as unknown as jest.Mock<IamAuthorizationResponse>;
const customTitle = 'onboarding title';
const imgAltText = 'img alt text';
const descriptionText = 'description text';
const orderBtnLabel = 'Order Now';
const infoBtnLabel = 'more info';
const children = (
  <>
    <Card
      href={''}
      texts={{
        title: 'Test Onboarding 1',
        description: 'This is the description 1',
        category: 'WEB',
      }}
    />
    <Card
      href={''}
      texts={{
        title: 'Test Onboarding 2',
        description: 'This is the description 2',
        category: 'CLOUD',
      }}
    />
    <Card
      href={''}
      texts={{
        title: 'Test Onboarding  3',
        description: 'This is the description 3',
        category: 'TELECOM',
      }}
    />
  </>
);

describe('specs:onboarding', () => {
  describe('default content', () => {
    it('displays default content', async () => {
      const screen = await setupSpecTest({ title: customTitle });
      expect(screen.getByText(customTitle)).toBeVisible();
      expect(screen.getByAltText('placeholder image')).toBeVisible();
    });
  });
  describe('additional contents', () => {
    it('displays description correctly', async () => {
      const screen = await setupSpecTest({
        title: customTitle,
        description: (
          <OdsText preset="paragraph" className="text-center">
            {descriptionText}
          </OdsText>
        ),
      });
      expect(screen.getByText(descriptionText)).toBeVisible();
    });
    it('displays img correctly', async () => {
      const screen = await setupSpecTest({
        title: customTitle,
        img: { src: placeholderSrc, alt: imgAltText },
      });
      expect(screen.getByAltText(imgAltText)).toBeVisible();
    });
    it('disable order button with false value for useAuthorizationIam', async () => {
      mockedHook.mockReturnValue({
        isAuthorized: false,
        isLoading: true,
        isFetched: true,
      });
      const screen = await setupSpecTest({
        title: customTitle,
        orderHref: 'https://example.com/order',
        orderButtonLabel: orderBtnLabel,
        orderIam: {
          urn: 'urn:v1:eu:resource:vrackServices:vrs-bby-zkm-3a9-tlk',
          iamActions: ['vrackServices:apiovh:resource/edit'],
        },
      });
      const orderButton = screen.container.querySelector(
        `[label="${orderBtnLabel}"]`,
      );
      expect(orderButton).toBeVisible();
      expect(orderButton).toHaveAttribute('is-disabled', 'true');
    });
    it('displays order button correctly', async () => {
      const onOrderButtonClick = vi.fn();
      const screen = await setupSpecTest({
        title: customTitle,
        orderHref: 'https://example.com/order',
        orderButtonLabel: orderBtnLabel,
        onOrderButtonClick,
      });
      const orderButton = screen.container.querySelector(
        `[label="${orderBtnLabel}"]`,
      );
      expect(orderButton).toBeVisible();
      await waitFor(() => fireEvent.click(orderButton));
      expect(onOrderButtonClick).toHaveBeenCalledTimes(1);
    });
    it('displays more info button correctly', async () => {
      const onMoreInfoButtonClick = vi.fn();
      const screen = await setupSpecTest({
        title: 'title',
        moreInfoHref: 'https://example.com/order',
        moreInfoButtonLabel: infoBtnLabel,
        onMoreInfoButtonClick,
      });
      const moreInfoButton = screen.container.querySelector(
        `[label="${infoBtnLabel}"]`,
      );
      expect(moreInfoButton).toBeVisible();
      await waitFor(() => fireEvent.click(moreInfoButton));
      expect(onMoreInfoButtonClick).toHaveBeenCalledTimes(1);
    });
    it('disable buttons', async () => {
      const screen = await setupSpecTest({
        title: 'title',
        moreInfoHref: 'https://example.com/order',
        moreInfoButtonLabel: infoBtnLabel,
        orderButtonLabel: orderBtnLabel,
        onOrderButtonClick: vi.fn(),
        isMoreInfoButtonDisabled: true,
        isActionDisabled: true,
      });
      const orderButton = screen.container.querySelector(
        `[label="${infoBtnLabel}"]`,
      );
      const moreInfoButton = screen.container.querySelector(
        `[label="${orderBtnLabel}"]`,
      );
      expect(orderButton).toHaveAttribute('is-disabled', 'true');
      expect(moreInfoButton).toHaveAttribute('is-disabled', 'true');
    });
    it('disable buttons', async () => {
      const screen = await setupSpecTest({
        title: 'title',
        moreInfoHref: 'https://example.com/order',
        moreInfoButtonLabel: infoBtnLabel,
        orderButtonLabel: orderBtnLabel,
        onOrderButtonClick: vi.fn(),
        isMoreInfoButtonDisabled: true,
        isActionDisabled: true,
      });
      const orderButton = screen.container.querySelector(
        `[label="${infoBtnLabel}"]`,
      );
      const moreInfoButton = screen.container.querySelector(
        `[label="${orderBtnLabel}"]`,
      );
      expect(orderButton).toHaveAttribute('is-disabled', 'true');
      expect(moreInfoButton).toHaveAttribute('is-disabled', 'true');
    });
    // it('displays children correctly', async () => {
    //   waitFor(() =>
    //     render(
    //       <OnboardingLayout title={customTitle}>{children}</OnboardingLayout>,
    //     ),
    //   );
    //   const card = screen.getByText('Test Onboarding 1');
    //   expect(card.closest('aside')).toHaveClass(
    //     'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 xs:pt-10 sm:pt-20',
    //   );
    // });
  });
});

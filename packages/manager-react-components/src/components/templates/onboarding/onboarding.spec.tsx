import React from 'react';
import { waitFor } from '@testing-library/react';
import { render } from '../../../utils/test.provider';
import {
  OnboardingLayout,
  OnboardingLayoutProps,
} from './onboarding.component';
import { OdsText } from '@ovhcloud/ods-components/react';
import placeholderSrc from './../../../../public/assets/placeholder.png';
import { Card } from '../../navigation/card/card.component';

const setupSpecTest = async (props: OnboardingLayoutProps) =>
  waitFor(() => render(<OnboardingLayout {...props} />));

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

    it('displays order button correctly', async () => {
      const screen = await setupSpecTest({
        title: customTitle,
        orderHref: 'https://example.com/order',
        orderButtonLabel: orderBtnLabel,
      });

      const orderButton = screen.container.querySelector(
        `[label="${orderBtnLabel}"]`,
      );
      expect(orderButton).toBeVisible();
    });

    it('displays more info button correctly', async () => {
      const screen = await setupSpecTest({
        title: 'title',
        moreInfoHref: 'https://example.com/order',
        moreInfoButtonLabel: infoBtnLabel,
      });

      const orderButton = screen.container.querySelector(
        `[label="${infoBtnLabel}"]`,
      );
      expect(orderButton).toBeVisible();
    });

    it('displays children correctly', async () => {
      const screen = await waitFor(() =>
        render(
          <OnboardingLayout title={customTitle}>{children}</OnboardingLayout>,
        ),
      );

      const card = screen.getByText('Test Onboarding 1');
      expect(card.closest('aside')).toHaveClass(
        'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 xs:pt-10 sm:pt-20',
      );
    });
  });
});

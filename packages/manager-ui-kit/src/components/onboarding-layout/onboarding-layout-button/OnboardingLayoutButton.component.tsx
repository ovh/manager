import { FC } from 'react';

import { BUTTON_SIZE, BUTTON_VARIANT, ICON_NAME, Icon } from '@ovhcloud/ods-react';

import { Button } from '@/components/button/Button.component';
import { OnboardingLayoutButtonProps } from '@/components/onboarding-layout/onboarding-layout-button/OnboardingLayoutButton.props';

export const OnboardingLayoutButton: FC<OnboardingLayoutButtonProps> = ({
  orderButtonLabel,
  orderHref,
  onOrderButtonClick,
  isActionDisabled,
  orderIam,
  moreInfoHref,
  moreInfoButtonLabel,
  moreInfoButtonIcon = ICON_NAME.externalLink,
  onMoreInfoButtonClick,
  isMoreInfoButtonDisabled,
}) => {
  if (!orderButtonLabel && !moreInfoButtonLabel) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3 sm:gap-4 w-full sm:w-fit sm:flex-row sm:items-center sm:justify-center">
      {orderButtonLabel && (onOrderButtonClick || orderHref) && (
        <Button
          className="[&::part(button)]:w-full sm:w-auto"
          size={BUTTON_SIZE.md}
          onClick={() => {
            onOrderButtonClick?.();
            if (orderHref) {
              window.open(orderHref, '_blank');
            }
          }}
          disabled={isActionDisabled}
          {...(orderIam || {})}
        >
          {orderButtonLabel}
        </Button>
      )}
      {moreInfoButtonLabel && moreInfoHref && (
        <Button
          className="[&::part(button)]:w-full sm:w-auto"
          size={BUTTON_SIZE.md}
          variant={BUTTON_VARIANT.outline}
          onClick={() => {
            if (!isMoreInfoButtonDisabled) {
              onMoreInfoButtonClick?.();
              if (moreInfoHref) {
                window.open(moreInfoHref, '_blank');
              }
            }
          }}
          disabled={isMoreInfoButtonDisabled}
        >
          <>
            {moreInfoButtonLabel}
            <Icon aria-hidden="true" name={moreInfoButtonIcon} />
          </>
        </Button>
      )}
    </div>
  );
};

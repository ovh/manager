import { FC } from 'react';
import { ODS_BUTTON_SIZE, ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { Icon, ICON_NAME } from '@ovhcloud/ods-react';
import { Button } from '../../button';
import { OnboardingLayoutButtonProps } from './OnboardingLayoutButton.type';

const OnboardingLayoutButton: FC<OnboardingLayoutButtonProps> = ({
  orderButtonLabel,
  orderHref,
  onOrderButtonClick,
  isActionDisabled,
  orderIam,
  moreInfoHref,
  moreInfoButtonLabel,
  moreInfoButtonIcon = ICON_NAME.externalLink,
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
          size={ODS_BUTTON_SIZE.md}
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
          size={ODS_BUTTON_SIZE.md}
          variant={ODS_BUTTON_VARIANT.outline}
          onClick={() => {
            if (!isMoreInfoButtonDisabled) {
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

export default OnboardingLayoutButton;

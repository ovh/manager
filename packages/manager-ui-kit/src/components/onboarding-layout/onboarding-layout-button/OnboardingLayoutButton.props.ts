import { ICON_NAME } from '@ovhcloud/ods-react';

export type OnboardingLayoutButtonProps = {
  orderButtonLabel?: string;
  orderHref?: string;
  onOrderButtonClick?: () => void;
  isActionDisabled?: boolean;
  orderIam?: {
    urn: string;
    iamActions: string[];
    displayTooltip?: boolean;
  };
  moreInfoHref?: string;
  moreInfoButtonIcon?: ICON_NAME;
  moreInfoButtonLabel?: string;
  onMoreInfoButtonClick?: () => void;
  isMoreInfoButtonDisabled?: boolean;
};

import { ODS_ICON_NAME } from '@ovhcloud/ods-components';

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
  moreInfoButtonIcon?: ODS_ICON_NAME;
  moreInfoButtonLabel?: string;
  isMoreInfoButtonDisabled?: boolean;
};

import { ODS_BUTTON_SIZE, ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { OdsButton } from '@ovhcloud/ods-components/react';

export const ObsServiceOrderButton = () => {
  return (
    <OdsButton
      className="[&::part(button)]:w-full sm:w-auto"
      size={ODS_BUTTON_SIZE.md}
      variant={ODS_BUTTON_VARIANT.outline}
      onClick={() => {}}
      label={'Commander un service'}
    />
  );
};

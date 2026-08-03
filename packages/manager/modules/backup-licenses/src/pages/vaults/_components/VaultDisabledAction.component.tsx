import React from 'react';

import { ODS_BUTTON_SIZE, ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { OdsButton, OdsTooltip } from '@ovhcloud/ods-components/react';

export type VaultDisabledActionProps = {
  id: string;
  tooltipId: string;
  testId: string;
  label: string;
  tooltip: string;
};

export const VaultDisabledAction = ({
  id,
  tooltipId,
  testId,
  label,
  tooltip,
}: VaultDisabledActionProps) => (
  <>
    {/* A disabled ODS button neither takes focus nor exposes its shadow-root name (see ActionButton),
        so the entry itself is the wrapper: it carries the role, the accessible name and the
        unavailable state, leaving the ODS button as the visual shell only. */}
    <span
      id={id}
      role="button"
      aria-disabled="true"
      aria-label={label}
      tabIndex={0}
      aria-describedby={tooltipId}
      className="w-full"
    >
      <OdsButton
        data-testid={testId}
        size={ODS_BUTTON_SIZE.sm}
        variant={ODS_BUTTON_VARIANT.ghost}
        className="w-full"
        aria-hidden="true"
        isDisabled
        label={label}
      />
    </span>
    <OdsTooltip id={tooltipId} triggerId={id} withArrow>
      {tooltip}
    </OdsTooltip>
  </>
);

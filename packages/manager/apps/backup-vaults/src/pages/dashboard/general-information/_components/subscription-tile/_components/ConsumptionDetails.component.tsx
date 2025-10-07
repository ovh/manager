import {OdsBadge} from "@ovhcloud/ods-components/react";

export const ConsumptionDetails = () => {
  return (
    <ul className="flex gap-3 list-none p-0">
      <li>
        <OdsBadge color="information" label="region-one" />
      </li>
      <li>
        <OdsBadge color="information" label="region-two" />
      </li>
    </ul>)
}

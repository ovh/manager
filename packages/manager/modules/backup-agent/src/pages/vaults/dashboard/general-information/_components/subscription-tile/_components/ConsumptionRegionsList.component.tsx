import { useId } from 'react';

import { OdsProgressBar, OdsText } from '@ovhcloud/ods-components/react';

export const ConsumptionRegionsList = () => {
  const idLabel = useId();

  return (
    <section aria-labelledby={idLabel} className="flex flex-col gap-2">
      <OdsText id={idLabel}>500 Go / 10 To (5.00%)</OdsText>
      <OdsProgressBar value={5} className="[&::part(progress)]:w-full" />
    </section>
  );
};

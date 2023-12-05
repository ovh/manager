import { OsdsButton } from '@ovhcloud/ods-components/button/react';
import { OsdsModal } from '@ovhcloud/ods-components/modal/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';

interface BootProps {
  instance: { id: string };
  onClose: CallableFunction;
}

export default function Boot({ instance, onClose }: BootProps) {
  return (
    <>
      <OsdsModal>
        <slot name="content">
          Boot instance {instance.id}
          <button onClick={() => onClose()}>Close</button>
        </slot>
        <OsdsButton slot="actions" color={ODS_THEME_COLOR_INTENT.default}>
          Cancel
        </OsdsButton>
        <OsdsButton slot="actions" color={ODS_THEME_COLOR_INTENT.primary}>
          Submit
        </OsdsButton>
      </OsdsModal>
    </>
  );
}

import { FC } from 'react';
import {
  OsdsButton,
  OsdsModal,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { ODS_BUTTON_SIZE, ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';

type ComplianceReminderModalProps = {
  testId: string;
  title: string;
  description: string;
  laterLabel: string;
  updateLabel: string;
  onLater: () => void;
  onUpdate: () => void;
};

/** F1 compliance reminders — non-blocking: dismissible, with a CTA. */
export const ComplianceReminderModal: FC<ComplianceReminderModalProps> = ({
  testId,
  title,
  description,
  laterLabel,
  updateLabel,
  onLater,
  onUpdate,
}) => (
  <OsdsModal
    dismissible={true}
    onOdsModalClose={onLater}
    headline={title}
    color={ODS_THEME_COLOR_INTENT.warning}
    data-testid={testId}
  >
    <OsdsText
      color={ODS_THEME_COLOR_INTENT.text}
      size={ODS_THEME_TYPOGRAPHY_SIZE._400}
    >
      {description}
    </OsdsText>
    <OsdsButton
      onClick={onLater}
      slot="actions"
      color={ODS_THEME_COLOR_INTENT.primary}
      variant={ODS_BUTTON_VARIANT.stroked}
      size={ODS_BUTTON_SIZE.sm}
      data-testid={`${testId}-later`}
    >
      {laterLabel}
    </OsdsButton>
    <OsdsButton
      onClick={onUpdate}
      slot="actions"
      color={ODS_THEME_COLOR_INTENT.primary}
      variant={ODS_BUTTON_VARIANT.flat}
      size={ODS_BUTTON_SIZE.sm}
      data-testid={`${testId}-update`}
    >
      {updateLabel}
    </OsdsButton>
  </OsdsModal>
);

import { OsdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';

import { Voucher } from '@/interface';

type AvailableCreditPropsType = {
  rowData?: Pick<Voucher, 'available_credit'>;
};

export default function AvailableCredit({ rowData }: AvailableCreditPropsType) {
  return (
    <OsdsText
      level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
      size={ODS_THEME_TYPOGRAPHY_SIZE._400}
      color={ODS_THEME_COLOR_INTENT.text}
    >
      {rowData?.available_credit.text || ''}
    </OsdsText>
  );
}

import { OsdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';

import { Voucher } from '@/interface';

type TotalCreditPropsType = {
  rowData?: Pick<Voucher, 'total_credit'>;
};

export default function TotalCredit({ rowData }: TotalCreditPropsType) {
  return (
    <OsdsText
      level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
      size={ODS_THEME_TYPOGRAPHY_SIZE._400}
      color={ODS_THEME_COLOR_INTENT.text}
    >
      {rowData?.total_credit.text || ''}
    </OsdsText>
  );
}

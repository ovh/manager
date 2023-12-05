import { useTranslation } from 'react-i18next';
import { OsdsText } from '@ovhcloud/ods-components/text/react';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';

import { FormatterComponentProps } from '@/interface';

export default function Product(props: FormatterComponentProps) {
  const { t } = useTranslation('common');
  return (
    <OsdsText
      level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
      size={ODS_THEME_TYPOGRAPHY_SIZE._400}
      color={ODS_THEME_COLOR_INTENT.text}
    >
      {props.cellData || t('cpb_vouchers_products_all')}
    </OsdsText>
  );
}

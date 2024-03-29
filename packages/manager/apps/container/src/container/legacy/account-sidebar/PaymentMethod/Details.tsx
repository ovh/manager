import React from 'react';

import { useTranslation } from 'react-i18next';

import { TRANSLATE_NAMESPACE } from '../constants';

import { PaymentMethodType } from './usePaymentMethod';

import { OsdsChip, OsdsText } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_LEVEL } from '@ovhcloud/ods-components';

import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_COLOR_HUE,
} from '@ovhcloud/ods-common-theming';

type Props = {
  defaultPaymentMethod?: PaymentMethodType;
  translationBase?: string;
};

const Details = ({
  defaultPaymentMethod = null,
  translationBase = '',
}: Props): JSX.Element => {
  const { t } = useTranslation(TRANSLATE_NAMESPACE);
  return (
    <div className="mx-auto p-1 min-w-0 w-full">
      <OsdsText
        className="m-0 p-0"
        level={ODS_TEXT_LEVEL.subheading}
        color={ODS_THEME_COLOR_INTENT.primary}
        hue={ODS_THEME_COLOR_HUE._800}
      >
        {t(`${translationBase}_title`)}
      </OsdsText>

      {defaultPaymentMethod ? (
        <>
          <OsdsText
            level={ODS_TEXT_LEVEL.body}
            color={ODS_THEME_COLOR_INTENT.text}
          ></OsdsText>
          <p className="m-0 truncate">{defaultPaymentMethod.label}</p>
          <OsdsChip
            inline
            color={
              ODS_THEME_COLOR_INTENT[
                defaultPaymentMethod.getStatusCategory() as keyof typeof ODS_THEME_COLOR_INTENT
              ]
            }
          >
            {t(`${translationBase}_status_${defaultPaymentMethod.status}`)}
          </OsdsChip>
        </>
      ) : (
        <p>{t(`${translationBase}_none`)}</p>
      )}
    </div>
  );
};

export default Details;

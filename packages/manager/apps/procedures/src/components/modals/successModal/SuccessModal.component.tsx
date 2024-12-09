import React, { FunctionComponent } from 'react';
import {
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_TEXT_COLOR_HUE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsIcon,
  OsdsModal,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';

type Props = {
  title: string;
  description: string;
  ovhHomePageHref: string;
  ovhHomePageLabel: string;
};

export const SuccessModal: FunctionComponent<Props> = ({
  ovhHomePageHref,
  title,
  description,
  ovhHomePageLabel,
}) => {
  const gotToHomePage = () => {
    window.location.href = ovhHomePageHref;
  };

  return (
    <OsdsModal dismissible onOdsModalClose={gotToHomePage}>
      <div className="text-center">
        <OsdsIcon
          name={ODS_ICON_NAME.PAPERPLANE_CONCEPT}
          className="font-bold"
          color={ODS_THEME_COLOR_INTENT.primary}
          size={ODS_ICON_SIZE.xl}
        ></OsdsIcon>
        <OsdsText
          level={ODS_TEXT_LEVEL.caption}
          color={ODS_THEME_COLOR_INTENT.text}
          size={ODS_TEXT_SIZE._400}
          className="block font-bold"
          hue={ODS_TEXT_COLOR_HUE._700}
        >
          {title}
        </OsdsText>
        <OsdsText
          level={ODS_TEXT_LEVEL.caption}
          color={ODS_THEME_COLOR_INTENT.text}
          size={ODS_TEXT_SIZE._300}
          className="block mt-2"
          hue={ODS_TEXT_COLOR_HUE._500}
        >
          {description}
        </OsdsText>
      </div>
      <OsdsButton
        slot="actions"
        variant={ODS_BUTTON_VARIANT.flat}
        color={ODS_THEME_COLOR_INTENT.primary}
        onClick={gotToHomePage}
      >
        {ovhHomePageLabel}
      </OsdsButton>
    </OsdsModal>
  );
};

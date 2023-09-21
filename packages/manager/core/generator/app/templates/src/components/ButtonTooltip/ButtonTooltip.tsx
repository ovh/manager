import React, { useState, useRef, useEffect } from 'react';
import { OsdsButton } from '@ovhcloud/ods-components/button/react';
import { OsdsIcon } from '@ovhcloud/ods-components/icon/react';
import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components/icon';
import {
  ODS_BUTTON_TYPE,
  ODS_BUTTON_VARIANT,
} from '@ovhcloud/ods-components/button';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import './ButtonTooltip.scss';

interface TooltipItem {
  label: string;
}

interface ButtonTooltipProps {
  tooltipContent: TooltipItem[];
}

const ButtonTooltip: React.FC<ButtonTooltipProps> = (props) => {
  const { tooltipContent } = props;
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node)
      ) {
        setShowTooltip(false);
      }
    };

    document.addEventListener('click', handleDocumentClick);

    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);

  const handleTooltipToggle = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.stopPropagation();
    setShowTooltip(!showTooltip);
  };

  return (
    <>
      <OsdsButton
        type={ODS_BUTTON_TYPE.button}
        variant={ODS_BUTTON_VARIANT.stroked}
        color={ODS_THEME_COLOR_INTENT.primary}
        onClick={handleTooltipToggle}
        circle
      >
        <OsdsIcon
          name={ODS_ICON_NAME.ELLIPSIS_VERTICAL}
          size={ODS_ICON_SIZE.xxs}
          color={ODS_THEME_COLOR_INTENT.primary}
        />
      </OsdsButton>
      {showTooltip && (
        <div ref={tooltipRef} className="tooltip">
          <div className="tooltip-text">
            {tooltipContent.map((item: TooltipItem) => (
              <div key={item.label}>{item.label}</div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default ButtonTooltip;

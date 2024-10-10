import React, { useState, useRef, useEffect } from 'react';
import { OsdsButton, OsdsIcon } from '@ovhcloud/ods-components/react';
import {
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_BUTTON_TYPE,
  ODS_BUTTON_VARIANT,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';

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
    event: React.MouseEvent<HTMLOsdsButtonElement, MouseEvent>,
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
        onClick={(event) => handleTooltipToggle(event)}
        data-testid="button-tooltip"
        circle
      >
        <OsdsIcon
          name={ODS_ICON_NAME.ELLIPSIS_VERTICAL}
          size={ODS_ICON_SIZE.xxs}
          color={ODS_THEME_COLOR_INTENT.primary}
        />
      </OsdsButton>
      {showTooltip && (
        <div ref={tooltipRef} className="relative inline-block left-[-80%]">
          <div className="absolute bg-white rounded whitespace-nowrap mt-[-4px] right-[-100%] border-2 border-gray-300 text-left z-50">
            {tooltipContent.map((item: TooltipItem) => (
              <div key={item.label} className="px-10 py-20 cursor-pointer">
                {item.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default ButtonTooltip;

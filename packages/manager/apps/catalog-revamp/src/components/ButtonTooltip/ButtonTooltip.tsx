import React, { useState, useRef, useEffect } from 'react';
import { OsdsButton, OsdsIcon } from '@ovhcloud/ods-stencil/components/react/';
import {
  OdsIconName,
  OdsIconSize,
  OdsButtonVariant,
  OdsButtonType,
} from '@ovhcloud/ods-core';
import { OdsThemeColorIntent } from '@ovhcloud/ods-theming';

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
    event: React.MouseEvent<HTMLOsdsButtonElement, MouseEvent>,
  ) => {
    event.stopPropagation();
    setShowTooltip(!showTooltip);
  };

  return (
    <>
      <OsdsButton
        type={OdsButtonType.button}
        variant={OdsButtonVariant.stroked}
        color={OdsThemeColorIntent.primary}
        onClick={handleTooltipToggle}
        circle
      >
        <OsdsIcon
          name={OdsIconName.ELLIPSIS_VERTICAL}
          size={OdsIconSize.xxs}
          color={OdsThemeColorIntent.primary}
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

import React, { useState, useRef, useEffect } from 'react';
import { OsdsButton, OsdsIcon } from '@ovhcloud/ods-stencil/components/react/';
import {
  OdsIconName,
  OdsIconSize,
  OdsButtonVariant,
  OdsButtonType,
} from '@ovhcloud/ods-core';
import { OdsThemeColorIntent } from '@ovhcloud/ods-theming';

function ButtonTooltip(props: any) {
  const { tooltipContent } = props;
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef(null);

  useEffect(() => {
    const handleDocumentClick = (event: any) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
        setShowTooltip(false);
      }
    };

    document.addEventListener('click', handleDocumentClick);

    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);

  const handleTooltipToggle = (event: any) => {
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
          <div className="tooltiptext">
            {tooltipContent.map((item: any) => (
              <div>{item.label}</div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default ButtonTooltip;

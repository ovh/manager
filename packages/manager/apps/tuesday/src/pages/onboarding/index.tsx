import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  OsdsLink,
  OsdsButton,
  OsdsCheckbox,
  OsdsCheckboxButton,
  OsdsToggle,
  OsdsRadioGroup,
  OsdsRadio,
  OsdsTile,
} from '@ovhcloud/ods-stencil/components/react/';
import { OdsThemeColorIntent } from '@ovhcloud/ods-theming';
import { OdsCheckboxButtonSize } from '@ovhcloud/ods-core';

export default function Onboarding() {
  const { t } = useTranslation('tuesday/onboarding');

  const [isValueCheckboxChecked, setValueCheckboxChecked] = useState(false);
  return (
    <div>
      <h1>{t('title')}</h1>
      <div>
        <h2>Test tracking ods button</h2>
        <div>
          <OsdsButton
            data-tracking="button1"
            color={OdsThemeColorIntent.primary}
            flex
          >
            ODS button 1
          </OsdsButton>
        </div>
        <div>
          <OsdsButton
            data-tracking="button2"
            color={OdsThemeColorIntent.primary}
            flex
          >
            ODS button 2
          </OsdsButton>
        </div>
        <div>
          <OsdsButton
            data-tracking="button3"
            color={OdsThemeColorIntent.primary}
            flex
          >
            ODS button 3
          </OsdsButton>
        </div>
        <div>
          <OsdsButton
            data-tracking="button4"
            color={OdsThemeColorIntent.primary}
            flex
          >
            ODS button 4
          </OsdsButton>
        </div>
      </div>
      <div>
        <h2>Test tracking ods link</h2>
        <div>
          <OsdsLink data-tracking="link1" color={OdsThemeColorIntent.primary}>
            ODS Link 1
          </OsdsLink>
        </div>
        <div>
          <OsdsLink data-tracking="link2" color={OdsThemeColorIntent.primary}>
            ODS Link 2
          </OsdsLink>
        </div>
        <div>
          <OsdsLink data-tracking="link3" color={OdsThemeColorIntent.primary}>
            ODS Link 3
          </OsdsLink>
        </div>
      </div>
      <div>
        <h2>Test tracking ods tile in radio group</h2>
        <div>
          <OsdsRadioGroup>
            <OsdsRadio value="A" data-tracking="option-radio-tile-a">
              <OsdsTile interactive>
                Radio-group with Radio & Tile in it (option A)
              </OsdsTile>
            </OsdsRadio>
            <OsdsRadio value="B" data-tracking="option-radio-tile-b">
              <OsdsTile interactive>
                Radio-group with Radio & Tile in it (option B)
              </OsdsTile>
            </OsdsRadio>
          </OsdsRadioGroup>
        </div>
      </div>
      <div>
        <h2>Test tracking ods radio group button</h2>
        <div>
          <OsdsRadioGroup>
            <OsdsRadio value="A">
              <OsdsCheckboxButton
                data-tracking="checkbox-button-option-a"
                size={OdsCheckboxButtonSize.sm}
                interactive
              >
                <span slot={'end'}>Option A</span>
              </OsdsCheckboxButton>
            </OsdsRadio>
            <OsdsRadio value="B">
              <OsdsCheckboxButton
                data-tracking="checkbox-button-option-b"
                size={OdsCheckboxButtonSize.sm}
                interactive
              >
                <span slot={'end'}>Option B</span>
              </OsdsCheckboxButton>
            </OsdsRadio>
          </OsdsRadioGroup>
        </div>
      </div>
      <div>
        <h2>Checkbox</h2>
        <OsdsCheckbox
          value="A"
          checked={isValueCheckboxChecked}
          data-tracking={`checbox-toggle-${isValueCheckboxChecked}`}
        >
          <OsdsToggle></OsdsToggle>
        </OsdsCheckbox>
      </div>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
    </div>
  );
}

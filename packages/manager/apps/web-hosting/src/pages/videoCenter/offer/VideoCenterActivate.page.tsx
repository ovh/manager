import React from 'react';

import { useTranslation } from 'react-i18next';

import {
  BUTTON_COLOR,
  BUTTON_VARIANT,
  Button,
  Card,
  Checkbox,
  CheckboxControl,
  CheckboxLabel,
  Divider,
  ICON_NAME,
  Icon,
  MESSAGE_COLOR,
  Message,
  Radio,
  RadioControl,
  RadioGroup,
  RadioLabel,
  TEXT_PRESET,
  Text,
} from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { BaseLayout, Link } from '@ovh-ux/muk';

export default function ActivatePage() {
  const { t } = useTranslation(['videoManagerCenter', NAMESPACES.ORDER, NAMESPACES.ACTIONS]);

  return (
    <BaseLayout>
      <div className="flex flex-row">
        <div className="w-2/3 space-y-8">
          <Text preset={TEXT_PRESET.heading2}>{t('video_manager_service_activate')}</Text>
          <RadioGroup value="plus">
            <div className="flex flex-row space-x-4">
              <Card onClick={() => {}} className="w-full">
                <div className="flex items-center gap-4 p-4">
                  <Radio value="plus">
                    <RadioControl />
                    <RadioLabel>
                      <Text preset={TEXT_PRESET.heading6}>{t('video_manager_service_free')}</Text>
                    </RadioLabel>
                  </Radio>
                </div>
                <div className="ml-8 mt-4 p-4">
                  <Divider />
                  <div className="flex items-center">
                    <Icon name={ICON_NAME.check} color="success"></Icon>
                    <Text preset={TEXT_PRESET.caption}>
                      {t('video_manager_service_video_free_count')}
                    </Text>
                  </div>
                  <div className="flex items-center">
                    <Icon name={ICON_NAME.check} color="success"></Icon>
                    <Text preset={TEXT_PRESET.caption}>
                      {t('video_manager_service_video_free_duration')}
                    </Text>
                  </div>
                </div>
                <Message color={MESSAGE_COLOR.information} dismissible={false} className="w-full">
                  {t('video_manager_service_video_free_included')}
                </Message>
              </Card>
            </div>
          </RadioGroup>
          <Divider />
          <Text preset={TEXT_PRESET.heading5}>{t('video_manager_service_duration')}</Text>
          <Card className="w-full p-4">
            <Checkbox checked={true} name="duration">
              <CheckboxControl />
              <CheckboxLabel>
                <Text preset={TEXT_PRESET.heading6}>
                  {t('video_manager_service_duration_value')}
                </Text>
              </CheckboxLabel>
            </Checkbox>
          </Card>
          <Divider />
          <Text preset={TEXT_PRESET.heading5}>{t('video_manager_service_contract')}</Text>
          <Checkbox name="duration">
            <CheckboxControl />
            <CheckboxLabel>
              <Text>{t(`${NAMESPACES.ORDER}:accept_terms`)}</Text>
            </CheckboxLabel>
          </Checkbox>
          <Link target="_blank" rel="noopener noreferrer">
            <>
              {t('video_manager_service_terms')}
              <Icon name={ICON_NAME.externalLink}></Icon>
            </>
          </Link>
          <div className="flex space-x-4">
            <Button variant={BUTTON_VARIANT.outline} color={BUTTON_COLOR.primary}>
              {t(`${NAMESPACES.ACTIONS}:cancel`)}
            </Button>
            <Button variant={BUTTON_VARIANT.default} color={BUTTON_COLOR.primary}>
              {t(`${NAMESPACES.ACTIONS}:activate`)}
            </Button>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}

import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  Checkbox,
  CheckboxControl,
  CheckboxLabel,
  Card,
  Icon,
  ICON_NAME,
  CARD_COLOR,
  TEXT_PRESET,
  Text,
} from '@ovh-ux/muk';
import { ViewContext } from './viewContext';
import style from './style.module.scss';

export const ManageViewConfig = () => {
  const { columnsConfig, setColumnVisibility } = useContext(ViewContext);
  const { t } = useTranslation('manage-view');
  const { t: tCommon } = useTranslation(NAMESPACES.ACTIONS);

  return (
    <Accordion>
      <AccordionItem value="0">
        <AccordionTrigger>
          <Text preset={TEXT_PRESET.heading6}>
            {t('select_columns_visibility')}
          </Text>
        </AccordionTrigger>
        <AccordionContent>
          <ul className={style['column-list']}>
            {columnsConfig.map(
              (column) =>
                column.label && (
                  <li className={style['column-list__item']} key={column.id}>
                    <Card
                      className={[
                        style['column-list__item__card'],
                        !column.enableHiding && style.disabled,
                        column.visible && column.enableHiding && style.selected,
                      ].join(' ')}
                      color={
                        column.visible && column.enableHiding
                          ? CARD_COLOR.primary
                          : CARD_COLOR.neutral
                      }
                      onClick={() => {
                        if (column.enableHiding) {
                          setColumnVisibility((prev) => ({
                            ...prev,
                            [column.id]: !column.visible,
                          }));
                        }
                      }}
                    >
                      <Checkbox
                        disabled={!column.enableHiding}
                        checked={column.visible}
                      >
                        <CheckboxControl />

                        <CheckboxLabel>
                          <Text preset={TEXT_PRESET.heading5}>
                            {column.label}
                          </Text>
                        </CheckboxLabel>
                      </Checkbox>
                      {/* <Icon name={ICON_NAME.dragDrop} /> */}
                      <Icon name={ICON_NAME.ellipsisVertical} />
                    </Card>
                  </li>
                ),
            )}
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default ManageViewConfig;

import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  BUTTON_VARIANT,
  ICON_NAME,
  Message,
  MESSAGE_COLOR,
  MessageBody,
  MessageIcon,
  Radio,
  RadioControl,
  RadioGroup,
  RadioLabel,
  RadioValueChangeDetail,
} from '@ovhcloud/ods-react';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { TOngoingOperations } from '@/types';
import { ActionNameEnum } from '@/enum/actionName.enum';
import { urls } from '@/routes/routes.constant';
import { useTrackNavigation } from '@/hooks/tracking/useTrackDatagridNavivationLink';

interface UpdateActionsProps {
  readonly data: TOngoingOperations;
  readonly actionName: ActionNameEnum;
  readonly disabled: boolean;
  readonly isActionLoading: boolean;
  readonly onValidate: () => void;
  readonly setActionName: (label: ActionNameEnum) => void;
}

export default function UpdateActions({
  data,
  actionName,
  disabled,
  isActionLoading,
  onValidate,
  setActionName,
}: UpdateActionsProps) {
  const { trackPageNavivationButton } = useTrackNavigation();
  const { t } = useTranslation(['dashboard', NAMESPACES.ACTIONS]);
  const navigate = useNavigate();

  return (
    <section className="flex flex-col gap-y-6">
      <RadioGroup
        orientation="vertical"
        onValueChange={(detail: RadioValueChangeDetail) =>
          setActionName(detail.value as ActionNameEnum)
        }
      >
        <Radio value={ActionNameEnum.CanRelaunch} disabled={!data.canRelaunch}>
          <RadioControl />
          <RadioLabel
            className={
              data.canRelaunch
                ? 'text-[var(--ods-color-text)]'
                : 'text-[var(--ods-color-text-disabled-default)]'
            }
          >
            {t('domain_operations_relaunch_title')}
          </RadioLabel>
        </Radio>
        <Radio
          value={ActionNameEnum.CanAccelerate}
          disabled={!data.canAccelerate}
        >
          <RadioControl />
          <RadioLabel
            className={
              data.canAccelerate
                ? 'text-[var(--ods-color-text)]'
                : 'text-[var(--ods-color-text-disabled-default)]'
            }
          >
            {t('domain_operations_accelerate_title')}
          </RadioLabel>
        </Radio>
        <Radio value={ActionNameEnum.CanCancel} disabled={!data.canCancel}>
          <RadioControl />
          <RadioLabel
            className={
              data.canCancel
                ? 'text-[var(--ods-color-text)]'
                : 'text-[var(--ods-color-text-disabled-default)]'
            }
          >
            {t('domain_operations_cancel_title')}
          </RadioLabel>
        </Radio>
      </RadioGroup>
      {actionName === ActionNameEnum.CanAccelerate && (
        <Message color={MESSAGE_COLOR.warning} dismissible={false}>
          <MessageIcon name={ICON_NAME.diamondExclamation}></MessageIcon>
          <MessageBody>{t('domain_operations_accelerate_warning')}</MessageBody>
        </Message>
      )}

      <div className="flex gap-x-2 mt-8">
        <Button
          name='cancel'
          slot="actions"
          onClick={() => {
            const url = urls.root;
            trackPageNavivationButton(url);
            navigate(url);
          }}
          variant={BUTTON_VARIANT.ghost}
        >
          {t(`${NAMESPACES.ACTIONS}:cancel`)}
        </Button>
        <Button
          name='confirm'
          slot="actions"
          onClick={() => {
            onValidate();
          }}
          disabled={disabled}
          loading={isActionLoading}
        >
          {t(`${NAMESPACES.ACTIONS}:confirm`)}
        </Button>
      </div>
    </section>
  );
}

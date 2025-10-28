import { useState } from 'react';

import { ODS_ICON_NAME, ODS_INPUT_TYPE, OdsInputValueChangeEvent } from '@ovhcloud/ods-components';
import { OsdsInput } from '@ovhcloud/ods-components/react';

import { DataGridTextCell } from '@ovh-ux/manager-react-components';

import { isIPValid } from '@/helpers';

import RestrictionAction from './RestrictionAction.component';

type TRestrictionLine = {
  ip: string;
  ipIndex: number;
  disabled: boolean | undefined;
  onSave: (ip: string, index: number) => void;
  onClose: (ip: string, index: number) => void;
  onDelete: (ip: string) => void;
};

export default function RestrictionLine({
  ip,
  ipIndex,
  disabled,
  onSave,
  onDelete,
  onClose,
}: Readonly<TRestrictionLine>) {
  const [displayedIP, setDisplayedIP] = useState(ip);
  const [isEditing, setIsEditing] = useState(!ip);
  const [isTouched, setIsTouched] = useState(false);

  return (
    <div className="flex items-center justify-between">
      <div className="mx-5">
        {isEditing ? (
          <OsdsInput
            data-testid="input-ip"
            type={ODS_INPUT_TYPE.text}
            value={displayedIP}
            error={isTouched && !isIPValid(displayedIP)}
            className={
              isTouched && !isIPValid(displayedIP)
                ? 'bg-red-100 border-red-500 text-red-500 focus:text-red-500'
                : 'border-color-[var(--ods-color-default-200)] bg-white'
            }
            onOdsValueChange={(e: OdsInputValueChangeEvent) => {
              setDisplayedIP(e.detail.value);
            }}
            onOdsInputBlur={() => setIsTouched(true)}
          />
        ) : (
          <DataGridTextCell>{displayedIP}</DataGridTextCell>
        )}
      </div>
      <div className="min-w-16 flex flex-end gap-2 mx-5 max-w-sm float-right">
        {isEditing ? (
          <>
            <RestrictionAction
              testId="pen-icon-save"
              iconName={ODS_ICON_NAME.CHECK}
              onClick={() => {
                setIsEditing(false);
                onSave(displayedIP, ipIndex);
              }}
              disabled={!isIPValid(displayedIP) || disabled}
            />
            <RestrictionAction
              testId="trash-icon-close"
              iconName={ODS_ICON_NAME.CLOSE}
              onClick={() => {
                setIsEditing(false);
                onClose(ip, ipIndex);
              }}
              disabled={disabled}
            />
          </>
        ) : (
          <>
            <RestrictionAction
              testId="pen-icon-edit"
              iconName={ODS_ICON_NAME.PEN}
              onClick={() => setIsEditing(true)}
              disabled={disabled}
            />
            <RestrictionAction
              testId="trash-icon-delete"
              iconName={ODS_ICON_NAME.TRASH}
              onClick={() => onDelete(displayedIP)}
              disabled={disabled}
            />
          </>
        )}
      </div>
    </div>
  );
}

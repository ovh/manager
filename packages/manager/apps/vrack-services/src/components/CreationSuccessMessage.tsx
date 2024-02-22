import React from 'react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_MESSAGE_TYPE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { OsdsMessage, OsdsText } from '@ovhcloud/ods-components/react';
import { useMutationState } from '@tanstack/react-query';

export type Props = {
  mutationKey: string[];
  message: string;
};

export const CreationSuccessMessage: React.FC<Props> = ({
  message,
  mutationKey,
}) => {
  const [isMessageVisible, setIsMessageVisible] = React.useState(false);
  const mutations = useMutationState({ filters: { mutationKey, exact: true } });

  React.useEffect(() => {
    if (mutations[0]?.status === 'success') {
      setIsMessageVisible(true);
    }
  }, [mutations.length]);

  return isMessageVisible ? (
    <OsdsMessage
      color={ODS_THEME_COLOR_INTENT.success}
      type={ODS_MESSAGE_TYPE.success}
      removable
      onOdsRemoveClick={() => setIsMessageVisible(false)}
    >
      <OsdsText
        level={ODS_TEXT_LEVEL.body}
        size={ODS_TEXT_SIZE._400}
        color={ODS_THEME_COLOR_INTENT.text}
      >
        {message}
      </OsdsText>
    </OsdsMessage>
  ) : (
    <></>
  );
};

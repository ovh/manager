import { useEffect, useRef, useMemo } from 'react';
import { useMessageContext, MessageColor } from '@/context/Message.context';
import {
  UpdatingInfo,
  ChangedFieldInfo,
} from '@/hooks/updatedOperationStatus/updatedOperationStatus.types';

type UseListUpdatedOperationBannerParams = {
  updatingResources: UpdatingInfo[];
  completedResources: UpdatingInfo[];
  erroredResources: UpdatingInfo[];
  getUpdatingMessage: (updating: ChangedFieldInfo) => string | null;
  getCompletedMessage?: (completed: ChangedFieldInfo) => string | null;
  getErroredMessage?: (errored: ChangedFieldInfo) => string | null;
  updatingMessageType?: MessageColor;
  completedMessageType?: MessageColor;
  erroredMessageType?: MessageColor;
};

const flattenChangedFields = (items: UpdatingInfo[]): ChangedFieldInfo[] => {
  const map = new Map<string, ChangedFieldInfo>();

  items.forEach(({ id, changedFields }) => {
    if (changedFields.length === 0) {
      const key = `${id}:null`;
      if (!map.has(key)) map.set(key, { id, changedField: null });
    } else {
      changedFields.forEach((field) => {
        const key = `${id}:${field}`;
        if (!map.has(key)) map.set(key, { id, changedField: field });
      });
    }
  });

  return Array.from(map.values());
};

export const useListUpdatedOperationBanner = ({
  updatingResources,
  completedResources,
  erroredResources,
  getUpdatingMessage,
  getCompletedMessage,
  getErroredMessage,
  updatingMessageType = 'information',
  completedMessageType = 'success',
  erroredMessageType = 'danger',
}: UseListUpdatedOperationBannerParams): void => {
  const { addMessage, clearMessage } = useMessageContext();
  const updatingMsgUidsRef = useRef<Map<string, number>>(new Map());

  const hasCompletedResources = completedResources.length > 0;
  const hasErroredResources = erroredResources.length > 0;

  const updating = useMemo<ChangedFieldInfo[]>(
    () => flattenChangedFields(updatingResources),
    [updatingResources],
  );

  const completed = useMemo<ChangedFieldInfo[]>(
    () => flattenChangedFields(completedResources),
    [completedResources],
  );

  const errored = useMemo<ChangedFieldInfo[]>(
    () => flattenChangedFields(erroredResources),
    [erroredResources],
  );

  useEffect(() => {
    const currentKeys = new Set(
      updating.map((item) => `${item.id}:${item.changedField}`),
    );

    const shownMessages = new Set<string>();
    updating.forEach((item) => {
      const key = `${item.id}:${item.changedField}`;
      if (!updatingMsgUidsRef.current.has(key)) {
        const message = getUpdatingMessage(item);
        if (message && !shownMessages.has(message)) {
          shownMessages.add(message);
          const msgId = addMessage({
            type: updatingMessageType,
            content: message,
            isDismissible: false,
          });
          updatingMsgUidsRef.current.set(key, msgId);
        }
      }
    });

    // Clear banners for items that finished updating
    updatingMsgUidsRef.current.forEach((msgId, key) => {
      if (!currentKeys.has(key)) {
        clearMessage(msgId);
        updatingMsgUidsRef.current.delete(key);
      }
    });
  }, [updating]);

  useEffect(() => {
    if (hasCompletedResources && getCompletedMessage) {
      const shownMessages = new Set<string>();
      completed.forEach((item) => {
        const message = getCompletedMessage(item);
        if (message && !shownMessages.has(message)) {
          shownMessages.add(message);
          addMessage({
            type: completedMessageType,
            content: message,
            isDismissible: true,
          });
        }
      });
    }
  }, [hasCompletedResources, completed]);

  useEffect(() => {
    if (hasErroredResources && getErroredMessage) {
      const shownMessages = new Set<string>();
      errored.forEach((item) => {
        const message = getErroredMessage(item);
        if (message && !shownMessages.has(message)) {
          shownMessages.add(message);
          addMessage({
            type: erroredMessageType,
            content: message,
            isDismissible: true,
          });
        }
      });
    }
  }, [hasErroredResources, errored]);
};

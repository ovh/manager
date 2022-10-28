import React, { useRef } from 'react';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Skeleton,
  useDisclosure,
} from '@chakra-ui/react';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { MessageBoxMessage } from '@ovh-ux/manager-react-core-components';

import { deleteResourceGroup } from '@/api';
import useResourceGroup from '@/hooks/useResourceGroup';

export default function IamGroupDelete() {
  const { t } = useTranslation(['iam/groups/delete', 'common']);
  const { resourceGroupId } = useParams();
  const cancelRef = useRef();
  const queryClient = useQueryClient();
  const { resourceGroup, isResourceGroupLoading } = useResourceGroup(
    resourceGroupId,
  );
  const navigate = useNavigate();
  const disclosure = useDisclosure({
    isOpen: true,
    onClose: () => {
      navigate('../../');
    },
  });
  const { isOpen } = disclosure;
  let { onClose } = disclosure;

  const setOnClose = (actionResult: MessageBoxMessage) => {
    onClose = () => {
      navigate('../../', {
        state: (actionResult && { actionResult }) || null,
      });
    };
  };

  const onDeleteResourceGroupBtnClick = async () => {
    try {
      await deleteResourceGroup(resourceGroupId);
      queryClient.invalidateQueries(['iam_resource_group']);
      setOnClose({
        type: 'success',
        message: (
          <Trans
            t={t}
            i18nKey="group_delete_success"
            values={{ name: resourceGroup.name }}
          ></Trans>
        ),
      });
    } catch (error) {
      setOnClose({
        type: 'error',
        message: (
          <Trans
            t={t}
            i18nKey="group_delete_error"
            values={{ name: resourceGroup.name }}
          ></Trans>
        ),
        error,
      });
    } finally {
      onClose();
    }
  };

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader>{t('group_delete_title')}</AlertDialogHeader>

          <AlertDialogBody>
            <Skeleton isLoaded={!isResourceGroupLoading}>
              <Trans
                t={t}
                i18nKey="group_delete_confirm"
                values={resourceGroup}
              ></Trans>
            </Skeleton>
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button
              ref={cancelRef}
              onClick={onClose}
              variant="outline"
              size="lg"
            >
              {t('common:cancel')}
            </Button>
            <Button onClick={onDeleteResourceGroupBtnClick} ml={3} size="lg">
              {t('common:delete')}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}

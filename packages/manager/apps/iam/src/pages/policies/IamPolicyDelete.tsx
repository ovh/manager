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

import { deletePolicy } from '@/api/iam';
import usePolicy from '@/hooks/usePolicy';

export default function IamGroupDelete() {
  const { t } = useTranslation(['iam/policies/delete', 'common']);
  const { policyId } = useParams();
  const cancelRef = useRef();
  const queryClient = useQueryClient();
  const { policy, isPolicyLoading } = usePolicy(policyId);
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

  const onDeletePolicyBtnClick = async () => {
    try {
      await deletePolicy(policyId);
      queryClient.removeQueries(['iam_policy']);
      setOnClose({
        type: 'success',
        message: (
          <Trans
            t={t}
            i18nKey="policy_delete_success"
            values={{ name: policy.name }}
          ></Trans>
        ),
      });
    } catch (error) {
      setOnClose({
        type: 'error',
        message: (
          <Trans
            t={t}
            i18nKey="policy_delete_error"
            values={{ name: policy.name }}
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
          <AlertDialogHeader>{t('policy_delete_title')}</AlertDialogHeader>

          <AlertDialogBody>
            <Skeleton isLoaded={!isPolicyLoading}>
              <Trans
                t={t}
                i18nKey="policy_delete_confirm"
                values={policy}
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
            <Button onClick={onDeletePolicyBtnClick} ml={3} size="lg">
              {t('common:delete')}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}

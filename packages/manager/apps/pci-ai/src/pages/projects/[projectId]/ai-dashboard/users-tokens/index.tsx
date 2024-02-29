import { useRequiredParams } from '@/hooks/useRequiredParams';
import { useOutletContext } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { ArrowRight, Plus, RefreshCcw } from 'lucide-react';

import { H2, H3 } from '@/components/typography';

import { DashboardLayoutContext } from '../_layout';
import { ai, user } from '@/models/types';
import {
  TokenGenerationProps,
  TokenProps,
  UserCreationProps,
  aiApi,
} from '@/data/aiapi';
import TokensList, {
  RegenerateTokenSubmitData,
} from './_components/tokensListTable';
import AddUserModal, { AddUserSubmitData } from './_components/addUserModal';
import { Input } from '@/components/ui/input';
import AddTokenModal, { AddTokenSubmitData } from './_components/addTokenModal';
import { DeleteTokenSubmitData } from './_components/deleteTokenModal';
import AlertMessage, { Message } from '../../_components/alertMessage';
import { ovhUrl } from '@/components/ovhNavigation';

export const Handle = {
  breadcrumb: () => 'Users & Tokens',
};

export default function DashboardHomePage() {
  const { projectId } = useRequiredParams<{ projectId: string }>();
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isAddTokenModalOpen, setIsAddTokenModalOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const {
    usersQuery,
    tokensQuery,
    regionsQuery,
  } = useOutletContext() as DashboardLayoutContext;
  const activeUsers: number =
    usersQuery.data?.filter((user: user.User) =>
      user.roles.find(
        (role: user.Role) =>
          role.name === ai.TokenRoleEnum.ai_training_read ||
          role.name === ai.TokenRoleEnum.ai_training_operator,
      ),
    ).length || 0;

  const TokensRefetch = () => {
    tokensQuery.refetch();
  };
  const UsersRefetch = () => {
    usersQuery.refetch();
  };

  const onAddUserSubmit = (data: AddUserSubmitData) => {
    setIsAddUserModalOpen(false);
    addUserDataMutation.mutate({
      projectId: projectId,
      userInput: {
        description: data.description,
        role: data.userRole,
      },
    });
  };

  const addUserDataMutation = useMutation({
    mutationFn: (addUserParam: UserCreationProps) =>
      aiApi.addUser(addUserParam),
    onSuccess: (data: user.User) => {
      toast.success(`Your AI User have been succesfuly created`);
      UsersRefetch();
      setMessages([
        {
          type: 'success',
          title: 'User created',
          content: (
            <div>
              A new AI User has been created with the password{' '}
              <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                {data.password}
              </code>
            </div>
          ),
        },
        ...messages,
      ]);
    },
    onError: (error: Error) => {
      toast.error(
        `A error occured while creating your AI User: ${error.message}`,
      );
    },
  });

  const onAddTokenSubmit = (data: AddTokenSubmitData) => {
    setIsAddTokenModalOpen(false);
    addTokenDataMutation.mutate({
      projectId: projectId,
      tokenInput: {
        name: data.name,
        labelSelector: data.label,
        role: data.userRole,
        region: data.region,
      },
    });
  };

  const addTokenDataMutation = useMutation({
    mutationFn: (addTokenParam: TokenGenerationProps) =>
      aiApi.generateToken(addTokenParam),
    onSuccess: (data: ai.token.Token) => {
      toast.success(`Your AI Token have been succesfuly generated`);
      TokensRefetch();
      setMessages([
        {
          type: 'success',
          title: 'Token succesfuly generated',
          content: (
            <div>
              A new AI token has been generated with the password{' '}
              <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                {data.status.value}
              </code>
            </div>
          ),
        },
        ...messages,
      ]);
    },
    onError: (error: Error) => {
      toast.error(
        `A error occured while generating your AI Token: ${error.message}`,
      );
    },
  });

  const onDeleteTokenSubmit = (data: DeleteTokenSubmitData) => {
    deleteTokenDataMutation.mutate({
      projectId: projectId,
      tokenId: data.tokenId,
    });
  };

  const deleteTokenDataMutation = useMutation({
    mutationFn: (deleteTokenParam: TokenProps) =>
      aiApi.deleteToken(deleteTokenParam),
    onSuccess: () => {
      toast.success(`Your AI Token have been succesfuly deleted`);
      TokensRefetch();
    },
    onError: (error: Error) => {
      toast.error(
        `A error occured while deleting your AI Token: ${error.message}`,
      );
    },
  });

  const onRegenerateTokenSubmit = (data: RegenerateTokenSubmitData) => {
    regenerateTokenDataMutation.mutate({
      projectId: projectId,
      tokenId: data.tokenId,
    });
  };

  const regenerateTokenDataMutation = useMutation({
    mutationFn: (generateTokenParam: TokenProps) =>
      aiApi.regenerateToken(generateTokenParam),
    onSuccess: (data: ai.token.Token) => {
      toast.success(`Your AI Token have been succesfuly regenerated`);
      TokensRefetch();
      setMessages([
        {
          type: 'success',
          title: 'Token succesfuly regenerated',
          content: (
            <div>
              Your AI token has been regenerated with the password{' '}
              <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                {data.status.value}
              </code>
            </div>
          ),
        },
        ...messages,
      ]);
    },
    onError: (error: Error) => {
      toast.error(
        `A error occured while generating your AI Token: ${error.message}`,
      );
    },
  });

  const deleteMessages = () => {
    setMessages([]);
  };

  return (
    <>
      <AlertMessage messages={messages} deleteMessages={deleteMessages} />
      <H2>Authentication and secure access</H2>
      <p>
        Your data and business security is paramount. This is why you are
        required to provide additional authentication when using AI Tools.
      </p>
      <H3>Manage access with Public Cloud users</H3>
      <p>
        When you work with our tools, you need to authenticate yourself through
        common users in your Public Cloud project.
      </p>
      <p>
        Public Cloud users allow you to access your notebooks, jobs and
        applications. In order to freely experiment, you must choose at least an
        “Admin” or “AI” role.
      </p>
      <div className="flex flew-row gap-3 mt-3">
        <Button
          onClick={() => setIsAddUserModalOpen(true)}
          className="font-semibold"
          variant="outline"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create an AI user{isAddUserModalOpen}
        </Button>
        <AddUserModal
          open={isAddUserModalOpen}
          onClose={() => setIsAddUserModalOpen(false)}
          onSubmit={onAddUserSubmit}
        />
        <Button className="mb-4" variant="linkBis" size="sm" asChild>
          <a
            href={ovhUrl(
              'public-cloud',
              `#/pci/project/${projectId}/users`,
              {},
            )}
          >
            Manage my AI users ({activeUsers})
            <ArrowRight className="w-4 h-4 ml-2" />
          </a>
        </Button>
      </div>
      <H3>Manage access via application tokens</H3>
      <p>
        Tokens are used as unique authenticators. They allow you to access your
        notebooks, jobs and apps in a granular way, for example by selecting by
        label.
      </p>
      <p>Tokens are specific to each AI Tool.</p>
      <div className="flex justify-between w-100 mb-2 items-end">
        <Button
          onClick={() => setIsAddTokenModalOpen(true)}
          className="font-semibold"
          variant="outline"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create a token{isAddTokenModalOpen}
        </Button>
        {regionsQuery.data && (
          <AddTokenModal
            regionsList={regionsQuery.data}
            open={isAddTokenModalOpen}
            onClose={() => setIsAddTokenModalOpen(false)}
            onSubmit={onAddTokenSubmit}
          />
        )}
        <div className="flex">
          <Input
            type="text"
            id="search"
            placeholder="Search a token"
            className="mr-2"
          />
          <Button variant="outline" onClick={() => TokensRefetch()}>
            <RefreshCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <TokensList
        tokens={tokensQuery.data || []}
        onDeleteSubmit={onDeleteTokenSubmit}
        onRegenerateSubmit={onRegenerateTokenSubmit}
      />
    </>
  );
}

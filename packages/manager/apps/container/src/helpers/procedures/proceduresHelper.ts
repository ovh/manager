import { User } from "@ovh-ux/manager-config";
import { requiredStatusKey } from "@/components/identity-documents-modal/identityDocumentsModal.constants";

export const isUserConcernedWithIndiaProcedure = (user: User) => !user.kycValidated;

export const isIndiaProcedureToBeDone = (data: { status: string }, error?: Error) => !error && data?.status === requiredStatusKey;

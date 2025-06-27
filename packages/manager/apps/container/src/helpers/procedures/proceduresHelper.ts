import { User } from "@ovh-ux/manager-config";
import { requiredStatusKey } from "@/identity-documents-modal/IdentityDocumentsModal.constants";

export const isUserConcernedWithIndiaProcedure = (user: User) => !user.kycValidated;

export const isIndiaProcedureToBeDone = (data: { status: string }) => data?.status === requiredStatusKey;
import { Agreements } from "@/types/agreements";

export const hasPendingAgreements = (data: Agreements[], error?: Error) => !error && data?.length > 0;

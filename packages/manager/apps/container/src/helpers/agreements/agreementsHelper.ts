import { Agreements } from "@/types/agreements";

export const hasPendingAgreements = (data: Agreements[]) => data.length > 0;
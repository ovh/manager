import { Region } from "@/types/region.type";

export interface NoTenantsMessageProps {
    regions: Region[];
    defaultRetention: string;
}

import { RoundingMode } from "@/types/charts/roundModes";

export type FormatterConfig =
    | string
    | {
        type: string;
        precision?: number;
        roundingMode?: RoundingMode;
    };

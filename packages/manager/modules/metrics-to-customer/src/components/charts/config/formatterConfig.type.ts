import { RoundingMode } from "./roundModes";

export type FormatterConfig =
    | string
    | {
        type: string;
        precision?: number;
        roundingMode?: RoundingMode;
    };

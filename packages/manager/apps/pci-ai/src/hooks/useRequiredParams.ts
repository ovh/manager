import { useParams } from "react-router-dom";

export const useRequiredParams = <T extends Record<string, unknown>>() => useParams() as T;
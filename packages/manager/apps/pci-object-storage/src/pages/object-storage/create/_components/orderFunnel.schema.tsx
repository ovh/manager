import { z } from "zod";
import { ObjectContainerOffers } from "./orderFunnel.const";
import storages from "@/types/Storages";

const baseSchema = z.object({
    offer: z.nativeEnum(ObjectContainerOffers),
    name: z.string()
    .min(3, "Le nom doit contenir au moins 3 caractères")
    .max(63, "Le nom doit contenir au maximum 63 caractères")
    .regex(
      /^[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?$/,
      "Le nom doit commencer et se terminer par une lettre ou un chiffre, et ne peut contenir que des lettres minuscules, chiffres, '.' ou '-'"
    ),
    region: z.string().min(1, "Region is required"),
    user: z.number().optional(),
  });

  const replicationSchema = z.object({
    enabled: z.boolean(),
    automaticRegionSelection: z.boolean(),
    region: z.string().optional(),
  }).refine(
    (val) => {
      if (val.enabled && !val.automaticRegionSelection) {
        return !!val.region;
      }
      return true;
    },
    {
      message: "Region is required when automatic region selection is disabled",
    }
  );

  const s3Schema = baseSchema.extend({
    offer: z.literal(ObjectContainerOffers["s3-standard"]),
    encryption: z.enum(["enabled", "disabled"]).optional(),
    replication: replicationSchema,
    versioning: z.enum(["enabled", "disabled"]).optional(),
  });

  const swiftSchema = baseSchema.extend({
    offer: z.literal(ObjectContainerOffers.swift),
    archive: z.boolean().default(false),
    containerType: z.nativeEnum(storages.TypeEnum).optional(),
  });

  export const orderFunnelFormSchema = z.discriminatedUnion("offer", [
    s3Schema,
    swiftSchema,
  ]);
  export type OrderFunnelFormValues = z.infer<typeof orderFunnelFormSchema>;
  
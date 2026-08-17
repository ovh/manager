import { CartItemConfiguration, CartItemRequiredConfiguration } from '@/types/OrderCart.type';

export type CartConfigurationPlan = {
  configurations: CartItemConfiguration[];
  /** Labels réclamés qu'aucune valeur ne couvre : la commande partirait incomplète. */
  missingLabels: string[];
};

/**
 * Apparie les labels que le panier réclame aux valeurs du formulaire. Les noms de labels ne sont
 * pas figés côté catalogue : ce qui n'est pas réclamé n'est pas envoyé, et ce qui est réclamé sans
 * valeur est remonté à l'appelant plutôt que posté vide.
 */
export const planCartConfigurations = (
  requirements: CartItemRequiredConfiguration[] | undefined,
  values: Record<string, string | undefined>,
): CartConfigurationPlan =>
  (requirements ?? []).reduce<CartConfigurationPlan>(
    (plan, { label, required }) => {
      const value = values[label];

      if (value) plan.configurations.push({ label, value });
      else if (required) plan.missingLabels.push(label);

      return plan;
    },
    { configurations: [], missingLabels: [] },
  );

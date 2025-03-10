import { useTranslation } from 'react-i18next';

import RadioTile from '@/components/radio-tile/RAdioTile.component';

const plans = [
  {
    disabled: false,
    getFooter: () => 'Gratuit',
    getTitle: () => 'Plan Standard',
    getDescription: () =>
      "Bénéficiez de coûts optimisés pour vos ressources de calculs associés à la simplicité opérationnelle d'une solution Kubernetes managé gratuite à vie.",
    getContent: () =>
      "Bénéficiez de coûts optimisés pour vos ressources de calculs associés à la simplicité opérationnelle d'une solution Kubernetes managé gratuite à vie.",
    footer: 'Plan Standard',
    value: 'standard',
  },
  {
    disabled: true,
    getTitle: () => 'Plan Premium',
    getDescription: () =>
      "Bénéficiez d'un engagement de niveau de service et de déploiement multizones, idéal pour vos charges de travail exigent résilience et haute disponibilité.",
    getContent: () => 'Plan Premium',
    footer: 'Plan Premium',
    value: 'premium',
  },
];

export const PlanTile = ({
  selected,
  onChange,
}: {
  plan: Plan;
  selected: boolean;
  onChange: (newPlan: string) => void;
  showMonthlyPrice: boolean;
}) => {
  const { t } = useTranslation('pci-databases-analytics/components/plan');

  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
      <p className="text-primary-300">Hello</p>
      {plans.map((plan) => (
        <RadioTile
          key={plan.value}
          data-testid="plan-tile-radio-tile"
          name="plan-select"
          onChange={() => onChange(plan.value)}
          value={plan.value}
          checked={selected}
        >
          <div className="flex flex-col justify-between h-full">
            <div>
              <div className="flex justify-between w-full">
                <h5
                  className={`capitalize ${
                    selected ? 'font-bold' : 'font-normal'
                  }`}
                >
                  {plan.getTitle()}
                </h5>
              </div>
            </div>
            <div className="text-xs flex flex-col">{plan.getDescription()}</div>
            {plan.getFooter?.() && (
              <div>
                <RadioTile.Separator />
                <p className="text-sm">
                  <span data-testid="plan-tile-price">{plan.getFooter()}</span>
                </p>
              </div>
            )}
          </div>
        </RadioTile>
      ))}
    </div>
  );
};

export default PlanTile;

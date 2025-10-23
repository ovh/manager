import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Badge,
  Checkbox,
  CheckboxControl,
  CheckboxLabel,
  Icon,
  ICON_NAME,
  Radio,
  RadioControl,
  RadioGroup,
  RadioLabel,
  Text,
} from '@ovhcloud/ods-react';
import { PciCard } from '@/components/pciCard/PciCard.component';

export const PciCardShowcaseComponent = () => {
  return (
    <Accordion className="mb-4 mt-10">
      <AccordionItem value="0">
        <AccordionTrigger>
          <Text preset={'heading-3'}>Cards Showcase</Text>
        </AccordionTrigger>
        <AccordionContent>
          <section className="mt-10">
            <section className="flex flew-row items-start justify-start gap-4 mb-4">
              <PciCard disabled>
                <PciCard.Header>
                  <RadioGroup>
                    <Radio value="html" disabled>
                      <RadioControl />
                      <RadioLabel className="font-bold text-lg text-[--ods-color-heading]">
                        Custom
                      </RadioLabel>
                    </Radio>
                  </RadioGroup>
                  <Badge>
                    Coming soon <Icon name={ICON_NAME.circleInfo} />
                  </Badge>
                </PciCard.Header>

                <PciCard.Content>
                  <Text>
                    Choose the scheduling yourself (in UNIX Cron format), the
                    number of rotations, and the maximum executions you want.
                  </Text>
                </PciCard.Content>
              </PciCard>

              <PciCard selectable>
                <PciCard.Header>
                  <RadioGroup>
                    <Radio value="html">
                      <RadioControl />
                      <RadioLabel className="font-bold text-lg text-[--ods-color-heading]">
                        Rotation 14
                      </RadioLabel>
                    </Radio>
                  </RadioGroup>
                </PciCard.Header>

                <PciCard.Content>
                  <Text>
                    A backup is taken every day between 22:00 and 06:00, and the
                    roration maintains a log of the 14 latest entries. When the
                    new backup is taken, the previous one is deleted.
                  </Text>
                </PciCard.Content>
              </PciCard>
            </section>

            <section className="flex flew-row items-start justify-start gap-4 mb-4">
              <PciCard selectable>
                <PciCard.Header>
                  <RadioGroup>
                    <Radio value="html">
                      <RadioControl />
                      <RadioLabel className="font-bold text-lg text-[--ods-color-heading]">
                        High-speed
                      </RadioLabel>
                    </Radio>
                  </RadioGroup>
                  <Badge color="success" size={'sm'}>
                    {' '}
                    <Icon name="lock-close" />
                    Chiffrement disponible
                  </Badge>
                </PciCard.Header>

                <PciCard.Content>
                  <Text>
                    {
                      "Données localisées dans 1 zone de disponibilité. Jusqu'à 3000 IOPS, 4 To max."
                    }
                  </Text>
                </PciCard.Content>

                <PciCard.Footer>
                  <div>
                    <Text className="text-sm font-bold">À partir de</Text>
                    <div className="flex items-baseline gap-2">
                      <Text className="font-bold text-xl text-[--ods-color-information-500]">
                        24,46 €
                      </Text>
                      <Text preset="caption">HT/Go/heure</Text>
                    </div>
                    <Text preset="caption">soit XXX,XX€ TTC/mois</Text>
                  </div>
                </PciCard.Footer>
              </PciCard>
              <PciCard selectable>
                <PciCard.Header>
                  <Checkbox>
                    <CheckboxControl />
                    <CheckboxLabel className="font-bold text-lg text-[--ods-color-heading]">
                      Région 3-AZ
                    </CheckboxLabel>
                  </Checkbox>
                  <Badge className="bg-[--ods-color-information-700] text-[--ods-color-information-000]">
                    3-AZ
                  </Badge>
                </PciCard.Header>

                <PciCard.Content className="justify-between">
                  <Text>
                    Déploiement haute résilience / haute disponibilité pour vos
                    applications critiques sur 3 zones de disponibilité.
                  </Text>
                  <div className="bg-[--ods-color-neutral-100] w-full h-[100px] mt-6" />
                </PciCard.Content>
              </PciCard>
            </section>

            <section className="flex flew-row items-start justify-start gap-4 mb-4">
              <PciCard selectable compact>
                <PciCard.Header>
                  <RadioGroup>
                    <Radio value="html">
                      <RadioControl />
                      <RadioLabel className="font-bold text-lg text-[--ods-color-heading]">
                        <Icon name="columns" /> Paris
                      </RadioLabel>
                    </Radio>
                  </RadioGroup>
                  <div className="flex flex-row items-center justify-between gap-4">
                    <Text>eu-wes-par</Text>
                    <Badge className="bg-[--ods-color-information-700] text-[--ods-color-information-000]">
                      3-AZ
                    </Badge>
                  </div>
                </PciCard.Header>
              </PciCard>
              <PciCard compact>
                <PciCard.Content>
                  <Text>eu-west-par-a</Text>
                </PciCard.Content>
              </PciCard>
              <PciCard selectable compact>
                <PciCard.Header>
                  <RadioGroup>
                    <Radio value="html">
                      <RadioControl />
                      <RadioLabel className="font-bold text-lg text-[--ods-color-heading]">
                        Linux
                      </RadioLabel>
                    </Radio>
                  </RadioGroup>
                </PciCard.Header>
              </PciCard>
            </section>

            <section className="flex flew-row items-start justify-start gap-4 mb-4">
              <PciCard selectable compact>
                <PciCard.Header>
                  <RadioGroup>
                    <Radio value="html">
                      <RadioControl />
                      <RadioLabel>
                        <Text className="font-bold text-lg text-[--ods-color-heading]">
                          <Icon name="grid-alt" /> Windows Server 2019 Standard
                          (Desktop)
                        </Text>
                        <Text className="text-sm font-medium text-[--ods-color-success-500]">
                          + 0,0347 € HT/vCore/heure
                        </Text>
                      </RadioLabel>
                    </Radio>
                  </RadioGroup>
                </PciCard.Header>
              </PciCard>
            </section>
            <section className="flex flew-row items-start gap-4 mb-4">
              <PciCard compact>
                <PciCard.Content>
                  <div className="flex flex-row gap-4">
                    <div className="basis-3/4">
                      <div className="flex flex-col justify-between gap-6">
                        <div className="flex flex-col">
                          <Text className="font-medium text-[--ods-color-heading]">
                            Hourly
                          </Text>
                          <Text preset="caption">
                            Pay as you go, with costs vased on actual usage time
                          </Text>
                        </div>
                        <div className="flex flex-col">
                          <Text className="text-xs font-semibold">
                            Prix instance: 0,00€
                          </Text>
                          <Text className="text-xs font-semibold">
                            Prix licence: 0,00€
                          </Text>
                        </div>
                      </div>
                    </div>
                    <div className="basis-1/4">
                      <div className="flex flex-col items-end justify-center h-full">
                        <Text className="font-bold text-[--ods-color-heading]">
                          XX,XX €
                        </Text>
                        <Text preset="caption">HT/heure</Text>
                      </div>
                    </div>
                  </div>
                </PciCard.Content>
              </PciCard>
            </section>
          </section>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

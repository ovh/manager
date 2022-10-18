import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Heading,
  Text,
  Box,
  SimpleGrid,
  Link,
  Button,
  VStack,
} from '@chakra-ui/react';

export type Guide = {
  title: string;
  link: string;
  category?: string;
};
type OnboardingProps = {
  title: string;
  description: string;
  cta: string;
  guides: Guide[];
};

export default function Onboarding({
  title,
  description,
  cta,
  guides,
}: OnboardingProps): JSX.Element {
  const { t } = useTranslation('onboarding');
  return (
    <div>
      <VStack>
        <Heading>{title}</Heading>
        <Text>{description}</Text>
        <Button as={Link} href={cta}>
          {t('Commander')}
        </Button>
      </VStack>
      <SimpleGrid columns={3} spacing={10}>
        {guides.map((guide) => (
          <Box as={Link} href={guide.link} isExternal key={guide.link}>
            <Heading>{guide.category || t('Tutoriel')}</Heading>
            <Heading>{guide.title}</Heading>
            <Link as="p">{t('En savoir plus')}</Link>
          </Box>
        ))}
      </SimpleGrid>
    </div>
  );
}

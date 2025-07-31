# Utilitaires de Test - PCI Project App

Ce dossier contient tous les utilitaires et helpers nécessaires pour les tests de l'application PCI Project.

## 📁 Structure du Dossier

```
test-utils/
├── README.md                    # Ce fichier de documentation
├── index.ts                     # Utilitaires de test principaux
└── test-wrappers.tsx           # Wrappers React pour les tests
```

## 🛠️ Fichiers et Leurs Rôles

### `index.ts` - Utilitaires de Test Principaux
Contient tous les helpers et utilitaires pour les tests :
- **Données de test** : Mocks centralisés pour projets, utilisateurs, etc.
- **Helpers de mock** : Fonctions pour créer des mocks avec overrides
- **Helpers de rendu** : Fonctions spécialisées pour différents types de tests
- **Helpers d'assertion** : Assertions expressives et réutilisables
- **Helpers d'interaction** : Fonctions pour simuler les interactions utilisateur
- **Helpers de performance** : Mesure et validation des performances
- **Helpers d'accessibilité** : Tests d'accessibilité et d'internationalisation

### `test-wrappers.tsx` - Wrappers React pour Tests
Contient les wrappers React spécialisés pour les tests :
- **createTestWrapper** : Wrapper principal pour les tests de composants
- **createPageTestWrapper** : Wrapper pour les tests de pages avec navigation
- **createHookTestWrapper** : Wrapper pour les tests de hooks
- **createErrorBoundaryTestWrapper** : Wrapper pour les tests d'erreurs
- **testWrapperUtils** : Utilitaires pour les wrappers

## 🚀 Utilisation

### Import des Utilitaires
```typescript
import {
  renderWithProviders,
  assertElementExists,
  assertTextContent,
  MOCKED_PROJECT,
  createMockUseResourcesV6,
} from '@/test-utils';
```

### Import des Wrappers
```typescript
import { 
  createTestWrapper, 
  createPageTestWrapper,
  shellContext 
} from '@/test-utils/test-wrappers';
```

### Exemple d'Utilisation
```typescript
import { renderWithProviders, assertElementExists } from '@/test-utils';

describe('Mon Composant', () => {
  it('should render correctly', () => {
    renderWithProviders(<MonComposant />);
    assertElementExists('mon-composant');
  });
});
```

## 📋 Bonnes Pratiques

### 1. Utilisation des Helpers
- **Préférer les helpers** aux assertions manuelles
- **Utiliser les mocks centralisés** plutôt que de créer des mocks locaux
- **Lever les helpers** pour les cas d'usage spécifiques

### 2. Organisation des Tests
- **Grouper les tests** par fonctionnalité
- **Utiliser des descriptions claires** pour les tests
- **Structurer les tests** avec des `describe` imbriqués

### 3. Performance
- **Mesurer les performances** des composants critiques
- **Utiliser les tests de performance** pour détecter les régressions
- **Optimiser les mocks** pour des tests rapides

### 4. Accessibilité
- **Tester les ARIA labels** et la navigation clavier
- **Valider la structure sémantique** des composants
- **Tester l'internationalisation** et les traductions

## 🔄 Migration

### Ancien Import (Déprécié)
```typescript
import { createWrapper } from '@/wrapperRenders';
```

### Nouvel Import (Recommandé)
```typescript
import { createTestWrapper } from '@/test-utils/test-wrappers';
```

### Exports de Compatibilité
Les anciens exports sont encore disponibles mais marqués comme dépréciés :
- `createWrapper` → `createTestWrapper`
- `createPageWrapper` → `createPageTestWrapper`
- `createHookWrapper` → `createHookTestWrapper`

## 📚 Ressources

- [Guide des Tests PCI Volume Backup](../../../.cursor/testing-guidelines-pci-volume-backup.md)
- [Documentation Vitest](https://vitest.dev/)
- [Testing Library React](https://testing-library.com/docs/react-testing-library/intro/)
- [OVH Design System](https://ovh.github.io/design-system/)

## 🤝 Contribution

Lors de l'ajout de nouveaux utilitaires :
1. **Documenter** leur usage dans ce README
2. **Ajouter des exemples** d'utilisation
3. **Tester** les nouveaux helpers
4. **Maintenir la cohérence** avec les patterns existants 

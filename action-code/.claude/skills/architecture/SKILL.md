---
description: "Architecture hexagonale et patterns pour les micro-apps React OVHcloud Manager"
---

# Skill : Architecture Hexagonale (Ports & Adapters)

## Principe

L'architecture hexagonale sépare la logique métier (domaine) des détails techniques (adaptateurs) via des ports (interfaces) comme contrats.

## Structure de référence

```
src/
├── domain/              # Couche domaine (logique métier pure)
│   ├── entities/        # Entités métier
│   └── port/            # Ports (interfaces)
├── adapters/            # Adaptateurs (implémentations des ports)
│   └── tanstack/        # Adaptateurs React Query
│       ├── left/        # Ports entrants (driving adapters)
│       └── right/       # Ports sortants (driven adapters)
├── data/                # Couche données
│   ├── api/             # Appels API bruts
│   └── hooks/           # Hooks React Query
├── pages/               # Pages de l'application
├── components/          # Composants réutilisables
├── routes/              # Configuration du routage
└── hooks/               # Hooks métier/utilitaires
```

## Couche Domain

### Entités (`domain/entities/`)

Concepts métier purs, indépendants de toute technologie :

```typescript
// domain/entities/instance.ts
export type TInstanceCreationData = {
  operationId: string | null;
  status: TOperationStatus;
};
```

### Ports (`domain/port/`)

Interfaces sans implémentation :

**Ports sortants (right)** : Accès aux données externes
```typescript
// domain/port/instance/port.ts
export type TInstancePort = {
  createInstance: ({
    projectId,
    regionName,
    instance,
  }: TCreateInstanceArgs) => Promise<TInstanceCreationData>;
};
```

**Ports entrants (left)** : Utilisation du domaine par l'extérieur
```typescript
// domain/port/configuration/left/port.ts
export type TConfigurationPort = {
  selectConfiguration: (projectId: string) => TConfiguration | undefined;
};
```

## Couche Adapters

### Adaptateurs sortants (right) - Driven Adapters

Connectent le domaine aux sources de données externes :

```typescript
// adapters/tanstack/instances/right/instanceAdapter.ts
export const instanceAdapter: TInstancePort = {
  createInstance: async ({ projectId, regionName, instance }) => {
    const response = await v6.post(...);
    return mapDtoToInstanceCreationData(response.data);
  },
};
```

**Flux de données** :
```
Page/Component → Hook React Query → Adapter right → API call → Mapper (DTO → Entity) → Retour
```

### Adaptateurs entrants (left) - Driving Adapters

Permettent l'accès au domaine depuis l'extérieur :

```typescript
// adapters/tanstack/instancesCatalog/left/instancesCatalogAdapter.ts
export const instancesCatalogAdapter: TInstancesCatalogPort = {
  selectInstancesCatalog: (projectId: string) =>
    queryClient.getQueryData<TInstancesCatalog>(
      instancesCatalogQueryKey(projectId),
    ),
};
```

### Injection de dépendances

Centraliser dans `deps/deps.ts` :

```typescript
export const deps: Deps = {
  instancesCatalogPort: instancesCatalogAdapter,
  configurationPort: configurationAdapter,
  instancePort: instanceAdapter,
};
```

## Gestion des données (React Query)

### Hooks de lecture

```typescript
// useInstances, useInstance, useInstancesCatalog
// Utilisent useQuery ou useInfiniteQuery
// Appellent data/api/ directement
// Appliquent des sélecteurs pour transformer
```

### Hooks de mutation

```typescript
// useInstanceAction, useCreateInstance
// Utilisent useMutation
// Appellent les adaptateurs right via les ports
```

### Transformation des données

| Couche | Fichier | Rôle |
|--------|---------|------|
| DTO | `adapters/*/right/dto.type.ts` | Structure brute API |
| Mapper | `adapters/*/right/mapper.ts` | DTO → Entity |
| Selector | `adapters/*/selectors.ts` | Transformation affichage |

## Flux de données

### Lecture
```
Component → useInstances() → getInstances() → API HTTP → Mapper → Cache → Component
```

### Création
```
Component → useCreateInstance() → instanceAdapter.createInstance() → API HTTP → Mapper → Invalidation → Component
```

## Routage

### Configuration (`routes/`)

- `routes.tsx` : Définition avec lazy loading
- `Router.tsx` : Configuration React Router
- `loaders/` : Data loaders pour préchargement

```typescript
export const ROOT_PATH = '/pci/projects/:projectId/instances';
export const REGION_PATH = 'region/:region';
export const INSTANCE_PATH = 'instance/:instanceId';
```

## View Models (`pages/*/view-models/`)

Fonctions de transformation pour l'affichage :

```typescript
// Sépare logique de présentation de la logique métier
export const selectInstanceDashboard = (instance: TInstance) => ({ ... });
export const cartViewModel = (cart: TCart) => ({ ... });
```

## Stack technique

| Technologie | Usage |
|-------------|-------|
| React 18 | Framework UI |
| React Router 6 | Routage |
| TanStack Query | État serveur |
| TypeScript | Typage |
| Vite | Build |
| Tailwind CSS | Styling |
| ODS | Design System OVHcloud |
| React Hook Form + Zod | Formulaires |

## Patterns obligatoires

1. **Hexagonal Architecture** : Ports & Adapters
2. **Repository Pattern** : Via adaptateurs right
3. **Dependency Injection** : Via `deps/deps.ts`
4. **Data Mapper** : Transformation DTO ↔ Entity
5. **Selector Pattern** : Transformation affichage
6. **Lazy Loading** : Routes et composants
7. **Query Keys** : Organisation cache React Query

## Checklist d'implémentation

```
□ Entité créée dans domain/entities/
□ Port défini dans domain/port/
□ Adaptateur implémenté dans adapters/
□ DTO typé dans adapters/*/dto.type.ts
□ Mapper créé dans adapters/*/mapper.ts
□ Hook React Query dans data/hooks/
□ Selector si transformation affichage
□ Injection dans deps/deps.ts
```

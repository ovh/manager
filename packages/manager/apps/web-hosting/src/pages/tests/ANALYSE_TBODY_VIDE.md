# Analyse approfondie : Problème du tbody vide dans test.page.spec.tsx

## Problème identifié
Le `<tbody>` du datagrid reste vide dans les tests, même avec tous les mocks en place.

## Architecture du Datagrid

### Flux de données
1. **Datagrid.component.tsx** reçoit `data` et `columns` en props
2. **useDatagrid** hook utilise `useReactTable` de `@tanstack/react-table` pour créer la table
3. `getRowModel()` retourne un `rowModel` qui contient `rows` (lignes de la table)
4. **TableBody.component.tsx** utilise `useVirtualizer` de `@tanstack/react-virtual`
5. `rowVirtualizer.getVirtualItems()` retourne les items virtuels à afficher
6. Pour chaque `virtualRow`, il cherche `rows[virtualRow.index]` et rend un `<tr>`

### Points critiques dans TableBody.component.tsx (ligne 77-79)
```typescript
{rowVirtualizer.getVirtualItems().map((virtualRow) => {
  const row = rows[virtualRow?.index];
  if (!row) return null;  // ← Si row est undefined, rien n'est rendu
  // ... render <tr>
})}
```

## Causes possibles

### 1. `rows` est vide
- **Cause**: `useReactTable` ne crée pas les rows correctement
- **Vérification**: `rowModel.rows.length === 0`
- **Solution**: Vérifier que `data` et `columns` sont correctement passés à `useDatagrid`

### 2. `getVirtualItems()` retourne un tableau vide
- **Cause**: Le mock de `@tanstack/react-virtual` ne fonctionne pas
- **Vérification**: `rowVirtualizer.getVirtualItems().length === 0`
- **Solution**: Corriger le mock pour retourner tous les items

### 3. `rows[virtualRow.index]` est undefined
- **Cause**: Les indices ne correspondent pas entre `rows` et `virtualItems`
- **Vérification**: Comparer `rows.length` vs `getVirtualItems().length`
- **Solution**: S'assurer que le mock retourne le bon nombre d'items

## Comparaison avec Datagrid.spec.tsx (qui fonctionne)

### Différences clés

1. **Mock de useAuthorizationIam**
   - **Datagrid.spec.tsx**: `vi.mock('@/hooks/iam/useOvhIam')` (chemin relatif dans le package)
   - **test.page.spec.tsx**: `vi.mock('@ovh-ux/muk')` (package exporté)
   - **Impact**: Le mock pourrait ne pas être appliqué au bon endroit

2. **Wrapper de test**
   - **Datagrid.spec.tsx**: Utilise `renderDataGrid` de `Render.utils.tsx` qui inclut:
     - `QueryClientProvider`
     - `I18nextProvider`
     - `ShellContext.Provider` (optionnel)
   - **test.page.spec.tsx**: Wrapper personnalisé avec les mêmes providers
   - **Impact**: Probablement pas le problème principal

3. **Mock de @tanstack/react-virtual**
   - **Datagrid.spec.tsx**: Mock simple qui retourne tous les items
   - **test.page.spec.tsx**: Même approche
   - **Impact**: Le mock semble correct

## Solutions testées

### ✅ Solution 1: Ajout de I18nextProvider
- **Status**: Implémenté
- **Résultat**: Le test s'exécute sans erreur de mock, mais tbody toujours vide

### ✅ Solution 2: Mock de useAuthorizationIam
- **Status**: Implémenté
- **Résultat**: Pas d'erreur, mais tbody toujours vide

### ✅ Solution 3: Mock de @tanstack/react-virtual
- **Status**: Implémenté
- **Résultat**: Le mock retourne bien les items, mais tbody toujours vide

## Hypothèses restantes

### Hypothèse 1: `rows` est réellement vide
Le problème pourrait être que `useReactTable` ne crée pas les rows à cause de:
- Problème avec les `columns` (format incorrect)
- Problème avec les `data` (format incorrect)
- Problème avec `getRowId` dans le builder

### Hypothèse 2: Le mock de useVirtualizer n'est pas utilisé
Le vrai `useVirtualizer` pourrait être appelé au lieu du mock, ce qui expliquerait pourquoi aucun item n'est retourné dans l'environnement de test.

### Hypothèse 3: Problème de timing
Les rows pourraient être créées de manière asynchrone, et le test vérifie avant qu'elles ne soient prêtes.

## Prochaines étapes de debug

1. **Ajouter des logs de debug** dans le test pour vérifier:
   - `rows.length`
   - `getVirtualItems().length`
   - Contenu de `rows[0]` si existe

2. **Vérifier le DOM réellement rendu** avec `container.innerHTML` ou `screen.debug()`

3. **Comparer le setup exact** entre `Datagrid.spec.tsx` et `test.page.spec.tsx` ligne par ligne

4. **Tester avec `waitFor`** pour voir si c'est un problème de timing

5. **Vérifier si `useReactTable` fonctionne** en testant directement `getRowModel()` dans le test

## Commandes utiles

```bash
# Exécuter le test avec plus de détails
cd packages/manager/apps/web-hosting
npx vitest run src/pages/tests/test.page.spec.tsx --reporter=verbose

# Exécuter en mode watch pour debug
npx vitest watch src/pages/tests/test.page.spec.tsx
```


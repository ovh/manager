# 📊 Explication du composant `transformChart`

Cette fonction **`transformChart`** prend en entrée des données de consommation (`SavingsPlanConsumption`) et les transforme en un format utilisable pour un graphique, en regroupant les consommations par jour.

---

## 🌜 Détails du Code

### 📌 Imports et définition
```tsx
export const transformChart = (apiData: SavingsPlanConsumption) => {
  console.log('data:', apiData);
```
- **Fonction `transformChart`** : Transforme les données de consommation pour un affichage graphique.
- **`console.log('data:', apiData);`** : Permet de déboguer et voir les données en entrée.

---

### 📌 Extraction des périodes
```tsx
  const periods = apiData.flavors.flatMap((flavor) => flavor.periods);
```
- **Récupère toutes les périodes** depuis chaque `flavor` et les met dans un seul tableau.

---

### 📌 Création de la structure de stockage
```tsx
  const daysMap = new Map();
```
- **Initialise une Map** pour stocker les consommations agrégées par jour.

---

### 📌 Fonction `addConsumptionToDay`
```tsx
  const addConsumptionToDay = (day: number, inclus: number, exclus: number) => {
    if (!daysMap.has(day)) {
      daysMap.set(day, { day, inclus: 0, exclus: 0 });
    }

    const currentData = daysMap.get(day);
    daysMap.set(day, {
      day,
      inclus: currentData.inclus + inclus,
      exclus: currentData.exclus + exclus,
    });
  };
```
- **Vérifie si le jour existe dans `daysMap`**, sinon il est initialisé.
- **Ajoute les consommations `inclus` et `exclus`** à la valeur existante.

---

### 📌 Traitement des périodes
```tsx
  periods.forEach(
    ({
      begin,
      end,
      consumption_size: consumptionSize,
      cumul_plan_size: cumulPlanSize,
    }) => {
```
- **Déstructure les valeurs** pour une meilleure lisibilité.
- **Convertit les dates `begin` et `end` en objets `Date`**.

```tsx
      const startDate = new Date(begin);
      const endDate = new Date(end);
      const inclus = Math.min(consumptionSize, cumulPlanSize);
      const exclus = consumptionSize - inclus;
```
- **Calcule la consommation incluse (`inclus`) et exclue (`exclus`)**.

```tsx
      while (startDate <= endDate) {
        addConsumptionToDay(startDate.getDate(), inclus, exclus);
        startDate.setDate(startDate.getDate() + 1);
      }
    },
  );
```
- **Itère sur chaque jour entre `begin` et `end`**.
- **Ajoute les consommations pour chaque jour** avec `addConsumptionToDay`.

---

### 📌 Conversion en tableau
```tsx
  return Array.from(daysMap.values());
};
```
- **Convertit `daysMap` en tableau** pour pouvoir être utilisé dans un graphique.

---

## 🎯 Résumé
✅ **Regroupe les consommations journalières** à partir des périodes.
✅ **Utilise une `Map` pour stocker efficacement les valeurs**.
✅ **Gère les données de manière optimisée avant affichage**.

Cette fonction est idéale pour **préparer les données de consommation en vue d'un affichage graphique clair et précis** ! 🚀


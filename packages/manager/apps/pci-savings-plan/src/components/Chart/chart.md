# 📊 Explication du composant `GenericChart`

Ce composant React utilise **Recharts** pour afficher un **graphique en aires empilées** représentant la consommation **incluse** et **exclue** des Savings Plans en fonction des jours. Il intègre aussi une **ligne de référence** pour indiquer un seuil (`savingsPlanSize`).

---

## 🌜 Détails du Code
### 📌 Imports
```tsx
import React, { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from 'recharts';
```
- **React, useMemo** : Import de React et `useMemo` (même si non utilisé ici).
- **Recharts** : Import des composants nécessaires pour afficher un **AreaChart**.

---

### 📌 Interface des props
```tsx
interface ChartProps {
  chartData: { day: string; inclus: number; exclus: number }[];
  maxRange: number;
  savingsPlanSize: number;
  serviceFilter: 'Instances' | 'Managed Rancher Services';
}
```
- **`chartData`** : Tableau contenant les données de consommation par jour.
- **`maxRange`** : Valeur maximale de l'axe Y.
- **`savingsPlanSize`** : Seuil à afficher en ligne de référence.
- **`serviceFilter`** : Filtre indiquant si on parle d'instances ou de vCPU.

---

### 📌 Définition du composant
```tsx
const GenericChart: React.FC<ChartProps> = ({
  chartData,
  maxRange,
  savingsPlanSize,
  serviceFilter,
}) => {
```
- Définition du composant **React** prenant en entrée les **props définies**.

---

### 📌 Label dynamique pour l'axe Y
```tsx
const yAxisLabel =
  serviceFilter === 'Instances'
    ? "Nombre d'instance(s)"
    : 'Nombre de vCPU(s)';
```
- **Condition ternaire** :  
  - Si `serviceFilter` = `'Instances'` → Y-axis = **"Nombre d'instance(s)"**  
  - Sinon → **"Nombre de vCPU(s)"**

---

### 📌 Container du graphique
```tsx
<ResponsiveContainer width="100%" height={400} className="ods-font">
```
- **`ResponsiveContainer`** : Garantit une adaptation à la largeur disponible.
- **`height={400}`** : Hauteur fixe de **400 pixels**.
- **`className="ods-font"`** : (Potentiellement pour du style Tailwind ou CSS).

---

### 📌 Création du graphique `AreaChart`
```tsx
<AreaChart
  data={chartData}
  margin={{
    top: 20,
    right: 30,
    left: 20,
    bottom: 30,
  }}
>
```
- **`data={chartData}`** : Associe les données du graphique.
- **`margin`** : Définit les marges autour du graphique.

---

### 📌 Ajout de la grille de fond
```tsx
<CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
```
- **Ajoute une grille** en fond pour améliorer la lisibilité.

---

### 📌 Axe X (jours)
```tsx
<XAxis
  dataKey="day"
  label={{ value: 'Jour', position: 'insideBottom', offset: -10 }}
  tick={{ fontSize: 12 }}
/>
```
- **`dataKey="day"`** : Utilise la valeur **`day`** comme clé pour l'axe X.
- **Ajoute un label "Jour"** en bas de l'axe.
- **Taille de la police des ticks :** 12px.

---

### 📌 Axe Y (consommation)
```tsx
<YAxis
  domain={[0, maxRange]}
  label={{
    value: yAxisLabel,
    angle: -90,
    position: 'insideLeft',
    offset: -10,
  }}
  tickFormatter={(value) => value.toFixed(0)}
  tick={{ fontSize: 12 }}
/>
```
- **Affichage de l'axe Y** avec un label dynamique en fonction de `serviceFilter`.
- **Valeurs arrondies** pour plus de clarté.

---

### 📌 Zones d'aires empilées
```tsx
<Area
  type="step"
  dataKey="inclus"
  stackId="1"
  stroke="#008000"
  fill="rgba(0, 128, 0, 0.6)"
  name="Inclus dans les Savings Plans"
/>
<Area
  type="step"
  dataKey="exclus"
  stackId="1"
  stroke="#FFC0CB"
  fill="rgba(255, 192, 203, 0.6)"
  name="Exclus des Savings Plans"
/>
```
- **Affiche deux zones empilées** (`stackId="1"`) :
  - **`dataKey="inclus"`** → **Vert** ✅
  - **`dataKey="exclus"`** → **Rose** ❌
- **Type `"step"`** : Forme en escalier pour une lecture plus claire.

---

### 📌 Ligne de référence (`savingsPlanSize`)
```tsx
<ReferenceLine
  y={savingsPlanSize}
  stroke="red"
  strokeWidth={2}
  label={{
    position: 'right',
    value: `${savingsPlanSize} ${serviceFilter === 'Instances' ? 'instance(s)' : 'vCPU(s)'}`,
    className: 'font-bold text-xs text-red-500',
    offset: 10,
  }}
/>
```
- Ajoute une **ligne horizontale rouge** au niveau `savingsPlanSize` pour montrer le **seuil à ne pas dépasser**.

---

## 🎯 Résumé
✅ **Graphique en aires empilées** pour comparer consommation incluse/exclue.  
✅ **Axes X (jours) et Y (consommation) dynamiques**.  
✅ **Ligne de référence** pour montrer la **limite des Savings Plans**.  
✅ **Légende et info-bulle pour meilleure lisibilité**.  




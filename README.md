# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

---

## 🧠 Algorithme de sélection et d'adaptation des questions

Ce projet utilise un système de **questionnaire adaptatif** pour évaluer les compétences de l'utilisateur de manière personnalisée. Voici une explication détaillée du fonctionnement de l'algorithme :

### 1. Démarrage du questionnaire
- **La première question** posée à l'utilisateur est toujours choisie aléatoirement parmi les questions de difficulté `3` (niveau moyen).
- Cette question est sélectionnée pour offrir un point de départ équilibré, ni trop facile ni trop difficile.

### 2. Logique adaptative après chaque réponse
- Après chaque réponse de l'utilisateur :
    - Si la réponse est **correcte**, la prochaine question sera choisie à une difficulté **supérieure** (+1 niveau, jusqu'à 5 max).
    - Si la réponse est **incorrecte**, la prochaine question sera choisie à une difficulté **inférieure** (–1 niveau, jusqu'à 1 min).
- L'algorithme recherche une question disponible à la difficulté cible. Si aucune question n'est disponible à ce niveau, il cherche à proximité (difficulté +1, puis –1, etc.).

### 3. Gestion des doublons et suivi
- Chaque question déjà posée est enregistrée pour **éviter les doublons**.
- La séquence des questions posées est conservée dans une liste dédiée, ce qui permet de suivre précisément le parcours adaptatif de l'utilisateur.

### 4. Fin du questionnaire
- Le questionnaire se termine lorsque le nombre maximal de questions est atteint ou qu'il n'y a plus de questions disponibles à proposer.

### 5. Types de questions gérés
- L’algorithme fonctionne aussi bien pour les QCM (choix multiple) que pour les questions à réponse libre.
- La correction automatique (IA ou non) est intégrée dans le flux adaptatif.

---

**Résumé du flux adaptatif**
1. Démarrage avec une question de difficulté 3.
2. À chaque réponse, ajustement de la difficulté selon la réussite.
3. Sélection d’une nouvelle question adaptée, sans doublon.
4. Répétition jusqu’à la fin du test.

Ce système permet d’obtenir une évaluation fine et progressive du niveau de l’utilisateur, tout en maintenant l’engagement grâce à un parcours personnalisé.

---


```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

<!-- 
Étape 2 : Démarrage du serveur de développement
Cette étape permet de démarrer le serveur de développement sur l'adresse http://localhost:3000.
-->

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

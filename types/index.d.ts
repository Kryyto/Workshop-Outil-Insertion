// Déclarations de types globaux pour l'application
// Ce fichier permet d'étendre le typage TypeScript pour Nuxt, Vue et les stores personnalisés.
// Chaque module déclaré ici évite les erreurs d'importation ou de typage lors de l'utilisation des stores ou fonctions Nuxt.

// Déclarer les modules pour éviter les erreurs d'importation
declare module '~/stores/questions' {
  export const useQuestionStore: any
}

declare module '~/stores/elo' {
  export const useEloStore: any
}

// Étendre l'interface Vue pour les propriétés globales
declare module 'vue' {
  // Interface étendue pour permettre l'accès à $pinia dans tous les composants Vue
interface ComponentCustomProperties {
    $pinia: any
  }
}

// Déclarations pour les fonctions Nuxt
// Permet d'utiliser definePageMeta et useHead sans erreur de typage.
declare function definePageMeta(meta: any): void
declare function useHead(options: any): any

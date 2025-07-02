// Déclarations de types globaux pour l'application

// Déclarer les modules pour éviter les erreurs d'importation
declare module '~/stores/questions' {
  export const useQuestionStore: any
}

declare module '~/stores/elo' {
  export const useEloStore: any
}

// Étendre l'interface Vue pour les propriétés globales
declare module 'vue' {
  interface ComponentCustomProperties {
    $pinia: any
  }
}

// Déclarations pour les fonctions Nuxt
declare function definePageMeta(meta: any): void
declare function useHead(options: any): any

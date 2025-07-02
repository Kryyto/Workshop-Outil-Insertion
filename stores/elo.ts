import { defineStore } from 'pinia'

export const useEloStore = defineStore('elo', {
  state: () => ({
    // Score Elo initial
    elo: 1000,
    // Historique des changements d'Elo pour pouvoir revenir en arrière
    eloHistory: [] as number[],
  }),

  getters: {
    currentElo: (state) => Math.round(state.elo),
  },

  actions: {
    /**
     * Réinitialise le score Elo à la valeur par défaut
     */
    resetElo() {
      this.elo = 1000
      this.eloHistory = []
    },

    /**
     * Met à jour le score Elo en fonction de la difficulté de la question et de la réponse
     * @param difficulty Niveau de difficulté de la question (1-5)
     * @param isCorrect Si la réponse est correcte
     */
    updateElo(difficulty: number, isCorrect: boolean) {
      // Sauvegarder l'Elo actuel dans l'historique
      this.eloHistory.push(this.elo)

      // Facteur K détermine l'amplitude du changement d'Elo
      // Plus la difficulté est élevée, plus le changement peut être important
      const kFactor = 32 * (difficulty / 3)

      // Calcul de la probabilité attendue de répondre correctement
      // Basé sur la difficulté de la question par rapport au niveau actuel
      const expectedScore = this.calculateExpectedScore(difficulty)

      // Score réel (1 pour correct, 0 pour incorrect)
      const actualScore = isCorrect ? 1 : 0

      // Formule Elo: Nouveau Elo = Ancien Elo + K * (Score réel - Score attendu)
      this.elo += kFactor * (actualScore - expectedScore)

      // Limiter l'Elo entre 400 et 2400
      this.elo = Math.max(400, Math.min(2400, this.elo))
    },
    
    /**
     * Calcule la probabilité attendue de répondre correctement à une question
     * en fonction de la difficulté et du niveau Elo actuel
     * @param difficulty Niveau de difficulté (1-5)
     * @returns Probabilité entre 0 et 1
     */
    calculateExpectedScore(difficulty: number): number {
      // Convertir la difficulté en équivalent Elo
      // Difficulté 1 = 800, 2 = 1000, 3 = 1200, 4 = 1400, 5 = 1600
      const questionElo = 600 + (difficulty * 200)
      
      // Formule Elo standard pour calculer la probabilité de victoire
      return 1 / (1 + Math.pow(10, (questionElo - this.elo) / 400))
    }
  }
})

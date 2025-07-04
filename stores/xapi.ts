import { defineStore } from 'pinia'

/**
 * Interface pour un objet Actor xAPI (l'utilisateur)
 */
interface XApiActor {
  name: string
  mbox?: string
  objectType: string
}

/**
 * Interface pour un objet Verb xAPI (l'action)
 */
interface XApiVerb {
  id: string
  display: {
    [key: string]: string
  }
}

/**
 * Interface pour un choix dans une question à choix multiple
 */
interface XApiInteractionComponent {
  id: string
  description?: {
    [key: string]: string
  }
}

/**
 * Interface pour un objet Object xAPI (l'activité)
 */
interface XApiObject {
  id: string
  definition: {
    name: {
      [key: string]: string
    }
    description?: {
      [key: string]: string
    }
    type?: string
    interactionType?: 'choice' | 'fill-in' | 'matching' | 'performance' | 'sequencing' | 'likert' | 'matching' | 'performance' | 'sequencing' | 'true-false' | 'other'
    correctResponsesPattern?: string[]
    choices?: XApiInteractionComponent[]
    scale?: XApiInteractionComponent[]
    source?: XApiInteractionComponent[]
    target?: XApiInteractionComponent[]
    steps?: XApiInteractionComponent[]
    [key: string]: any
  }
  objectType: string
}

/**
 * Interface pour un objet Result xAPI (le résultat)
 */
interface XApiResult {
  score?: {
    scaled?: number
    raw?: number
    min?: number
    max?: number
  }
  success?: boolean
  completion?: boolean
  response?: string
  duration?: string
  extensions?: {
    [key: string]: any
  }
}

/**
 * Interface pour un objet Context xAPI (le contexte)
 */
interface XApiContext {
  registration?: string
  instructor?: XApiActor
  team?: XApiActor
  contextActivities?: {
    parent?: XApiObject[]
    grouping?: XApiObject[]
    category?: XApiObject[]
    other?: XApiObject[]
  }
  revision?: string
  platform?: string
  language?: string
  statement?: {
    id: string
    objectType: string
  }
  extensions?: {
    [key: string]: any
  }
}

/**
 * Interface pour une déclaration xAPI complète
 */
interface XApiStatement {
  id?: string
  actor: XApiActor
  verb: XApiVerb
  object: XApiObject
  result?: XApiResult
  context?: XApiContext
  timestamp?: string
  stored?: string
  authority?: XApiActor
  version?: string
  attachments?: any[]
}

export const useXApiStore = defineStore('xapi', {
  state: () => ({
    statements: [] as XApiStatement[],
    actor: {
      name: 'Anonymous User',
      objectType: 'Agent'
    } as XApiActor,
    activityId: 'http://example.com/elo-assessment',
    platform: 'Elo Assessment Tool'
  }),

  actions: {
    /**
     * Définit l'utilisateur actuel
     * @param name Nom de l'utilisateur
     * @param email Email de l'utilisateur (optionnel)
     */
    setUser(name: string, email?: string) {
      this.actor = {
        name,
        objectType: 'Agent'
      }
      
      if (email) {
        this.actor.mbox = `mailto:${email}`
      }
    },

    /**
     * Génère une déclaration xAPI pour le début d'une évaluation
     */
    startedAssessment() {
      const statement: XApiStatement = {
        actor: this.actor,
        verb: {
          id: 'http://adlnet.gov/expapi/verbs/attempted',
          display: {
            'en-US': 'attempted',
            'fr-FR': 'a commencé'
          }
        },
        object: {
          id: this.activityId,
          definition: {
            name: {
              'en-US': 'Elo Assessment',
              'fr-FR': 'Évaluation Elo'
            },
            description: {
              'en-US': 'An adaptive assessment using Elo rating system',
              'fr-FR': 'Une évaluation adaptative utilisant le système de classement Elo'
            },
            type: 'http://adlnet.gov/expapi/activities/assessment'
          },
          objectType: 'Activity'
        },
        timestamp: new Date().toISOString()
      }

      this.statements.push(statement)
      return statement
    },

    /**
     * Génère une déclaration xAPI pour une réponse à une question QCM
     * @param questionId ID de la question
     * @param questionText Texte de la question
     * @param selectedOption Index de l'option sélectionnée
     * @param selectedText Texte de l'option sélectionnée
     * @param correctOption Index de l'option correcte
     * @param correctText Texte de l'option correcte
     * @param isCorrect Si la réponse est correcte
     * @param difficulty Difficulté de la question
     */
    answeredQuestion(
      questionId: number,
      questionText: string,
      selectedOption: number,
      selectedText: string,
      correctOption: number,
      correctText: string,
      isCorrect: boolean,
      difficulty: number
    ) {
      const statement: XApiStatement = {
        actor: this.actor,
        verb: {
          id: 'http://adlnet.gov/expapi/verbs/answered',
          display: {
            'en-US': 'answered',
            'fr-FR': 'a répondu'
          }
        },
        object: {
          id: `${this.activityId}/questions/${questionId}`,
          definition: {
            name: {
              'en-US': `Question ${questionId}`,
              'fr-FR': `Question ${questionId}`
            },
            description: {
              'en-US': questionText,
              'fr-FR': questionText
            },
            type: 'http://adlnet.gov/expapi/activities/cmi.interaction',
            interactionType: 'choice',
            correctResponsesPattern: [correctOption.toString()],
            choices: [
              // Les choix seront ajoutés dynamiquement
            ]
          },
          objectType: 'Activity'
        },
        result: {
          score: {
            scaled: isCorrect ? 1 : 0,
            raw: isCorrect ? 1 : 0,
            min: 0,
            max: 1
          },
          success: isCorrect,
          completion: true,
          response: selectedOption.toString(),
          extensions: {
            'http://id.tincanapi.com/extension/difficulty': difficulty,
            'http://id.tincanapi.com/extension/answer': selectedText,
            'http://id.tincanapi.com/extension/correct-answer': correctText,
            'http://id.tincanapi.com/extension/question-type': 'qcm'
          }
        },
        context: {
          contextActivities: {
            parent: [{
              id: this.activityId,
              objectType: 'Activity'
            }]
          },
          platform: this.platform
        },
        timestamp: new Date().toISOString()
      }

      this.statements.push(statement)
      return statement
    },

    /**
     * Génère une déclaration xAPI pour une réponse à une question à réponse libre
     * @param questionId ID de la question
     * @param questionText Texte de la question
     * @param answer Réponse de l'utilisateur
     * @param isCorrect Si la réponse est considérée comme correcte
     * @param difficulty Difficulté de la question
     */
    answeredFreeTextQuestion(
      questionId: number,
      questionText: string,
      answer: string,
      isCorrect: boolean,
      difficulty: number
    ) {
      const statement: XApiStatement = {
        actor: this.actor,
        verb: {
          id: 'http://adlnet.gov/expapi/verbs/answered',
          display: {
            'en-US': 'answered',
            'fr-FR': 'a répondu'
          }
        },
        object: {
          id: `${this.activityId}/questions/${questionId}`,
          definition: {
            name: {
              'en-US': `Question ${questionId}`,
              'fr-FR': `Question ${questionId}`
            },
            description: {
              'en-US': questionText,
              'fr-FR': questionText
            },
            type: 'http://adlnet.gov/expapi/activities/cmi.interaction',
            interactionType: 'fill-in',
            correctResponsesPattern: [''] // Pas de réponse correcte unique pour les réponses libres
          },
          objectType: 'Activity'
        },
        result: {
          score: {
            scaled: isCorrect ? 1 : 0,
            raw: isCorrect ? 1 : 0,
            min: 0,
            max: 1
          },
          success: isCorrect,
          completion: true,
          response: answer,
          extensions: {
            'http://id.tincanapi.com/extension/difficulty': difficulty,
            'http://id.tincanapi.com/extension/answer': answer,
            'http://id.tincanapi.com/extension/question-type': 'free_text',
            'http://id.tincanapi.com/extension/requires-grading': true
          }
        },
        context: {
          contextActivities: {
            parent: [{
              id: this.activityId,
              objectType: 'Activity'
            }]
          },
          platform: this.platform
        },
        timestamp: new Date().toISOString()
      }

      this.statements.push(statement)
      return statement
    },

    /**
     * Génère une déclaration xAPI pour la fin d'une évaluation
     * @param score Score Elo final
     * @param totalQuestions Nombre total de questions
     * @param correctAnswers Nombre de réponses correctes
     */
    completedAssessment(score: number, totalQuestions: number, correctAnswers: number) {
      const statement: XApiStatement = {
        actor: this.actor,
        verb: {
          id: 'http://adlnet.gov/expapi/verbs/completed',
          display: {
            'en-US': 'completed',
            'fr-FR': 'a terminé'
          }
        },
        object: {
          id: this.activityId,
          definition: {
            name: {
              'en-US': 'Elo Assessment',
              'fr-FR': 'Évaluation Elo'
            },
            description: {
              'en-US': 'An adaptive assessment using Elo rating system',
              'fr-FR': 'Une évaluation adaptative utilisant le système de classement Elo'
            },
            type: 'http://adlnet.gov/expapi/activities/assessment'
          },
          objectType: 'Activity'
        },
        result: {
          completion: true,
          success: correctAnswers > totalQuestions / 2,
          score: {
            scaled: correctAnswers / totalQuestions,
            raw: correctAnswers,
            min: 0,
            max: totalQuestions
          },
          extensions: {
            'http://example.com/xapi/eloScore': score,
            'http://example.com/xapi/totalQuestions': totalQuestions,
            'http://example.com/xapi/correctAnswers': correctAnswers
          }
        },
        context: {
          platform: this.platform
        },
        timestamp: new Date().toISOString()
      }

      this.statements.push(statement)
      return statement
    },

    /**
     * Exporte toutes les déclarations xAPI au format JSON
     */
    exportStatements() {
      return JSON.stringify(this.statements, null, 2)
    },

    /**
     * Sauvegarde les déclarations xAPI dans le localStorage
     */
    saveToLocalStorage() {
      if (process.client) {
        localStorage.setItem('xapi_statements', this.exportStatements())
      }
    },

    /**
     * Charge les déclarations xAPI depuis le localStorage
     */
    loadFromLocalStorage() {
      if (process.client) {
        const saved = localStorage.getItem('xapi_statements')
        if (saved) {
          try {
            this.statements = JSON.parse(saved)
          } catch (e) {
            console.error('Failed to parse xAPI statements from localStorage', e)
          }
        }
      }
    }
  }
})

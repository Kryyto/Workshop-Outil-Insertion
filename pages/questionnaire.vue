<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <!-- Header Card -->
      <div class="bg-white rounded-2xl shadow-sm border border-slate-200 mb-6">
        <div class="px-8 py-6">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-semibold text-slate-800">Évaluation des Compétences</h1>
              <p class="text-slate-600 mt-1">Questionnaire de positionnement professionnel</p>
            </div>
            <div class="flex items-center space-x-4">
              <div class="text-right">
                <div class="text-sm text-slate-500 font-medium">Score actuel</div>
                <div class="text-2xl font-bold text-blue-600">{{ currentElo }}</div>
              </div>
              <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content Card -->
      <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

        <!-- Progress Bar -->
        <div class="bg-slate-50 px-8 py-4 border-b border-slate-200">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-slate-700">
              Question {{ currentQuestionIndex + 1 }} sur {{ NB_QUESTIONS_MAX }}
            </span>
            <div class="flex items-center space-x-2">
              <span class="text-xs text-slate-500">Niveau</span>
              <div class="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                {{ currentQuestion?.difficulty || 1 }}
              </div>
            </div>
          </div>
          <div class="w-full bg-slate-200 rounded-full h-2">
            <div
                class="bg-gradient-to-r from-blue-500 to-emerald-500 h-2 rounded-full transition-all duration-500 ease-out"
                :style="{ width: `${((currentQuestionIndex + 1) / NB_QUESTIONS_MAX) * 100}%` }"
            ></div>
          </div>
        </div>

        <!-- Question Section -->
        <div v-if="!isFinished" class="px-8 py-8">
          <div class="mb-8">
            <h2 class="text-xl font-medium text-slate-800 leading-relaxed">
              {{ currentQuestion?.question }}
            </h2>
          </div>

          <div class="space-y-3">
            <div
                v-for="(option, index) in currentQuestion?.options"
                :key="index"
                class="group relative"
                @click="handleOptionClick(index)"
            >
              <div
                  class="p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md"
                  :class="selectedAnswer === index
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'"
              >
                <div class="flex items-center">
                  <div class="flex-shrink-0 mr-4">
                    <div
                        class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200"
                        :class="selectedAnswer === index
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-slate-300 group-hover:border-slate-400'"
                    >
                      <div
                          v-if="selectedAnswer === index"
                          class="w-2 h-2 rounded-full bg-white"
                      ></div>
                    </div>
                  </div>
                  <span
                      class="text-slate-700 leading-relaxed"
                      :class="selectedAnswer === index ? 'font-medium' : ''"
                  >
                    {{ option }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Results Section -->
        <div v-else class="px-8 py-8">
          <!-- Final Score -->
          <div class="text-center mb-8">
            <div class="mb-4">
              <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-full mb-4">
                <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h2 class="text-2xl font-bold text-slate-800 mb-2">Évaluation terminée</h2>
              <p class="text-slate-600">Voici votre score final</p>
            </div>

            <div class="bg-gradient-to-r from-blue-500 to-emerald-500 text-white rounded-2xl p-6 inline-block">
              <div class="text-4xl font-bold mb-1">{{ currentElo }}</div>
              <div class="text-blue-100 text-sm">Points de compétence</div>
            </div>
          </div>

          <!-- Score Interpretation -->
          <div class="bg-slate-50 rounded-xl p-6 mb-8">
            <h3 class="font-semibold text-slate-800 mb-4">Interprétation de votre score</h3>
            <div class="space-y-3">
              <div v-if="currentElo < 800" class="flex items-start space-x-3">
                <div class="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <div class="font-medium text-slate-700">Niveau débutant (moins de 800)</div>
                  <div class="text-sm text-slate-600">Des connaissances de base qui peuvent être renforcées par une formation adaptée.</div>
                </div>
              </div>
              <div v-if="currentElo >= 800 && currentElo < 1200" class="flex items-start space-x-3">
                <div class="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <div class="font-medium text-slate-700">Niveau intermédiaire (800-1200)</div>
                  <div class="text-sm text-slate-600">Bonnes bases avec quelques domaines à approfondir pour optimiser votre réinsertion.</div>
                </div>
              </div>
              <div v-if="currentElo >= 1200 && currentElo < 1600" class="flex items-start space-x-3">
                <div class="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <div class="font-medium text-slate-700">Niveau avancé (1200-1600)</div>
                  <div class="text-sm text-slate-600">Excellentes compétences, vous êtes prêt(e) pour des postes qualifiés.</div>
                </div>
              </div>
              <div v-if="currentElo >= 1600" class="flex items-start space-x-3">
                <div class="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <div class="font-medium text-slate-700">Niveau expert (1600+)</div>
                  <div class="text-sm text-slate-600">Compétences approfondies, vous pouvez viser des postes à responsabilités.</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Answers Summary -->
          <div class="space-y-4">
            <h3 class="font-semibold text-slate-800 mb-4">Récapitulatif de vos réponses</h3>
            <div v-for="(answer, index) in answeredQuestions" :key="index" class="border border-slate-200 rounded-xl p-4">
              <div class="mb-3">
                <div class="text-sm font-medium text-slate-600 mb-1">Question {{ index + 1 }}</div>
                <div class="text-slate-800">{{ getQuestionText(answer.questionId) }}</div>
              </div>

              <div class="space-y-2">
                <div class="flex items-center space-x-2">
                  <span class="text-sm text-slate-500">Votre réponse:</span>
                  <span :class="answer.correct ? 'text-emerald-600 font-medium' : 'text-red-500 font-medium'">
                    {{ getAnswerText(answer.questionId, answer.selectedOption) }}
                  </span>
                  <div v-if="answer.correct" class="w-4 h-4 text-emerald-500">
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                    </svg>
                  </div>
                  <div v-else class="w-4 h-4 text-red-500">
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
                    </svg>
                  </div>
                </div>

                <div v-if="!answer.correct" class="flex items-center space-x-2">
                  <span class="text-sm text-slate-500">Bonne réponse:</span>
                  <span class="text-emerald-600 font-medium">
                    {{ getCorrectAnswerText(answer.questionId) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="bg-slate-50 px-8 py-6 border-t border-slate-200">
          <div class="flex justify-between items-center">
            <div v-if="!isFinished" class="text-sm text-slate-500">
              Sélectionnez une réponse pour continuer
            </div>
            <div v-else class="text-sm text-slate-500">
              Votre évaluation a été sauvegardée
            </div>

            <div class="flex space-x-3">
              <button
                  v-if="!isFinished"
                  @click="nextQuestion"
                  :disabled="selectedAnswer === null"
                  class="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium transition-all duration-200 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ isLastQuestion ? 'Terminer l\'évaluation' : 'Question suivante' }}
              </button>

              <button
                  v-else
                  @click="goToHome"
                  class="px-6 py-2.5 bg-emerald-600 text-white rounded-lg font-medium transition-all duration-200 hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-200"
              >
                Retour à l'accueil
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Imports Nuxt
import { useRouter } from 'vue-router'

// Imports des types et stores
import { useQuestionStore } from '~/stores/questions'
import { useEloStore } from '~/stores/elo'

definePageMeta({
  title: 'Questionnaire'
})

// Router
const router = useRouter()

// Récupération des stores
const questionStore = useQuestionStore()
const eloStore = useEloStore()

// Constantes
const NB_QUESTIONS_MAX = 5

// État local
const currentQuestionIndex = ref(0)
const selectedAnswer = ref<number | null>(null)
const answeredQuestions = ref<{questionId: number, correct: boolean, selectedOption: number}[]>([])
const isFinished = ref(false)
const usedQuestionIds = ref<number[]>([])

// Calcul des propriétés
const currentQuestion = computed(() => {
  if (currentQuestionIndex.value < NB_QUESTIONS_MAX && usedQuestionIds.value.length > 0) {
    const id = usedQuestionIds.value[currentQuestionIndex.value]
    return questionStore.getQuestionById(id)
  }
  return null
})

const isLastQuestion = computed(() => currentQuestionIndex.value === NB_QUESTIONS_MAX - 1)
const currentElo = computed(() => eloStore.currentElo)

// Fonction pour gérer le clic sur une option
function handleOptionClick(index: number) {
  selectedAnswer.value = index
  console.log('Option sélectionnée:', index)
}

// Fonction pour aller à l'accueil
function goToHome() {
  router.push('/')
}

// Fonctions de navigation
function nextQuestion() {
  if (selectedAnswer.value !== null && currentQuestion.value) {
    // Vérifier si la réponse est correcte
    const isCorrect = selectedAnswer.value === currentQuestion.value.correctAnswer

    // Enregistrer la réponse
    answeredQuestions.value.push({
      questionId: currentQuestion.value.id,
      correct: isCorrect,
      selectedOption: selectedAnswer.value
    })

    // Mettre à jour le score Elo
    eloStore.updateElo(currentQuestion.value.difficulty, isCorrect)

    // Si c'était la dernière question, terminer
    if (currentQuestionIndex.value >= NB_QUESTIONS_MAX - 1) {
      isFinished.value = true
      return
    }

    // Passer à la question suivante
    currentQuestionIndex.value++
    selectedAnswer.value = null
  }
}

// Initialisation des questions et du score à la création du composant
onMounted(() => {
  // Initialiser le score Elo
  eloStore.resetElo()

  // Charger les questions
  questionStore.loadQuestions()

  // Mélanger et sélectionner les questions uniques dès le début
  const shuffled = [...questionStore.questions].sort(() => 0.5 - Math.random())
  usedQuestionIds.value = shuffled.slice(0, NB_QUESTIONS_MAX).map((q: Question) => q.id)
})

// Fonctions pour le récapitulatif des réponses
function getQuestionText(questionId: number): string {
  const question = questionStore.getQuestionById(questionId)
  return question ? question.question : ''
}

function getAnswerText(questionId: number, optionIndex: number): string {
  const question = questionStore.getQuestionById(questionId)
  return question && question.options[optionIndex] ? question.options[optionIndex] : ''
}

function getCorrectAnswerText(questionId: number): string {
  const question = questionStore.getQuestionById(questionId)
  return question ? question.options[question.correctAnswer] : ''
}
</script>
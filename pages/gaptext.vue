<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <!-- Header Card -->
      <div class="bg-white rounded-2xl shadow-sm border border-slate-200 mb-6">
        <div class="px-8 py-6">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-semibold text-slate-800">Texte à trous</h1>
              <p class="text-slate-600 mt-1">Complétez les phrases en remplissant les champs manquants</p>
            </div>
            <div class="flex items-center space-x-4">
              <div v-if="isFinished" class="text-right">
                <div class="text-sm text-slate-500 font-medium">Score final</div>
                <div class="text-2xl font-bold text-blue-600">{{ gaptextStore.score }}%</div>
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
            <div class="text-sm font-medium text-slate-600">
              Question {{ currentQuestionIndex + 1 }} sur {{ totalQuestions }}
            </div>
            <div class="text-sm font-medium text-slate-600">
              {{ Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100) }}%
            </div>
          </div>
          <div class="w-full bg-slate-200 rounded-full h-2.5">
            <div
              class="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              :style="{ width: `${Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100)}%` }"
            ></div>
          </div>
        </div>

        <!-- Question Content -->
        <div class="px-8 py-6">
          <div v-if="!isFinished && currentQuestion">
            <!-- Question Title -->
            <h2 class="text-xl font-semibold text-slate-800 mb-4">{{ currentQuestion.title }}</h2>
            
            <!-- Category & Difficulty -->
            <div class="flex items-center space-x-4 mb-6">
              <span class="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                {{ currentQuestion.category }}
              </span>
              <span class="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">
                Difficulté: {{ currentQuestion.difficulty }}/5
              </span>
            </div>

            <!-- Gap Text -->
            <div class="mb-8 text-slate-700 leading-relaxed">
              <p class="text-lg">
                <template v-for="(part, index) in formattedText" :key="index">
                  {{ part }}
                  <input
                    v-if="index < formattedText.length - 1"
                    type="text"
                    :placeholder="'Réponse ' + (index + 1)"
                    v-model="gaptextStore.userAnswers[index]"
                    class="px-2 py-1 border-b-2 border-blue-400 focus:border-blue-600 outline-none mx-1 w-32 inline-block text-center"
                    @keyup.enter="checkAndProceed"
                  />
                </template>
              </p>
            </div>

            <!-- Navigation Buttons -->
            <div class="flex justify-end space-x-4 mt-8">
              <button
                @click="checkAndProceed"
                :disabled="!allAnswersFilled"
                :class="[
                  'px-6 py-2.5 rounded-lg text-white font-medium transition-all duration-200',
                  allAnswersFilled
                    ? 'bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200'
                    : 'bg-slate-400 cursor-not-allowed'
                ]"
              >
                {{ isLastQuestion ? 'Terminer' : 'Suivant' }}
              </button>
            </div>
          </div>

          <!-- Results View -->
          <div v-else-if="isFinished" class="py-4">
            <!-- Results Header -->
            <div class="text-center mb-8">
              <h2 class="text-2xl font-bold text-slate-800 mb-2">Résultats</h2>
              <p class="text-slate-600">Vous avez complété l'exercice de texte à trous</p>
              
              <div class="mt-6 flex justify-center">
                <div class="w-32 h-32 rounded-full border-8 border-blue-100 flex items-center justify-center">
                  <div class="text-center">
                    <div class="text-3xl font-bold text-blue-600">{{ gaptextStore.score }}%</div>
                    <div class="text-sm text-slate-500">Score</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Answers Summary -->
            <div class="space-y-6 mt-8">
              <h3 class="font-semibold text-slate-800 mb-4">Récapitulatif de vos réponses</h3>
              
              <div v-for="(question, qIndex) in gaptextStore.questions" :key="question.id" class="bg-slate-50 rounded-xl p-6 mb-4">
                <h4 class="font-medium text-slate-800 mb-3">{{ question.title }}</h4>
                
                <div class="space-y-3">
                  <div v-for="(gap, gIndex) in question.gaps" :key="gIndex" class="flex items-center justify-between">
                    <div class="text-slate-700">Trou #{{ gIndex + 1 }}</div>
                    
                    <div class="flex items-center space-x-4">
                      <div class="flex items-center">
                        <span class="text-slate-600 mr-2">Votre réponse:</span>
                        <span 
                          :class="[
                            'px-3 py-1 rounded-lg text-sm font-medium',
                            userAnswersForQuestion(qIndex)[gIndex]?.toLowerCase() === gap.toLowerCase()
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          ]"
                        >
                          {{ userAnswersForQuestion(qIndex)[gIndex] || '(vide)' }}
                        </span>
                      </div>
                      
                      <div v-if="userAnswersForQuestion(qIndex)[gIndex]?.toLowerCase() !== gap.toLowerCase()" class="flex items-center">
                        <span class="text-slate-600 mr-2">Réponse correcte:</span>
                        <span class="px-3 py-1 bg-green-100 text-green-800 rounded-lg text-sm font-medium">
                          {{ gap }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Navigation Buttons -->
            <div class="flex justify-center space-x-4 mt-12">
              <button
                @click="restart"
                class="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium transition-all duration-200 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200"
              >
                Recommencer
              </button>
              <NuxtLink
                to="/"
                class="px-6 py-2.5 bg-slate-200 text-slate-700 rounded-lg font-medium transition-all duration-200 hover:bg-slate-300 focus:ring-4 focus:ring-slate-100"
              >
                Retour à l'accueil
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useGapTextStore } from '~/stores/gaptext'

// Récupération du store
const gaptextStore = useGapTextStore()

// État local
const isFinished = computed(() => gaptextStore.isFinished)

// Calcul des propriétés
const currentQuestion = computed(() => gaptextStore.currentQuestion)
const currentQuestionIndex = computed(() => gaptextStore.currentQuestionIndex)
const totalQuestions = computed(() => gaptextStore.totalQuestions)
const formattedText = computed(() => gaptextStore.formattedText)
const allAnswersFilled = computed(() => gaptextStore.allAnswersFilled())
const isLastQuestion = computed(() => gaptextStore.isLastQuestion)

// Stockage des réponses par question
const allUserAnswers = ref<string[][]>([])

// Fonction pour vérifier les réponses et passer à la question suivante
function checkAndProceed() {
  if (!allAnswersFilled.value) return
  
  // Sauvegarder les réponses actuelles
  allUserAnswers.value[currentQuestionIndex.value] = [...gaptextStore.userAnswers]
  
  // Passer à la question suivante
  gaptextStore.nextQuestion()
}

// Fonction pour récupérer les réponses d'une question spécifique
function userAnswersForQuestion(questionIndex: number): string[] {
  return allUserAnswers.value[questionIndex] || []
}

// Fonction pour redémarrer l'exercice
function restart() {
  gaptextStore.currentQuestionIndex = 0
  gaptextStore.isFinished = false
  gaptextStore.resetUserAnswers()
  allUserAnswers.value = []
}

// Initialisation
onMounted(() => {
  gaptextStore.loadQuestions()
  gaptextStore.resetUserAnswers()
  allUserAnswers.value = new Array(gaptextStore.totalQuestions).fill([]).map(() => [])
})
</script>

<template>
  <div>
    <UCard class="max-w-3xl mx-auto">
      <template #header>
        <div class="flex justify-between items-center">
          <h1 class="text-xl font-bold">Questionnaire d'évaluation</h1>
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-500">Score Elo actuel:</span>
            <UBadge color="blue" variant="soft" size="lg">{{ currentElo }}</UBadge>
          </div>
        </div>
      </template>
      
      <div v-if="!isFinished" class="space-y-6 py-4">
        <div class="flex justify-between items-center">
          <UBadge color="green" variant="soft">
            Niveau {{ currentQuestion?.difficulty || 1 }}
          </UBadge>
          <span class="text-sm text-gray-500">Question {{ currentQuestionIndex + 1 }}/{{ totalQuestions }}</span>
        </div>
        
        <div class="py-2">
          <h2 class="text-lg font-medium mb-4">{{ currentQuestion?.question }}</h2>
          
          <div class="space-y-3">
            <div v-for="(option, index) in currentQuestion?.options" 
                 :key="index"
                 class="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                 @click="handleOptionClick(index)">
              <div class="flex items-center">
                <div class="w-5 h-5 mr-3 rounded-full border border-gray-300 flex items-center justify-center">
                  <div v-if="selectedAnswer === index" class="w-3 h-3 rounded-full bg-blue-500"></div>
                </div>
                <span>{{ option }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else class="space-y-6 py-4">
        <div class="border-t border-b py-4 text-center">
          <h2>Évaluation terminée</h2>
        </div>
        
        <div class="text-center">
          <h2 class="text-xl font-bold mb-2">Votre score final</h2>
          <UBadge color="blue" variant="solid" size="xl" class="text-2xl py-2 px-4">{{ currentElo }}</UBadge>
          
          <div class="mt-6 text-left">
            <h3 class="font-medium mb-2">Interprétation de votre score:</h3>
            <ul class="list-disc pl-5 space-y-2">
              <li v-if="currentElo < 800" class="text-sm">
                <span class="font-medium">Niveau débutant (moins de 800):</span> 
                Des connaissances de base en culture générale qui peuvent être renforcées.
              </li>
              <li v-if="currentElo >= 800 && currentElo < 1200" class="text-sm">
                <span class="font-medium">Niveau intermédiaire (800-1200):</span> 
                Bonnes connaissances générales avec quelques domaines à approfondir.
              </li>
              <li v-if="currentElo >= 1200 && currentElo < 1600" class="text-sm">
                <span class="font-medium">Niveau avancé (1200-1600):</span> 
                Excellentes connaissances générales, avec une bonne maîtrise de sujets variés.
              </li>
              <li v-if="currentElo >= 1600" class="text-sm">
                <span class="font-medium">Niveau expert (1600+):</span> 
                Connaissances approfondies dans de nombreux domaines de culture générale.
              </li>
            </ul>
          </div>
          
          <div class="mt-8">
            <h3 class="font-medium mb-4 text-left">Récapitulatif de vos réponses:</h3>
            <div v-for="(answer, index) in answeredQuestions" :key="index" class="mb-4 border rounded-lg p-4 text-left">
              <div class="font-medium">Question {{ index + 1 }}:</div>
              <div class="ml-4 mb-2">{{ getQuestionText(answer.questionId) }}</div>
              
              <div class="ml-4">
                <div class="flex items-center">
                  <span class="mr-2">Votre réponse:</span>
                  <span :class="answer.correct ? 'text-green-600 font-medium' : 'text-red-600 font-medium'">
                    {{ getAnswerText(answer.questionId, answer.selectedOption) }}
                  </span>
                </div>
                
                <div v-if="!answer.correct" class="flex items-center mt-1">
                  <span class="mr-2">Bonne réponse:</span>
                  <span class="text-green-600 font-medium">
                    {{ getCorrectAnswerText(answer.questionId) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <template #footer>
        <div class="flex justify-end">
          <UButton v-if="!isFinished" 
                  @click="nextQuestion" 
                  color="primary" 
                  :disabled="selectedAnswer === null">
            {{ isLastQuestion ? 'Terminer' : 'Suivant' }}
          </UButton>
          
          <UButton v-else 
                  to="/" 
                  color="primary">
            Retour à l'accueil
          </UButton>
        </div>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { useQuestionStore } from '~/stores/questions'
import { useEloStore } from '~/stores/elo'

definePageMeta({
  title: 'Questionnaire'
})

// Récupération des stores
const questionStore = useQuestionStore()
const eloStore = useEloStore()

// État local
const currentQuestionIndex = ref(0)
const selectedAnswer = ref<number | null>(null)
const answeredQuestions = ref<{questionId: number, correct: boolean, selectedOption: number}[]>([])
const isFinished = ref(false)

// Calcul des propriétés
const totalQuestions = computed(() => questionStore.totalQuestions)
const currentQuestion = computed(() => questionStore.getCurrentQuestion(currentQuestionIndex.value))
const isFirstQuestion = computed(() => currentQuestionIndex.value === 0)
const isLastQuestion = computed(() => currentQuestionIndex.value === totalQuestions.value - 1)
const currentElo = computed(() => eloStore.currentElo)

// Fonction pour gérer le clic sur une option
function handleOptionClick(index: number) {
  selectedAnswer.value = index
  console.log('Option sélectionnée:', index)
}

// Fonctions de navigation
function nextQuestion() {
  if (selectedAnswer.value !== null && currentQuestion.value) {
    // Vérifier si la réponse est correcte
    const isCorrect = selectedAnswer.value === currentQuestion.value.correctAnswer
    console.log('Réponse correcte?', isCorrect)
    
    // Mettre à jour le score Elo
    eloStore.updateElo(currentQuestion.value.difficulty, isCorrect)
    
    // Enregistrer la réponse
    answeredQuestions.value.push({
      questionId: currentQuestion.value.id,
      correct: isCorrect,
      selectedOption: selectedAnswer.value
    })
    
    // Passer à la question suivante ou terminer
    if (isLastQuestion.value) {
      isFinished.value = true
    } else {
      currentQuestionIndex.value++
      selectedAnswer.value = null
    }
  }
}

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

// Initialisation
onMounted(() => {
  // Initialiser le score Elo
  eloStore.resetElo()
  
  // Charger les questions et sélectionner la première en fonction du niveau Elo initial
  questionStore.loadQuestions()
})
</script>

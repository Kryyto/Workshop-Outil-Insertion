<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
    <div class="max-w-4xl mx-auto">
      <!-- Hero Section -->
      <div class="text-center mb-12">
        <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-full mb-6">
          <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
          </svg>
        </div>
        <h1 class="text-4xl font-bold text-slate-800 mb-4">
          Évaluation de Compétences
        </h1>
        <p class="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Découvrez votre niveau de connaissances et identifiez vos points forts pour optimiser votre parcours professionnel
        </p>
      </div>

      <!-- Main Content Card -->
      <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
        <!-- Welcome Section -->
        <div class="bg-gradient-to-r from-blue-50 to-emerald-50 px-8 py-6 border-b border-slate-200">
          <div class="flex items-start space-x-4">
            <div class="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div>
              <h2 class="text-lg font-semibold text-slate-800 mb-2">Bienvenue dans votre évaluation</h2>
              <p class="text-slate-600 leading-relaxed">
                Cet outil vous permet d'évaluer votre niveau de connaissances générales à travers un questionnaire adaptatif intelligent.
                Votre score sera calculé selon un système Elo qui s'ajuste en fonction de la difficulté des questions et de vos réponses.
              </p>
            </div>
          </div>
        </div>

        <!-- How it Works Section -->
        <div class="px-8 py-8">
          <h3 class="text-xl font-semibold text-slate-800 mb-6 flex items-center">
            <svg class="w-6 h-6 text-emerald-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
            Comment ça fonctionne
          </h3>

          <div class="grid md:grid-cols-2 gap-6">
            <!-- Step 1 -->
            <div class="flex items-start space-x-4">
              <div class="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                1
              </div>
              <div>
                <h4 class="font-medium text-slate-800 mb-1">Score initial</h4>
                <p class="text-sm text-slate-600">Vous commencez avec un score Elo de 1000 points</p>
              </div>
            </div>

            <!-- Step 2 -->
            <div class="flex items-start space-x-4">
              <div class="flex-shrink-0 w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold text-sm">
                2
              </div>
              <div>
                <h4 class="font-medium text-slate-800 mb-1">Questions adaptatives</h4>
                <p class="text-sm text-slate-600">Le système s'adapte à votre niveau en temps réel</p>
              </div>
            </div>

            <!-- Step 3 -->
            <div class="flex items-start space-x-4">
              <div class="flex-shrink-0 w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold text-sm">
                3
              </div>
              <div>
                <h4 class="font-medium text-slate-800 mb-1">Calcul dynamique</h4>
                <p class="text-sm text-slate-600">Votre score évolue selon vos réponses correctes</p>
              </div>
            </div>

            <!-- Step 4 -->
            <div class="flex items-start space-x-4">
              <div class="flex-shrink-0 w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold text-sm">
                4
              </div>
              <div>
                <h4 class="font-medium text-slate-800 mb-1">Évaluation précise</h4>
                <p class="text-sm text-slate-600">Obtenez un bilan détaillé de vos compétences</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Stats Section -->
        <div class="bg-slate-50 px-8 py-6 border-t border-slate-200">
          <div class="grid grid-cols-3 gap-6 text-center">
            <div>
              <div class="text-2xl font-bold text-slate-800">5</div>
              <div class="text-sm text-slate-600">Questions</div>
            </div>
            <div>
              <div class="text-2xl font-bold text-slate-800">~5</div>
              <div class="text-sm text-slate-600">Minutes</div>
            </div>
            <div>
              <div class="text-2xl font-bold text-slate-800">4</div>
              <div class="text-sm text-slate-600">Niveaux</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Section -->
      <div class="text-center">
        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <h3 class="text-xl font-semibold text-slate-800 mb-4">Prêt à commencer votre évaluation ?</h3>
          <p class="text-slate-600 mb-6">
            Découvrez votre niveau de compétences et identifiez vos axes d'amélioration pour votre parcours professionnel.
          </p>

          <button
              @click="$router.push('/questionnaire')"
              class="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-xl font-semibold text-lg transition-all duration-200 hover:from-blue-700 hover:to-emerald-700 hover:shadow-lg transform hover:-translate-y-0.5 focus:ring-4 focus:ring-blue-200"
          >
            <svg class="w-5 h-5 mr-2 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Commencer l'évaluation
          </button>

          <p class="text-xs text-slate-500 mt-4">
            Aucune inscription requise • Résultats instantanés • Totalement gratuit
          </p>
        </div>
      </div>

      <!-- Additional Info -->
      <div class="mt-8 text-center">
        <div class="inline-flex items-center space-x-6 text-sm text-slate-500">
          <div class="flex items-center">
            <svg class="w-4 h-4 mr-1 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
            Sécurisé
          </div>
          <div class="flex items-center">
            <svg class="w-4 h-4 mr-1 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
            Confidentiel
          </div>
          <div class="flex items-center">
            <svg class="w-4 h-4 mr-1 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
            Sans engagement
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: 'Accueil'
})
</script>

<template>
  <div>
    <UCard class="max-w-2xl mx-auto">
      <template #header>
        <div class="text-center">
          <h1 class="text-2xl font-bold">Outil d'Évaluation de Compétences</h1>
          <p class="text-gray-500 mt-2">Évaluez votre niveau de culture générale</p>
        </div>
      </template>
      
      <div class="space-y-6 py-4">
        <UAlert title="Bienvenue" color="primary" variant="soft" icon="i-heroicons-information-circle">
          Cet outil vous permet d'évaluer votre niveau de culture générale à travers un questionnaire adaptatif.
          Votre score sera calculé selon un système Elo, qui s'ajuste en fonction de la difficulté des questions et de vos réponses.
        </UAlert>
        
        <p class="text-sm text-gray-600">
          Comment ça fonctionne :
        </p>
        <ul class="list-disc pl-5 text-sm text-gray-600 space-y-1">
          <li>Vous commencerez avec un score Elo initial de 1000</li>
          <li>Les questions s'adaptent à votre niveau</li>
          <li>Votre score augmente ou diminue selon vos réponses</li>
          <li>À la fin, vous obtiendrez une évaluation précise de votre niveau</li>
        </ul>
      </div>
      
      <template #footer>
        <div class="flex justify-center">
          <UButton 
            to="/questionnaire" 
            color="primary" 
            size="lg"
            icon="i-heroicons-play"
          >
            Commencer l'évaluation
          </UButton>
        </div>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: 'Accueil'
})
</script>

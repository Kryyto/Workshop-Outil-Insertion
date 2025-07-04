<template>
  <!-- Composant racine de l'application Nuxt. Tous les composants enfants y sont injectés via <NuxtPage />. -->
  <div class="min-h-screen bg-gray-50">
    <UContainer class="py-8">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Outil d\'Évaluation de Compétences',
  meta: [
    { name: 'description', content: 'Outil d\'évaluation de compétences pour réinsertion professionnelle' }
  ]
})
</script>

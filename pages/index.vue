<template>
  <main class="main-container">
    <!-- Effets de fond -->
    <div class="background-effects">
      <div class="gradient-1"></div>
      <div class="gradient-2"></div>
      <div class="gradient-3"></div>
    </div>
    
    <!-- Contenu -->
    <div class="content">
      <h1 class="title">
        SNAKE<span class="title-accent">HEXTECH</span>
      </h1>
      <CharacterSelect v-if="!selectedCharacter" @character-selected="onCharacterSelected" />
      <Snake v-else :character="selectedCharacter" @back="onBack" />
    </div>
  </main>
</template>

<script setup>
const selectedCharacter = ref(null)

const onCharacterSelected = (character) => {
  selectedCharacter.value = character
}

const onBack = () => {
  selectedCharacter.value = null
}
</script>

<style scoped>
.main-container {
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  position: relative;
  overflow: hidden;
}

.background-effects {
  position: fixed;
  inset: 0;
}

.gradient-1, .gradient-2, .gradient-3 {
  position: absolute;
  inset: 0;
  transition: all 0.5s ease;
}

.gradient-1 {
  background: radial-gradient(circle at 50% 0%, rgba(var(--hextech-primary), 0.15) 0%, transparent 50%);
}

.gradient-2 {
  background: radial-gradient(circle at 80% 20%, rgba(var(--hextech-secondary), 0.1) 0%, transparent 40%);
}

.gradient-3 {
  background: radial-gradient(circle at 20% 80%, rgba(var(--hextech-accent), 0.05) 0%, transparent 40%);
}

.content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  width: 100%;
}

.title {
  font-size: 4rem;
  font-weight: bold;
  letter-spacing: 4px;
  text-shadow: 0 0 20px rgba(var(--hextech-primary), 0.5);
  text-align: center;
}

.title-accent {
  color: var(--hextech-secondary);
  margin-left: 1rem;
  font-weight: 300;
}
</style> 
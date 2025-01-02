<template>
  <div class="character-select" v-if="!characterSelected">
    <h2 class="select-title">CHOISISSEZ VOTRE CHAMPION</h2>
    <div class="characters">
      <div class="character jinx" @click="selectCharacter('jinx')" :class="{ active: hoveredChar === 'jinx' }" @mouseenter="hoveredChar = 'jinx'" @mouseleave="hoveredChar = null">
        <img src="https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Jinx_0.jpg" alt="Jinx" class="character-bg" />
        <div class="character-overlay"></div>
        <div class="character-content">
          <h3>JINX</h3>
          <p>La Démone au Sourire</p>
          <div class="character-description">
            Criminelle impulsive et maniaque originaire de Zaun, Jinx ne vit que pour semer le chaos sans se soucier des conséquences.
          </div>
        </div>
      </div>
      <div class="character vi" @click="selectCharacter('vi')" :class="{ active: hoveredChar === 'vi' }" @mouseenter="hoveredChar = 'vi'" @mouseleave="hoveredChar = null">
        <img src="https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Vi_0.jpg" alt="Vi" class="character-bg" />
        <div class="character-overlay"></div>
        <div class="character-content">
          <h3>VI</h3>
          <p>La Justicière de Piltover</p>
          <div class="character-description">
            Ancienne criminelle des rues de Zaun, Vi est une femme impulsive et forte qui fait désormais régner la justice à Piltover.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const hoveredChar = ref(null)
const characterSelected = ref(false)

const emit = defineEmits(['character-selected'])

const selectCharacter = (character) => {
  const root = document.documentElement
  if (character === 'jinx') {
    root.style.setProperty('--hextech-primary', 'var(--jinx-primary)')
    root.style.setProperty('--hextech-secondary', 'var(--jinx-secondary)')
    root.style.setProperty('--hextech-accent', 'var(--jinx-accent)')
    root.style.setProperty('--hextech-dark', 'var(--jinx-dark)')
    root.style.setProperty('--hextech-light', 'var(--jinx-light)')
  } else {
    root.style.setProperty('--hextech-primary', 'var(--vi-primary)')
    root.style.setProperty('--hextech-secondary', 'var(--vi-secondary)')
    root.style.setProperty('--hextech-accent', 'var(--vi-accent)')
    root.style.setProperty('--hextech-dark', 'var(--vi-dark)')
    root.style.setProperty('--hextech-light', 'var(--vi-light)')
  }
  characterSelected.value = true
  emit('character-selected', character)
}
</script>

<style scoped>
.character-select {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  width: 100%;
  max-width: 1200px;
}

.select-title {
  font-size: 2.5rem;
  font-weight: bold;
  text-align: center;
  color: var(--hextech-primary);
  text-shadow: 0 0 15px var(--hextech-primary);
}

.characters {
  display: flex;
  gap: 2rem;
  width: 100%;
  height: 600px;
}

.character {
  flex: 1;
  position: relative;
  border-radius: 1rem;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.character-bg {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.5s ease;
  transform: scale(1.1);
}

.character-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.2) 100%);
  opacity: 0.8;
  transition: all 0.3s ease;
}

.character:hover .character-overlay {
  opacity: 0.4;
}

.character:hover .character-bg {
  transform: scale(1.2);
}

.character-content {
  position: relative;
  z-index: 1;
  height: 100%;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.character h3 {
  font-size: 4rem;
  font-weight: bold;
  margin: 0;
  color: white;
  text-shadow: 0 0 20px rgba(0,0,0,0.8);
}

.character p {
  font-size: 1.5rem;
  color: rgba(255,255,255,0.8);
  margin: 0.5rem 0;
  text-shadow: 0 0 10px rgba(0,0,0,0.8);
}

.character-description {
  max-width: 80%;
  font-size: 1.1rem;
  color: rgba(255,255,255,0.7);
  margin-top: 1rem;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.3s ease;
  text-shadow: 0 0 10px rgba(0,0,0,0.8);
}

.character:hover .character-description {
  opacity: 1;
  transform: translateY(0);
}

.jinx {
  box-shadow: 0 0 20px rgba(255, 105, 245, 0.2);
}

.vi {
  box-shadow: 0 0 20px rgba(255, 70, 85, 0.2);
}

.jinx:hover,
.jinx.active {
  border-color: var(--jinx-primary);
  box-shadow: 0 0 30px rgba(255, 105, 245, 0.4);
}

.vi:hover,
.vi.active {
  border-color: var(--vi-primary);
  box-shadow: 0 0 30px rgba(255, 70, 85, 0.4);
}

.character.active .character-description {
  opacity: 1;
  transform: translateY(0);
}

.character.active .character-overlay {
  opacity: 0.4;
}

.character.active .character-bg {
  transform: scale(1.2);
}
</style> 
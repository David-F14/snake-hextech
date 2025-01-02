<template>
  <div class="snake-game">
    <div class="best-score">
      MEILLEUR SCORE: {{ bestScore }}
    </div>
    <div class="game-container">
      <canvas ref="gameCanvas" width="400" height="400" class="game-canvas"></canvas>
      <canvas ref="fireworksCanvas" width="400" height="400" class="fireworks-canvas"></canvas>
      <div class="score">Score: {{ score }}</div>
      <div class="power-info" v-if="!isPlaying">
        <div class="power-key">ESPACE</div>
        <div class="power-description">
          {{ powerDescription }}
        </div>
      </div>
      <div class="power-cooldown" v-if="isPlaying && powerCooldown > 0">
        Pouvoir disponible dans {{ powerCooldown }}s
      </div>
      <div class="buttons">
        <button @click="startGame" class="start-button" :disabled="isPlaying">
          <span class="button-text">COMMENCER</span>
          <div class="button-shine"></div>
        </button>
        <button @click="handleBack" class="back-button">
          <span class="button-text">CHANGER DE CHAMPION</span>
          <div class="button-shine"></div>
        </button>
        <button @click="toggleMusic" class="sound-button" :class="{ 'sound-off': !isMusicPlaying }">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="sound-icon">
            <path v-if="isMusicPlaying" d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z" />
            <path v-else d="M12,4L9.91,6.09L12,8.18M4.27,3L3,4.27L7.73,9H3V15H7L12,20V13.27L16.25,17.53C15.58,18.04 14.83,18.46 14,18.7V20.77C15.38,20.45 16.63,19.82 17.68,18.96L19.73,21L21,19.73L12,10.73M19,12C19,12.94 18.8,13.82 18.46,14.64L19.97,16.15C20.62,14.91 21,13.5 21,12C21,7.72 18,4.14 14,3.23V5.29C16.89,6.15 19,8.83 19,12M16.5,12C16.5,10.23 15.5,8.71 14,7.97V10.18L16.45,12.63C16.5,12.43 16.5,12.21 16.5,12Z" />
          </svg>
        </button>
      </div>
    </div>
    <audio ref="backgroundMusic" loop>
      <source :src="musicSource" type="audio/mpeg">
    </audio>
  </div>
</template>

<script setup>
const props = defineProps({
  character: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['back'])

// Gestion de la musique
const backgroundMusic = ref(null)
const isMusicPlaying = ref(false)

const musicSource = computed(() => {
  return props.character === 'jinx'
    ? '/audio/playground.mp3' // Thème de Jinx (Get Jinxed instrumental)
    : '/audio/dynasties.mp3'  // Thème de Vi (Dynasties and Dystopia instrumental)
})

const toggleMusic = () => {
  if (isMusicPlaying.value) {
    backgroundMusic.value.pause()
  } else {
    backgroundMusic.value.play()
  }
  isMusicPlaying.value = !isMusicPlaying.value
}

const handleBack = () => {
  if (isMusicPlaying.value) {
    backgroundMusic.value.pause()
    isMusicPlaying.value = false
  }
  emit('back')
}

// Pouvoir spécial
const powerCooldown = ref(0)
const canUsePower = ref(true)

const powerDescription = computed(() => {
  return props.character === 'jinx' 
    ? "RALENTISSEMENT TEMPORAIRE : Ralentit le jeu pendant 3 secondes (5s de recharge)"
    : "BRISE-MURAILLE : Dash à travers les obstacles (3s de recharge)"
})

const startPowerCooldown = () => {
  canUsePower.value = false
  powerCooldown.value = props.character === 'jinx' ? 5 : 3
  const cooldownInterval = setInterval(() => {
    powerCooldown.value--
    if (powerCooldown.value <= 0) {
      canUsePower.value = true
      clearInterval(cooldownInterval)
    }
  }, 1000)
}

const normalGameSpeed = 100
const gameSpeed = ref(normalGameSpeed)

const usePower = () => {
  if (!isPlaying.value || !canUsePower.value) return

  if (props.character === 'jinx') {
    // Pouvoir de Jinx : Ralentissement temporaire
    gameSpeed.value = normalGameSpeed * 2 // Divise la vitesse par 2
    createSlowEffect()
    
    // Retour à la vitesse normale après 3 secondes
    setTimeout(() => {
      gameSpeed.value = normalGameSpeed
    }, 3000)
  } else {
    // Pouvoir de Vi : Dash de 3 cases dans la direction actuelle
    const head = snake.value[0]
    for (let i = 0; i < 3; i++) {
      switch(direction.value) {
        case 'up': head.y = (head.y - 1 + 20) % 20; break
        case 'down': head.y = (head.y + 1) % 20; break
        case 'left': head.x = (head.x - 1 + 20) % 20; break
        case 'right': head.x = (head.x + 1) % 20; break
      }
    }
    createDashEffect(head.x * gridSize, head.y * gridSize)
  }

  startPowerCooldown()
}

// Nouvel effet visuel pour le ralentissement
const createSlowEffect = () => {
  ctx.value.save()
  
  // Effet de voile sur tout l'écran
  const gradient = ctx.value.createLinearGradient(0, 0, 400, 400)
  gradient.addColorStop(0, 'rgba(255, 105, 245, 0.05)')
  gradient.addColorStop(0.5, 'rgba(0, 212, 255, 0.05)')
  gradient.addColorStop(1, 'rgba(138, 43, 226, 0.05)')
  
  ctx.value.fillStyle = gradient
  ctx.value.fillRect(0, 0, 400, 400)
  
  // Effet de ralentissement sur les bords
  ctx.value.strokeStyle = 'rgba(255, 105, 245, 0.2)'
  ctx.value.lineWidth = 4
  
  // Lignes horizontales en haut et en bas
  for(let i = 0; i < 3; i++) {
    const y = i * 10
    ctx.value.beginPath()
    ctx.value.moveTo(0, y)
    ctx.value.lineTo(400, y)
    ctx.value.stroke()
    
    ctx.value.beginPath()
    ctx.value.moveTo(0, 400 - y)
    ctx.value.lineTo(400, 400 - y)
    ctx.value.stroke()
  }
  
  // Lignes verticales à gauche et à droite
  for(let i = 0; i < 3; i++) {
    const x = i * 10
    ctx.value.beginPath()
    ctx.value.moveTo(x, 0)
    ctx.value.lineTo(x, 400)
    ctx.value.stroke()
    
    ctx.value.beginPath()
    ctx.value.moveTo(400 - x, 0)
    ctx.value.lineTo(400 - x, 400)
    ctx.value.stroke()
  }
  
  ctx.value.restore()
}

// Effets visuels
const createExplosionEffect = (x, y) => {
  ctx.value.save()
  ctx.value.beginPath()
  ctx.value.arc(x + gridSize/2, y + gridSize/2, gridSize * 2, 0, Math.PI * 2)
  ctx.value.fillStyle = props.character === 'jinx' 
    ? 'rgba(255, 105, 245, 0.3)' 
    : 'rgba(255, 70, 85, 0.3)'
  ctx.value.fill()
  ctx.value.restore()
}

const createDashEffect = (x, y) => {
  ctx.value.save()
  ctx.value.strokeStyle = props.character === 'jinx' 
    ? '#ff69f5' 
    : '#ff4655'
  ctx.value.lineWidth = 2
  ctx.value.setLineDash([5, 5])
  ctx.value.beginPath()
  ctx.value.moveTo(x, y)
  ctx.value.lineTo(x + gridSize, y)
  ctx.value.stroke()
  ctx.value.restore()
}

const gameCanvas = ref(null)
const ctx = ref(null)
const snake = ref([{ x: 10, y: 10 }])
const food = ref({ x: 5, y: 5 })
const direction = ref('right')
const lastProcessedDirection = ref('right')
const directionQueue = ref([])
const isPlaying = ref(false)
const score = ref(0)
const gridSize = 20

// Gestion du meilleur score
const bestScore = ref(0)
const fireworksCanvas = ref(null)
const fireworksCtx = ref(null)
const particles = ref([])
const isNewRecord = ref(false)

// Initialisation du jeu
onMounted(() => {
  ctx.value = gameCanvas.value.getContext('2d')
  window.addEventListener('keydown', handleKeyPress)
  window.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
      event.preventDefault() // Empêcher le défilement
      usePower()
    }
  })
  fireworksCtx.value = fireworksCanvas.value.getContext('2d')
  loadBestScore()
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyPress)
  window.removeEventListener('keydown', (event) => {
    if (event.code === 'Space') {
      usePower()
    }
  })
})

// Gestion des touches directionnelles
const handleKeyPress = (event) => {
  if (!isPlaying.value) return

  const newDirection = event.key.toLowerCase().replace('arrow', '')
  const currentDirection = directionQueue.value.length > 0 
    ? directionQueue.value[directionQueue.value.length - 1] 
    : direction.value

  // Vérifier si la direction est valide
  if (!['up', 'down', 'left', 'right'].includes(newDirection)) return

  // Empêcher les mouvements opposés directs
  const isOpposite = (
    (newDirection === 'up' && currentDirection === 'down') ||
    (newDirection === 'down' && currentDirection === 'up') ||
    (newDirection === 'left' && currentDirection === 'right') ||
    (newDirection === 'right' && currentDirection === 'left')
  )

  if (!isOpposite) {
    // Limiter la taille de la file d'attente à 2 pour éviter l'accumulation
    if (directionQueue.value.length < 2) {
      directionQueue.value.push(newDirection)
    }
  }
}

// Mise à jour de la direction
const updateDirection = () => {
  if (directionQueue.value.length === 0) return

  const nextDirection = directionQueue.value[0]
  const isValidMove = (
    (nextDirection === 'up' && lastProcessedDirection.value !== 'down') ||
    (nextDirection === 'down' && lastProcessedDirection.value !== 'up') ||
    (nextDirection === 'left' && lastProcessedDirection.value !== 'right') ||
    (nextDirection === 'right' && lastProcessedDirection.value !== 'left')
  )

  if (isValidMove) {
    direction.value = nextDirection
    lastProcessedDirection.value = nextDirection
  }
  
  directionQueue.value.shift()
}

// Démarrage du jeu
const startGame = () => {
  isPlaying.value = true
  score.value = 0
  snake.value = [{ x: 10, y: 10 }]
  generateFood()
  gameLoop()
  
  // Démarrer la musique si elle n'est pas déjà en cours
  if (!isMusicPlaying.value) {
    toggleMusic()
  }
}

// Boucle principale du jeu
const gameLoop = () => {
  if (!isPlaying.value) return
  
  updateDirection()
  moveSnake()
  draw()
  setTimeout(gameLoop, gameSpeed.value)
}

// Déplacement du serpent
const moveSnake = () => {
  const head = { ...snake.value[0] }
  
  switch(direction.value) {
    case 'up': head.y--; break
    case 'down': head.y++; break
    case 'left': head.x--; break
    case 'right': head.x++; break
  }

  // Vérifier les collisions avec les murs
  if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20) {
    isPlaying.value = false
    return
  }

  // Vérifier les collisions avec le corps (sauf la queue si on ne mange pas)
  const willEatFood = head.x === food.value.x && head.y === food.value.y
  const bodyCheckLength = willEatFood ? snake.value.length : snake.value.length - 1
  
  for (let i = 0; i < bodyCheckLength; i++) {
    if (head.x === snake.value[i].x && head.y === snake.value[i].y) {
      isPlaying.value = false
      return
    }
  }

  // Ajouter la nouvelle tête
  snake.value.unshift(head)
  
  // Gérer la nourriture
  if (willEatFood) {
    score.value += 10
    generateFood()
    updateBestScore()
  } else {
    snake.value.pop()
  }
}

// Génération aléatoire de la nourriture
const generateFood = () => {
  food.value = {
    x: Math.floor(Math.random() * 20),
    y: Math.floor(Math.random() * 20)
  }
}

// Dessin du jeu
const draw = () => {
  ctx.value.clearRect(0, 0, 400, 400)
  
  // Effet de grille cyberpunk
  ctx.value.strokeStyle = `${props.character === 'jinx' ? '#1a1040' : '#2d1f33'}40`
  for(let i = 0; i < 20; i++) {
    ctx.value.beginPath()
    ctx.value.moveTo(i * gridSize, 0)
    ctx.value.lineTo(i * gridSize, 400)
    ctx.value.stroke()
    ctx.value.beginPath()
    ctx.value.moveTo(0, i * gridSize)
    ctx.value.lineTo(400, i * gridSize)
    ctx.value.stroke()
  }
  
  // Couleurs spécifiques au personnage
  const colors = props.character === 'jinx' 
    ? { primary: '#ff69f5', secondary: '#00d4ff' }
    : { primary: '#ff4655', secondary: '#b91c30' }
  
  // Dessiner le serpent avec effet néon
  snake.value.forEach((segment, index) => {
    ctx.value.shadowBlur = 15
    ctx.value.shadowColor = colors.primary
    ctx.value.fillStyle = index === 0 ? colors.primary : colors.secondary
    ctx.value.fillRect(
      segment.x * gridSize,
      segment.y * gridSize,
      gridSize - 1,
      gridSize - 1
    )
  })
  
  // Dessiner la nourriture avec effet néon
  ctx.value.shadowBlur = 15
  ctx.value.shadowColor = props.character === 'jinx' ? '#8a2be2' : '#7b1fa2'
  ctx.value.fillStyle = props.character === 'jinx' ? '#8a2be2' : '#7b1fa2'
  ctx.value.fillRect(
    food.value.x * gridSize,
    food.value.y * gridSize,
    gridSize - 1,
    gridSize - 1
  )
}

const loadBestScore = () => {
  const savedScore = localStorage.getItem(`bestScore_${props.character}`)
  bestScore.value = savedScore ? parseInt(savedScore) : 0
}

const updateBestScore = () => {
  if (score.value > bestScore.value) {
    bestScore.value = score.value
    localStorage.setItem(`bestScore_${props.character}`, score.value.toString())
    createFireworks()
    isNewRecord.value = true
  }
}

// Animation de feu d'artifice
const createFireworks = () => {
  const colors = props.character === 'jinx' 
    ? ['#ff69f5', '#00d4ff', '#8a2be2']
    : ['#ff4655', '#b91c30', '#7b1fa2']

  for (let i = 0; i < 100; i++) {
    particles.value.push({
      x: 200,
      y: 200,
      vx: (Math.random() - 0.5) * 8,
      vy: (Math.random() - 0.5) * 8,
      radius: Math.random() * 2 + 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1
    })
  }
  animateFireworks()
}

const animateFireworks = () => {
  if (!isNewRecord.value) return

  fireworksCtx.value.clearRect(0, 0, 400, 400)
  
  particles.value = particles.value.filter(particle => particle.alpha > 0)
  
  particles.value.forEach(particle => {
    particle.x += particle.vx
    particle.y += particle.vy
    particle.vy += 0.1 // gravité
    particle.alpha -= 0.01

    fireworksCtx.value.beginPath()
    fireworksCtx.value.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
    fireworksCtx.value.fillStyle = `rgba(${hexToRgb(particle.color)},${particle.alpha})`
    fireworksCtx.value.fill()
  })

  if (particles.value.length > 0) {
    requestAnimationFrame(animateFireworks)
  } else {
    isNewRecord.value = false
  }
}

const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? 
    `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}` 
    : null
}
</script>

<style scoped>
.snake-game {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  background-color: rgba(15, 23, 42, 0.5);
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 0 20px rgba(100, 255, 218, 0.2);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(100, 255, 218, 0.1);
  width: 600px;
  min-height: 700px;
}

.game-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: 600px;
}

.game-canvas {
  border: 2px solid var(--hextech-primary);
  background-color: var(--hextech-light);
  border-radius: 4px;
  box-shadow: 0 0 30px rgba(100, 255, 218, 0.3);
}

.score {
  font-size: 2rem;
  font-weight: bold;
  color: var(--hextech-primary);
  text-shadow: 0 0 10px rgba(100, 255, 218, 0.5);
}

.start-button {
  padding: 0.8rem 2rem;
  font-size: 1.2rem;
  font-family: 'Rajdhani', sans-serif;
  font-weight: bold;
  background: linear-gradient(45deg, var(--hextech-primary), var(--hextech-secondary));
  color: var(--hextech-dark);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
}

.start-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 20px rgba(100, 255, 218, 0.5);
}

.button-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    120deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  transition: 0.5s;
}

.start-button:hover .button-shine {
  left: 100%;
}

.button-text {
  position: relative;
  z-index: 1;
}

.character-portrait {
  position: absolute;
  top: -2rem;
  right: -2rem;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid var(--hextech-primary);
  box-shadow: 0 0 20px rgba(var(--hextech-primary), 0.3);
}

.character-portrait::before {
  content: '';
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  transition: all 0.3s ease;
}

.jinx-portrait::before {
  background-image: url('https://images.contentstack.io/v3/assets/blt731acb42bb3d1659/blt5a2da06d413f7c15/5db05ff02140ec675d68f4c1/RiotX_ChampionList_jinx.jpg?quality=90&width=500');
}

.vi-portrait::before {
  background-image: url('https://images.contentstack.io/v3/assets/blt731acb42bb3d1659/blt3bd79abf330fc807/5db06014347d1c6baa57be46/RiotX_ChampionList_vi.jpg?quality=90&width=500');
}

.character-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%);
  color: white;
  text-align: center;
  transform: translateY(100%);
  transition: transform 0.3s ease;
}

.character-portrait:hover .character-info {
  transform: translateY(0);
}

.character-info h3 {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
  text-shadow: 0 0 10px rgba(0,0,0,0.5);
}

.character-info p {
  font-size: 0.8rem;
  margin: 0.2rem 0 0 0;
  opacity: 0.8;
}

.buttons {
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: center;
  margin-top: auto;
  padding-top: 1rem;
  width: 100%;
  position: absolute;
  bottom: 20px;
}

.back-button {
  padding: 0.8rem 1rem;
  white-space: nowrap;
  min-width: 200px;
  font-size: 1.2rem;
  font-family: 'Rajdhani', sans-serif;
  font-weight: bold;
  background: linear-gradient(45deg, var(--hextech-accent), var(--hextech-secondary));
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  text-shadow: 0 0 5px rgba(0,0,0,0.5);
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 20px rgba(var(--hextech-accent), 0.5);
}

.game-container {
  position: relative;
  z-index: 1;
}

.power-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
  color: var(--hextech-primary);
  height: 24px;
  width: 100%;
  justify-content: center;
}

.power-key {
  background: var(--hextech-light);
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: bold;
  border: 1px solid var(--hextech-primary);
  box-shadow: 0 0 10px rgba(var(--hextech-primary), 0.3);
}

.power-description {
  font-size: 1.1rem;
  text-shadow: 0 0 10px rgba(var(--hextech-primary), 0.5);
}

.power-cooldown {
  color: var(--hextech-secondary);
  font-size: 1.1rem;
  margin-top: 0.5rem;
  text-shadow: 0 0 10px rgba(var(--hextech-secondary), 0.5);
  height: 24px;
  text-align: center;
  position: absolute;
  bottom: 80px;
  width: 100%;
}

.music-controls {
  margin-top: 1rem;
}

.music-button {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  font-family: 'Rajdhani', sans-serif;
  font-weight: bold;
  background: linear-gradient(45deg, var(--hextech-accent), var(--hextech-primary));
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  text-shadow: 0 0 5px rgba(0,0,0,0.5);
}

.music-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 20px rgba(var(--hextech-accent), 0.5);
}

.best-score {
  font-size: 2rem;
  font-weight: bold;
  color: var(--hextech-primary);
  text-shadow: 0 0 15px var(--hextech-primary);
  margin-bottom: 1rem;
  text-align: center;
  letter-spacing: 2px;
}

.fireworks-canvas {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 2;
}

.game-container {
  position: relative;
}

.game-canvas {
  position: relative;
  z-index: 1;
}

.sound-button {
  width: 40px;
  height: 40px;
  padding: 8px;
  background: var(--hextech-light);
  border: 1px solid var(--hextech-primary);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sound-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 20px rgba(var(--hextech-primary), 0.3);
}

.sound-icon {
  width: 24px;
  height: 24px;
  fill: var(--hextech-primary);
  transition: all 0.3s ease;
}

.sound-button.sound-off .sound-icon {
  fill: var(--hextech-accent);
}

.buttons {
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: center;
}

.start-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.start-button:disabled:hover {
  transform: none;
  box-shadow: none;
}

.start-button:disabled .button-shine {
  display: none;
}
</style> 
<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import axios from 'axios'
import { Vue3Lottie } from 'vue3-lottie'
import runnerAnimation from "@/assets/runner_second.json";

const config = reactive({
  speed: 1
})

const isDev = ref(import.meta.env.DEV)

// Для отображения в интерфейсе
const currentOrigin = ref(window.location.origin)

// Определяем API URL на основе текущего хоста
const getApiUrl = () => {
  const currentHost = window.location.hostname
  const currentProtocol = window.location.protocol

  // Если не localhost, используем тот же IP но порт 5017
  if (currentHost !== 'localhost' && currentHost !== '127.0.0.1') {
    return `${currentProtocol}//${currentHost}:5017`
  }

  // Для localhost используем стандартный URL
  return 'http://localhost:5017'
}

const loggedIn = ref(false)
const loginLoading = ref(false)
const initialLoading = ref(false)
const activities = ref<any[]>([])
const user = ref<{
  firstName: string
  lastName: string
  totalCoins: number
  coinsUpdatedTime: string
  avatar_url: string
} | null>(null)

const fetchUserData = async (token: string) => {
  try {
    const res = await axios.get(`${getApiUrl()}/user`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    user.value = res.data
  } catch (err) {
    console.error('Ошибка получения данных пользователя', err)
  } finally {
    initialLoading.value = false
  }
}

const handleLogin = async () => {
  loginLoading.value = true
  try {
    // Используем текущий хост автоматически
    const currentHost = window.location.origin
    const redirectUri = encodeURIComponent(currentHost)
    console.log('Используем redirect_uri:', currentHost)

    const res = await fetch(`${getApiUrl()}/auth/strava/redirect?redirect_uri=${redirectUri}`)
    if (!res.ok) {
      const text = await res.text()
      console.error('Ошибка от backend:', text)
      loginLoading.value = false
      return
    }
    const data = await res.json()
    window.location.href = data.url

  } catch (error) {
    console.error('Ошибка при попытке входа:', error)
    loginLoading.value = false
  }
}

const handleLogout = () => {
  localStorage.removeItem('access_token')
  activities.value = []
  loggedIn.value = false
}

onMounted(() => {
  const token = localStorage.getItem('access_token')
  if (token) {
    loggedIn.value = true
    fetchUserData(token)
  } else {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    if (code) {
      initialLoading.value = true

      axios.post(`${getApiUrl()}/auth/strava`, { code }).then((res) => {
        const token = res.data.access_token
        localStorage.setItem('access_token', token)
        loggedIn.value = true
        fetchUserData(token)
      }).catch((error) => {
        console.error('Ошибка авторизации:', error)
        initialLoading.value = false
      })
    }
  }
})
</script>

<template>
  <div class="app-container">
    <div class="content-wrapper">
      <div v-if="initialLoading" class="login-card">
        <div class="loading-container">
          <div class="loading-spinner"></div>
          <p class="loading-text">Завершение авторизации...</p>
        </div>
      </div>

      <div v-else-if="!loggedIn" class="login-card">
        <div class="login-content">
          <div class="app-icon">
            <span class="icon-emoji">🏃‍♂️</span>
          </div>
          <h1 class="app-title">StravaPet</h1>
          <p class="app-description">Превратите свои тренировки в награды</p>
        </div>

        <button @click="handleLogin" class="login-button" :disabled="loginLoading">
          <span v-if="!loginLoading">Войти через Strava</span>
          <span v-else class="login-loading">
            <span class="login-spinner"></span>
            Переход в Strava...
          </span>
        </button>
      </div>

      <div v-else class="profile-card">
        <div class="profile-header">
          <h2 class="profile-title">Ваш профиль</h2>
        </div>

        <div v-if="!user" class="loading-container">
          <div class="loading-spinner"></div>
          <p class="loading-text">Загрузка данных...</p>
        </div>

        <div v-else class="profile-content">
          <div v-if="isDev" class="dev-controls">
            <div class="speed-control">
              <label for="speed">Скорость анимации: {{ config.speed }}x</label>
              <input
                id="speed"
                type="range"
                min="0.1"
                max="3"
                step="0.4"
                v-model="config.speed"
                class="speed-slider"
              />
            </div>
          </div>

          <div class="user-info">
            <Vue3Lottie
              :animationData="runnerAnimation"
              :loop="true"
              :autoPlay="true"
              :speed="config.speed"
              class="lottie-animation"
            />
            <div class="user-profile">
              <img
                v-if="user.avatar_url"
                :src="user.avatar_url"
                :alt="`${user.firstName} ${user.lastName}`"
                class="user-avatar"
              />
              <h3 class="user-name">
                {{ user.firstName }} {{ user.lastName }}
              </h3>
            </div>
          </div>

          <div class="coins-section">
            <div class="coins-content">
              <span class="coins-icon">🪙</span>
              <div class="coins-info">
                <p class="coins-label">Всего монет</p>
                <p class="coins-value">{{ user.totalCoins }}</p>
              </div>
            </div>
          </div>

          <button @click="handleLogout" class="logout-button">
            Выйти
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Основной контейнер */
.app-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #fef7f0, #fed7aa);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  width: 100%;
}

.content-wrapper {
  width: 100%;
  max-width: 28rem;
  margin: 0 auto;
}

/* Адаптивные размеры для мобильных */
@media (max-width: 768px) {
  .app-container {
    padding: 0.5rem;
    align-items: flex-start;
    padding-top: 2rem;
  }

  .content-wrapper {
    max-width: none;
    width: 100%;
    padding: 0 0.5rem;
  }
}

/* Карточка входа */
.login-card {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  padding: 2rem;
  text-align: center;
  max-width: 400px;
  margin: 0 auto;
}

/* Адаптивные размеры карточки для мобильных */
@media (max-width: 768px) {
  .login-card {
    padding: 1.5rem;
    border-radius: 0.75rem;
    max-width: none;
    margin: 0;
  }
}

.login-content {
  margin-bottom: 2rem;
}

.app-icon {
  width: 4rem;
  height: 4rem;
  background: linear-gradient(135deg, #fb923c, #ea580c);
  border-radius: 50%;
  margin: 0 auto 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Адаптивные размеры иконки для мобильных */
@media (max-width: 768px) {
  .app-icon {
    width: 3rem;
    height: 3rem;
  }
}

@media (max-width: 480px) {
  .app-icon {
    width: 2.5rem;
    height: 2.5rem;
  }
}

.icon-emoji {
  font-size: 1.5rem;
}

/* Адаптивные размеры эмодзи для мобильных */
@media (max-width: 768px) {
  .icon-emoji {
    font-size: 1.25rem;
  }
}

@media (max-width: 480px) {
  .icon-emoji {
    font-size: 1rem;
  }
}

.app-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

/* Адаптивные размеры текста для мобильных */
@media (max-width: 768px) {
  .app-title {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .app-title {
    font-size: 1.25rem;
  }
}

.app-description {
  color: #6b7280;
}

.login-button {
  width: 100%;
  background: linear-gradient(135deg, #f97316, #ea580c);
  color: white;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.login-button:hover {
  background: linear-gradient(135deg, #ea580c, #c2410c);
  transform: scale(1.05);
}

.login-button:disabled {
  background: linear-gradient(135deg, #9ca3af, #6b7280);
  cursor: not-allowed;
  transform: none;
}

.login-loading {
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  margin-right: 0.5rem;
  animation: spin 1s linear infinite;
}

/* Карточка профиля */
.profile-card {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  max-width: 400px;
  margin: 0 auto;
}

/* Адаптивные размеры карточки профиля для мобильных */
@media (max-width: 768px) {
  .profile-card {
    max-width: none;
    margin: 0;
    border-radius: 0.75rem;
  }
}

.profile-header {
  background: linear-gradient(135deg, #f97316, #ea580c);
  padding: 1.5rem;
  text-align: center;
}

.profile-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
  margin: 0;
}

/* Загрузка */
.loading-container {
  padding: 2rem;
  text-align: center;
}

.loading-spinner {
  width: 2rem;
  height: 2rem;
  border: 3px solid #f97316;
  border-top: 3px solid transparent;
  border-radius: 50%;
  margin: 0 auto 1rem;
  animation: spin 1s linear infinite;
}

.loading-text {
  color: #6b7280;
  margin: 0;
}

/* Контент профиля */
.profile-content {
  padding: 1.5rem;
}

/* Адаптивные размеры контента для мобильных */
@media (max-width: 768px) {
  .profile-content {
    padding: 1rem;
  }
}

/* Dev контролы */
.dev-controls {
  background: #f3f4f6;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1.5rem;
  border: 2px dashed #d1d5db;
}

.speed-control {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.speed-control label {
  font-size: 0.875rem;
  color: #374151;
  font-weight: 500;
}

.debug-info {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #d1d5db;
}

.debug-info p {
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0.25rem 0;
  word-break: break-all;
}

.speed-slider {
  width: 100%;
  height: 4px;
  background: #d1d5db;
  border-radius: 2px;
  outline: none;
  appearance: none;
  -webkit-appearance: none;
}

.speed-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  background: #f97316;
  border-radius: 50%;
  cursor: pointer;
}

.speed-slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  background: #f97316;
  border-radius: 50%;
  cursor: pointer;
  border: none;
}

.user-info {
  text-align: center;
  margin-bottom: 1.5rem;
}

.user-profile {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 1rem;
}

/* Адаптивные размеры профиля для мобильных */
@media (max-width: 768px) {
  .user-profile {
    gap: 0.5rem;
  }
}

@media (max-width: 480px) {
  .user-profile {
    flex-direction: column;
    gap: 0.5rem;
  }
}

/* Адаптивные размеры Lottie анимации */
.lottie-animation {
  width: 200px;
  height: 200px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .lottie-animation {
    width: 150px;
    height: 150px;
  }
}

@media (max-width: 480px) {
  .lottie-animation {
    width: 120px;
    height: 120px;
  }
}

.user-avatar {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  border: 3px solid #fed7aa;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  object-fit: cover;
}

/* Адаптивные размеры аватара для мобильных */
@media (max-width: 768px) {
  .user-avatar {
    width: 2.5rem;
    height: 2.5rem;
    border-width: 2px;
  }
}

@media (max-width: 480px) {
  .user-avatar {
    width: 2rem;
    height: 2rem;
  }
}

.user-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

/* Секция монет */
.coins-section {
  background: linear-gradient(135deg, #fef7f0, #fed7aa);
  border-radius: 0.75rem;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.coins-content {
  display: flex;
  align-items: start;
  justify-content: space-around;
}

.coins-icon {
  font-size: 1.5rem;
  margin-right: 0.5rem;
}

.coins-info {
  text-align: center;
}

.coins-label {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0 0 0.25rem 0;
}

.coins-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ea580c;
  margin: 0;
}

/* Кнопка выхода */
.logout-button {
  width: 100%;
  background: #f3f4f6;
  color: #374151;
  font-weight: 500;
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.logout-button:hover {
  background: #e5e7eb;
}

/* Анимация загрузки */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>

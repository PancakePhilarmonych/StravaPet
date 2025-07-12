<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

const loggedIn = ref(false)
const activities = ref<any[]>([])

const fetchActivities = async (token: string) => {
  try {
    const res = await axios.get('http://localhost:3001/activities', {
      headers: { Authorization: `Bearer ${token}` }
    })
    activities.value = res.data
  } catch (err) {
    console.error('Ошибка получения активностей', err)
  }
}

const handleLogin = async () => {
  const redirectUri = encodeURIComponent('http://localhost:5017/')
  const res = await fetch(`http://localhost:3001/auth/strava/redirect?redirect_uri=${redirectUri}`)
  if (!res.ok) {
    const text = await res.text()
    console.error('Ошибка от backend:', text)
    return
  }
  const data = await res.json()
  window.location.href = data.url
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
    fetchActivities(token)
  } else {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    if (code) {
      window.history.replaceState({}, document.title, '/')
      axios.post('http://localhost:3001/auth/strava', { code }).then((res) => {
        const token = res.data.access_token
        localStorage.setItem('access_token', token)
        loggedIn.value = true
        fetchActivities(token)
      })
    }
  }

})
</script>

<template>
  <div class="base min-h-screen bg-white flex flex-col items-center pt-20 px-4">
    <template v-if="!loggedIn">
      <h1 class="text-2xl font-bold mb-6">StravaPet</h1>
      <button @click="handleLogin" class="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded">
        Войти через Strava
      </button>
    </template>

    <template v-else>
      <h2 class="text-xl font-semibold mb-4">🏃‍♂️ Последние пробежки:</h2>

      <div v-if="activities.length === 0" class="text-gray-500 mb-4">Загрузка...</div>

      <div v-for="(act, index) in activities" :key="index" class="mb-4 w-full max-w-md text-left border-b pb-2">
        <p>📅 {{ new Date(act.start_date).toLocaleDateString() }}</p>
        <p>🏷 {{ act.name }}</p>
        <p>📏 {{ (act.distance / 1000).toFixed(2) }} км</p>
        <p>⏱ {{ Math.round(act.moving_time / 60) }} мин</p>
      </div>

      <button @click="handleLogout" class="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 mt-4 rounded">
        Выйти
      </button>
    </template>
  </div>
</template>

<style scoped>
.base {
  padding: 20px;
  height: 100vh;
  /* width: 100%; */
  overflow: auto;
}
</style>

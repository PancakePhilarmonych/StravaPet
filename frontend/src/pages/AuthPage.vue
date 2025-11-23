<template>
  <div v-if="isLoading">Загрузка...</div>
  <div v-else>
    AUTH LAYOUT
    ЛОГИНЬСФ
    <button @click="auth">AUTH</button>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const isLoading = ref(false);

onMounted(async () => {
  const code = route.query.code;

  if (code) {
    isLoading.value = true;

    try {
      const response = await fetch(`http://${window.location.hostname}:${import.meta.env.VITE_BACKEND_PORT}/auth/strava`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code  }),
      });

      const data = await response.json();

      if (data.session_token && data.user_id) {
        localStorage.setItem('session_token', data.session_token);
        localStorage.setItem('user_id', data.user_id);
        await router.push('/');

      } else {
        isLoading.value = false;
      }
    } catch {
      isLoading.value = false;
    }
  }
});

function auth() {
  const clientID = import.meta.env.VITE_STRAVA_CLIENT_ID;
  const href = window.location.href;

  window.location.href = 'http://www.strava.com/oauth/authorize?client_id=' + clientID + '&response_type=code&redirect_uri=' + href +'&approval_prompt=force&scope=read';
}

</script>
<style scoped></style>

<template>
  <main>
    <RouterView />
  </main>
  <nav>
    <RouterLink to="/home">Главная</RouterLink>
    <RouterLink to="/shop">Магазин</RouterLink>
    <button @click="logout">Выход</button>
  </nav>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

function logout() {
  localStorage.removeItem('session_token');
  localStorage.removeItem('user_id');
  router.push('/auth');
}
</script>


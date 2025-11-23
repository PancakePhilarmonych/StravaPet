<template>
  <div class="app-container">
    <main class="app-view">
      <RouterView />
    </main>
    <ChipComponent>
      <section class="app-controls">
        <nav class="app-navigation">
          <RouterLink to="/home">Main</RouterLink>
          <RouterLink to="/shop">Shop</RouterLink>
        </nav>
          <button class="logout" @click="logout">Log out</button>
      </section>
    </ChipComponent>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router';
import ChipComponent from '../components/ChipComponent.vue';

const router = useRouter();

function logout() {
  localStorage.removeItem('session_token');
  localStorage.removeItem('user_id');
  router.push('/auth');
}
</script>

<style lang="scss">
.app-container {
  padding: 14px;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.app-view {
  flex: 1;
  overflow-y: auto;
}

.app-controls {
  display: flex;
  justify-content: space-between;
  padding: 12px 20px;

  .app-navigation {
    display: flex;
    justify-content: flex-start;
    flex: 1;
    gap: 40px;
  }

  .router-link-active {
    font-weight: bold;
  }

  a, button {
    color: #FFFFFF;
    text-decoration: none;
    background: none;
    border: none;
    font-size: 16px;
    cursor: pointer;
  }
}
</style>


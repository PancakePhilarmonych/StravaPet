<script lang="ts" setup>
import { ref } from 'vue'

interface Activity {
  id: number
  type: 'walking' | 'running'
  distance?: number
  duration?: number
}

interface Activity {
  id: number
  type: 'walking' | 'running'
  distance?: number
  duration?: number
  score: number
}

const calculateScore = (type: 'walking' | 'running', distance = 0, duration = 0): number => {
  const baseScore = type === 'running' ? distance * 8 : distance * 3
  const timeBonus = duration > 60 ? 10 : 0
  return Math.round(baseScore + timeBonus)
}

const activities = ref<Activity[]>([
  { id: 1, type: 'walking', distance: 5, duration: 75, score: calculateScore('walking', 5, 75) },
  { id: 2, type: 'running', distance: 10, duration: 30, score: calculateScore('running', 10, 30) },
  { id: 3, type: 'walking', distance: 3, duration: 45, score: calculateScore('walking', 3, 45) },
])

</script>
<template>
  <div class="last-activities">
    <h2>Last Activities</h2>
    <ul>
      <li v-for="activity in activities" :key="activity.id">
        <span v-if="activity.type === 'walking'">🚶‍♂️</span>
        <span v-else-if="activity.type === 'running'">🏃‍♂️</span>
        {{ activity.type }} -
        <span v-if="activity.distance">{{ activity.distance }} km</span>
        <span v-if="activity.duration">, {{ activity.duration }} min</span>
        <span class="score">{{ activity.score }} баллов</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.last-activities {
  background: #f9f9f9;
  padding: 16px;
  border-radius: 8px;
  margin-top: 24px;
  color: black;
}

.score {
  margin-left: 8px;
  font-weight: bold;
  color: #4caf50;
}
</style>

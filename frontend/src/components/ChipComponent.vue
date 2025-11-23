<template>
  <div class="chip-wrapper" :class="theme" >
    <slot/>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';

withDefaults(defineProps<{ theme?: 'grey' | 'dark' }>(), {
  theme: 'grey',
});

</script>

<style scoped lang="scss">
.chip-wrapper {
  display: inline-block;
  padding: 8px 12px;
  min-height: 40px;
  border-radius: 16px;
  font-size: 14px;
  color: #FFFFFF;
  border: 1px solid #464646;

  &.grey {
    background-color: #303030;
  }

  &.dark {
    background-color: #2A2A2A;
  }
}
</style>

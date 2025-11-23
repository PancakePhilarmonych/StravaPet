<template>
  <section class="header">
    <div class="meta-wrapper">
      <ChipComponent>
        <div class="balance-wrapper">
          <div class="title">Balance:</div>
          <div class="value">99</div>
        </div>
      </ChipComponent>
      <ChipComponent>
        <div class="age-wrapper">
          <div class="title">Level:</div>
          <div class="value">10</div>
        </div>
      </ChipComponent>
    </div>
    <div class="account-wrapper">
      <ChipComponent>
        <div class="title">John John</div>
      </ChipComponent>
      <div class="avatar">
        <img src="https://plus.unsplash.com/premium_photo-1739786996022-5ed5b56834e2?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="">
      </div>
    </div>
  </section>
</template>
<script lang="ts" setup>
import ChipComponent from '../components/ChipComponent.vue';

</script>
<style scoped lang="scss">
.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.account-wrapper {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.meta-wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.age-wrapper {
  display: flex;
  align-items: center;
  gap: 6px;
}

.balance-wrapper {
  display: flex;
  align-items: center;
  gap: 6px;
}

.avatar {
  border-radius: 50%;
  overflow: hidden;
  width: 40px;
  height: 40px;
  border: 1px solid #464646;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>

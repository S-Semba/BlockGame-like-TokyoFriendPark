<template>
  <div>
    <h2>Game Over 記録は{{ stage }}連単でした</h2>
    <button v-on:click="initMath" class="btn btn-secondary">
      もう一回やる
    </button>
  </div>
</template>

<script>
export default {
  name: "GameOver",
  props: {
    initMath: Function,
    stage: Number,
  },
};
</script>

<style scoped>
.btn-primary {
  margin-right: 10px;
}
.btn-secondary {
  margin-left: 10px;
}
</style>

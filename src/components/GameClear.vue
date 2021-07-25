<template>
  <div>
    <h2>Congratulations 全クリ達成です</h2>
    <button v-on:click="initMath" class="btn btn-secondary">
      もう一回やる
    </button>
  </div>
</template>

<script>
export default {
  name: "GameClear",
  props: {
    initMath: Function,
  },
};
</script>

<style scoped>
.btn-success {
  margin-right: 10px;
}
.btn-secondary {
  margin-left: 10px;
}
</style>

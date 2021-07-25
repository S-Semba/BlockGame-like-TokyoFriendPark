<template>
  <div>
    <button v-on:click="functionsOnButtonClick.initMath" class="btn btn-secondary">
      最初からやり直す
    </button>
    <button v-on:click="functionsOnButtonClick.goToTop" class="btn btn-secondary">
      トップに戻る</button
    ><br /><br />
    <p>ブロックはCtrlキーでも止まります</p>
    <button
      v-on:click="functionsOnButtonClick.initMath"
      v-if="isGameOver || isAllClear"
      class="btn btn-outline-primary btn-lg"
    >
      もう一回やる
    </button>
    <button
      v-on:click="functionsOnButtonClick.stopBlock"
      v-else
      class="btn btn-outline-primary btn-lg"
    >
      ブロックを止める
    </button>
  </div>
</template>

<script>
export default {
  name: "OnPlayHeader",
  props: {
    functionsOnButtonClick: Object,
  },
  computed: {
    isGameOver() {
      return this.$store.getters.isGameOver;
    },
    isAllClear() {
      return this.$store.getters.isAllClear;
    },
  }
};
</script>

<style scoped>
.btn-secondary {
  margin-left: 10px;
  margin-right: 10px;
}
</style>

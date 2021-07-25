<template>
  <div>
    <button v-on:click="initMath" class="btn btn-primary">
      始める
    </button>
    <h5>
      ブロックを止めて繋げていき、右の壁まで到達したらクリア
    </h5>
    <img src="@/assets/description.jpg" />
  </div>
</template>

<script>
export default {
  name: "TopPageHeader",
  data() {
    return {
    }
  },
  props: {
    initMath: Function,
  }
};
</script>

<style scoped>
h5 {
  margin-top: 30px;
  margin-bottom: 30px;
}
img {
  width: 400px;
  height: 320px;
}
.btn-primary {
  margin-right: 10px;
}
.btn-secondary {
  margin-left: 10px;
}
</style>

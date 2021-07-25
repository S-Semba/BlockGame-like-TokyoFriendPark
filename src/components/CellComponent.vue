<template>
    <div>
      <li v-for="(cells, index) in displayTable" :key="index" class="animate__animated"
        :class = "{animate__bounce : isBounce}" v-show="isStart">
        <span v-for="(cell, index) in cells" :key="index" :class="getColor(cell)"></span>
      </li>
    </div>
</template>

<script>
export default {
  name: 'CellComponent',
  props: {
    displayTable: Array,
  },
  computed: {
    isStart() {
      return this.$store.getters.isStart;
    },
    isBounce() {
      return this.$store.getters.isBounce;
    }
  },
  methods: {
    getColor: function(cell) {
      if (cell === -1) return "blue";
      if (cell === 1) return "yellow";
    },
  }
}
</script>

<style scoped>
li {
  text-align: center;
  list-style: none;
  height: 25px;
}
span {
  height: 25px;
  width: 25px;
  display: inline-block;
  background: gainsboro;
  border: 1px solid white;
  box-sizing: border-box;
}
.blue {
  background: linear-gradient(45deg, #000099, transparent);
}
.yellow{
  background: yellow;
}
</style>

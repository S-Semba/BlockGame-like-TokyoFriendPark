<template>
  <h3 class="animate__animated animate__bounce alert alert-info">
    ブロックを繋げるゲーム
  </h3>
  <div class="btn-start">
    <OnPlayHeader v-if="isStart" v-bind:="{functionsOnButtonClick}"></OnPlayHeader>
    <TopPageHeader v-else v-bind="{ initMath}"></TopPageHeader>
  </div>
  <CellComponent v-bind:="{displayTable}"></CellComponent>
  <br />
  <GameOver class="alert alert-danger" v-show="isGameOver" v-bind:="{initMath, stage}"></GameOver>
  <GameClear class="alert alert-warning" v-show="isAllClear" :initMath="initMath"></GameClear>
</template>

<script>
import OnPlayHeader from "./components/OnPlayHeader.vue";
import TopPageHeader from "./components/TopPageHeader.vue";
import CellComponent from "./components/CellComponent.vue";
import GameOver from "./components/GameOver.vue";
import GameClear from "./components/GameClear.vue";

export default {
  name: "App",
  components: {
    OnPlayHeader,
    TopPageHeader,
    CellComponent,
    GameOver,
    GameClear,
  },
  data() {
    return {
      displaySizeX: 6,//横のサイズ
      displaySizeY: 8,//縦のサイズ
      cellsTable: [],
      displayTable: [],
      fallMilliSecond: [150, 80, 50, 30, 20, 1],//[150, 80, 50, 30, 20, 1]
      fallBlocks: [
        [[0, 0],[1, 0],[2, 0], [3, 0],[4, 0],],
        [[0, 1], [1, 1], [2, 1], [3, 1], ],
        [[0, 2],[1, 2], [2, 2],],
        [[0, 3], [1, 3], [2, 3],],
        [[0, 4],[1, 4],],
        [[0, 5]],
      ],
      currentYX: [],
      registerList: [],
      movingBlockColor: 1, //yellowBlock
      moveDirection: 1, //上下どっちにいくか 下：1 上：-1
      stage: 0,
      timer_id_list: [],
      functionsOnButtonClick:{//OnPlayHeaderに渡す関数をまとめる
        initMath:this.initMath, goToTop:this.goToTop, stopBlock:this.stopBlock 
      }
    };
  },
  computed: {
    score() {
      if (this.stage === 6) {
        return "全クリ";
      } else {
        return this.stage + "連単";
      }
    },
    isBounce() {
      return this.$store.getters.isBounce;
    },
    isStart() {
      return this.$store.getters.isStart;
    },
    isAllClear() {
      return this.$store.getters.isAllClear;
    },
    isGameOver() {
      return this.$store.getters.isGameOver;
    },
  },
  methods: {
    initMath() {
      //clearTimeout(this.timer_id)
      //clearInterval(this.timer_id)
      //ブロックを止めるのを二回連続押したりすると、裏でsetIntervalが走り続けたため、配列にしてリセット時に全て削除できるようにした
      while (this.timer_id_list.length > 0) {
        clearInterval(this.timer_id_list.shift());
      }

      //console.log("initbefore stage",this.stage)
      this.stage = 0;
      //console.log("initafter stage",this.stage)
      this.$store.dispatch("UpdateIsAllClear", false);
      this.$store.dispatch("UpdateIsGameOver", false);

      this.cellsTable = [];
      for (let i = 1; i <= this.displaySizeY; i++) {
        this.cellsTable.push(Array(this.displaySizeX).fill(-1));
      }
      this.displayTable = this.cellsTable;
      this.createNewBlock();
      this.autoFall();
      this.$store.dispatch("UpdateIsStart", true);
    },
    // 引数の情報からブロックの存在している座標を返す
    getBlock(y, x, usableBlocks) {
      return usableBlocks.map(function(cell) {
        return [y + cell[0], x + cell[1]];
      });
    },
    updateDisplay() {
      // 位置が確定したブロック情報を転写
      this.displayTable = JSON.parse(JSON.stringify(this.cellsTable));

      // 操作中のブロック情報を転写
      let block = this.getBlock(
        this.currentYX[0],
        this.currentYX[1],
        this.fallBlocks[this.stage]
      );
      //console.log("block",block)
      //console.log("currentYX",this.currentYX)

      //一つずれた分を背景に戻す
      if (this.moveDirection === 1) {
        let reverseBlock = [block[0][0] - 1, block[0][1]];
        //console.log("reverseBlock",reverseBlock)
        if (this.fallBlocks[this.stage].length < block.slice(-1)[0][0] + 1) {
          this.cellsTable[reverseBlock[0]][reverseBlock[1]] = -1;
        }
      } else if (this.moveDirection === -1) {
        let reverseBlock = [block.slice(-1)[0][0] + 1, block[0][1]];
        //console.log("reverseBlock",reverseBlock)
        if (this.fallBlocks[this.stage].length < 8 - block[0][0]) {
          this.cellsTable[reverseBlock[0]][reverseBlock[1]] = -1;
        }
      }

      //底に完全にもぐりこんだ時の挙動
      if (this.moveDirection === 1 && block[0][0] === 8) {
        //console.log("もぐりこんだ")
        this.moveDirection *= -1;
        return;
      } else if (this.moveDirection === -1 && block.slice(-1)[0][0] === -1) {
        //console.log("天井に溶け込んだ")
        this.moveDirection *= -1;
        return;
      }

      //底についたときの挙動
      if (block.slice(-1)[0][0] >= 8) {
        let repeat = block.slice(-1)[0][0] - 7;
        //console.log("底についた")
        for (let i = 1; i <= repeat; i++) {
          block.pop();
        }
      }

      //天井についたときの挙動
      if (block[0][0] <= -1) {
        let repeat = -1 * block[0][0];
        //console.log("天についた")
        for (let i = 1; i <= repeat; i++) {
          block.shift();
        }
      }

      //移動中ブロックの色を反映させる
      block.forEach((cell) => {
        this.cellsTable[cell[0]][cell[1]] = this.movingBlockColor;
      });
    },
    createNewBlock() {
      // 操作中のブロック位置を初期化
      let startPoint = this.fallBlocks[this.stage].length;
      this.currentYX = [-1 * startPoint, 0];
      this.updateDisplay();
    },
    moveBlock(moveY) {
      // 操作後の座標位置
      let nextYX = [this.currentYX[0] + moveY, this.currentYX[1]];
      // 操作後のブロック情報
      // let nextBlock = this.getBlock(
      // 	nextYX[0],
      // 	nextYX[1],
      // 	this.fallBlocks[this.stage]
      // );
      this.currentYX = nextYX;
      // 描画用テーブルを更新
      this.updateDisplay();
    },
    autoFall() {
      // fallMilliSecond で指定した間隔で繰り返す Intervalの時は.bind(this)が必要になる
      //this.timer_id = setInterval(function() {this.moveBlock(this.moveDirection)}.bind(this), this.fallMilliSecond[this.stage]);
      this.timer_id_list.push(
        setInterval(
          function() {
            this.moveBlock(this.moveDirection);
          }.bind(this),
          this.fallMilliSecond[this.stage]
        )
      );

      //Timeoutだと、2回目以降のキーダウン操作で、一番最初の列なのにjudgeが2回呼び出されて、
      //ブロックが動いたままになるというエラーがあったため、setIntervalにしたらなおった

      // ブロックを１マス落下させる
      //this.moveBlock(this.moveDirection)
      // fallMilliSecond で指定した間隔分待って再帰呼び出しする
      //this.timer_id = setTimeout(this.autoFall, this.fallMilliSecond[this.stage])
    },
    deleteInvalidBlock() {
      this.cellsTable = this.displayTable;
      //外れたブロックを落とす
      for (let i = 0; i < this.displaySizeY; i++) {
        let checkLow = this.cellsTable[i].slice(0, this.stage + 1);
        //console.log("checkLow",checkLow)
        if (checkLow.includes(-1) && this.cellsTable[i][this.stage] === 1) {
          this.cellsTable[i][this.stage] = -1;
        }
      }
    },
    judge() {
      //現段階でOKかどうか判定する
      let judgeList = [];
      //今止めた所にブロックが残っているかどうか確認
      this.cellsTable.forEach((low) => {
        judgeList.push(low.slice(this.stage, this.stage + 1)[0]);
      });
      //console.log("judgeList",judgeList)
      //console.log("stage",this.stage)
      if (judgeList.includes(1)) {
        //成功していた時
        this.stage += 1;
        if (this.stage === 6) {
          this.$store.dispatch("UpdateIsAllClear", true);
        } else {
          this.createNewBlock();
          this.autoFall();
        }
      } else {
        //失敗していた時
        this.$store.dispatch("UpdateIsGameOver", true);
      }
    },
    goToTop() {
      //autoFallを停止させ、トップページに戻る
      while (this.timer_id_list.length > 0) {
        clearInterval(this.timer_id_list.shift());
      }
      this.$store.dispatch("UpdateIsStart", false);
      this.$store.dispatch("UpdateIsAllClear", false);
      this.$store.dispatch("UpdateIsGameOver", false);
      this.$store.dispatch("UpdateIsRegisterForm", false);
    },
    stopBlock() {
      //ブロックを止めるボタンを押したときの挙動
      //clearTimeout(this.timer_id)//autoFallを止める
      //clearInterval(this.timer_id)
      clearInterval(this.timer_id_list.shift());

      //ブロックを止めた時に振動する操作 非同期処理で震えてから、ブロックを落とすようにする
      this.shakeCells(1000);//下記のasyncのmethodsを使用 下のようなコールバック関数のみで書くこともできる
      
      // (async () => { //従来のコールバック関数の場合、await/asyncでは使えないので、Promiseで囲むために外側を（）で囲む必要がある。
      //   this.isBounce = true;
      //   await sleep(1000);
      //   this.isBounce = false;
      //   this.deleteInvalidBlock();
      //   this.judge();
      // })();
    },
    sleep(msec){ //msecの時間だけ待つsleep関数
      return new Promise((resolve) => setTimeout(resolve, msec));
    },  
    async shakeCells(waitMsec) { 
        this.$store.dispatch("UpdateIsBounce", true);
        await this.sleep(waitMsec);
        this.$store.dispatch("UpdateIsBounce", false);
        this.deleteInvalidBlock();
        this.judge();
    },
  },
  mounted() {
    document.onkeydown = function(e) {
      // EnterやSpaceだと、1回押しても日本語入力時は2回押したことになり、judgeが2回実行されてしまうため、Ctrlキーにした
      //keydownとkeypressでそれぞれ反応するしないなどもある
      if (e.keyCode === 17 && !(this.isGameOver || this.isAllClear)) {
        this.stopBlock();
      }
    }.bind(this);
  },
};
</script>

<style>
.btn-start {
  text-align: center;
  margin-bottom: 20px;
}
h1,
h3 {
  text-align: center;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  margin-top: 8px;
}
</style>

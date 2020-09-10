<!--
 * @Descripttion: 陈品富写的demo描述
 * @version: 1.0
 * @Author: chenpinfu~陈品富
 * @Date: 2020-09-11 00:50:15
 * @LastEditors: chenpinfu~陈品富
 * @LastEditTime: 2020-09-11 00:54:20
-->
<template>
  <div class="process-wrapper" :class="{'addGray':addGray}">
    <div ref="processChild" class="process-child">
      <p class="process-animate" :class="{'addGray':addGray}" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    addGray: {
      // 置灰
      type: Boolean,
      default: false
    },
    progressWidth: {
      // 进度条百分比
      type: Number,
      default: 10
    }
  },
  mounted() {
    this.$nextTick(() => {
      console.log(this.addGray, 'addGray---')
      this.$refs.processChild.style.width = this.progressWidth + '%' // 动态改变进度条
      // this.$refs.processChild.style.width = 90 + "%"; 测试效果
    })
  }
}
</script>

<style lang="less" scoped>
.process-wrapper {
  width: 19.8rem;
  height: 3rem;
  margin: 0.12rem 0 0.1rem 0;
  border-radius: 1rem;
  background: #fff;
  border: 0.01rem solid #ff6780;
  &.addGray {
    background: #999;
    border: 0.01rem solid #999;
  }
  .process-child {
    position: relative;
    height: 100%;
    // width: 100%;  //这个width就是动态变化。通过js改变
    border-radius: inherit;
    .process-animate {
      background: #ff6780;
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      border-radius: inherit;
      animation: process 1s linear forwards;
      &.addGray {
        background: #999 !important;
        // border: 0.01rem solid #999;
      }
    }
  }
}

@keyframes process {
  0% {
    left: 0;
    right: 100%;
  }
  20% {
    right: 80%;
  }
  40% {
    right: 60%;
  }
  60% {
    right: 40%;
  }
  80% {
    right: 20%;
  }
  100% {
    right: 0;
  }
}
</style>

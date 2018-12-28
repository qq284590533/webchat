<template>
  <div class="select-box">
    <div class="shade"></div>
    <div class="select-box-content">
      <div class="left">
        <ul class="left-list">
          <li>
            <img class="avatar" :src="'/static/images/contact.png'" alt="">
            <p class="nick">测试测试测试测试测试测试测试lin</p>
            <span class="button checkbox"></span>
          </li>
          <li>
            <img class="avatar" :src="'/static/images/contact.png'" alt="">
            <p class="nick">测试测试测试测试测试测试测试lin</p>
            <span class="button checkbox"></span>
          </li>
          <li>
            <img class="avatar" :src="'/static/images/contact.png'" alt="">
            <p class="nick">测试测试测试测试测试测试测试lin</p>
            <span class="button checkbox"></span>
          </li>
          <li>
            <img class="avatar" :src="'/static/images/contact.png'" alt="">
            <p class="nick">测试测试测试测试测试测试测试lin</p>
            <span class="button checkbox"></span>
          </li>
          <li>
            <img class="avatar" :src="'/static/images/contact.png'" alt="">
            <p class="nick">测试测试测试测试测试测试测试lin</p>
            <span class="button checkbox"></span>
          </li>
          <li>
            <img class="avatar" :src="'/static/images/contact.png'" alt="">
            <p class="nick">测试测试测试测试测试测试测试lin</p>
            <span class="button checkbox"></span>
          </li>
          <li>
            <img class="avatar" :src="'/static/images/contact.png'" alt="">
            <p class="nick">测试测试测试测试测试测试测试lin</p>
            <span class="button checkbox"></span>
          </li>
          <li>
            <img class="avatar" :src="'/static/images/contact.png'" alt="">
            <p class="nick">测试测试测试测试测试测试测试lin</p>
            <span class="button checkbox"></span>
          </li>
          <li>
            <img class="avatar" :src="'/static/images/contact.png'" alt="">
            <p class="nick">测试测试测试测试测试测试测试lin</p>
            <span class="button checkbox"></span>
          </li>
          <li>
            <img class="avatar" :src="'/static/images/contact.png'" alt="">
            <p class="nick">测试测试测试测试测试测试测试lin</p>
            <span class="button checkbox"></span>
          </li>
        </ul>
      </div>
      <div class="right">
        <ul class="left-list">
          <li>
            <img class="avatar" :src="'/static/images/contact.png'" alt="">
            <p class="nick">测试lin</p>
            <span class="button delete"></span>
          </li>
          <li>
            <img class="avatar" :src="'/static/images/contact.png'" alt="">
            <p class="nick">测试测试测试测试测试测试测试lin</p>
            <span class="button delete"></span>
          </li>
          <li>
            <img class="avatar" :src="'/static/images/contact.png'" alt="">
            <p class="nick">测试测试测试测试测试测试测试lin</p>
            <span class="button delete"></span>
          </li>
        </ul>
        <div class="button-box">
          <button class="ok">确定</button>
          <button class="cancel">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return {
      text:'选择列表'
    }
  }
}
</script>

<style lang="stylus" scoped>
  .select-box
    position absolute
    left 0
    top 0
    display flex
    justify-content center
    align-items center
    width 100%
    height 100%
    z-index 10000
    .shade
      position absolute
      width 100%
      height 100%
    .select-box-content
      position relative
      display flex
      z-index 1
      background #fff;
      border-radius 5px
      box-shadow 0 0 15px #aaa
      width 500px
      height 460px
      &>div
        padding 20px 0
        flex 1
        &.left
          overflow-y scroll
          li:hover
            cursor pointer
            background #ddd
        &.right
          ul
            height 390px
            overflow-y scroll
          .button-box
            height 50px
            display flex
            align-items center
            justify-content flex-end
            button
              border none
              border-radius 3px
              width 60px
              height 30px
              font-size 12px
              margin-right 20px
              &.ok
                background #56bd54
                color #fff
                &:hover
                  background #0bbb07
              &.cancel:hover
                  background #ccc
        li
          display flex
          padding 10px 20px
          align-items center
          .avatar
            width 40px
            margin-right 10px
          .nick
            width 140px
            padding-right 10px
            font-size 14px
            line-height 40px
            overflow hidden
            text-overflow ellipsis
            white-space nowrap
          .button
            display block
            width 20px
            height 20px
            &.checkbox
              background url('/static/images/checkbox.png');
              background-size cover
              &.checked
                background url('/static/images/checkbox_checked.png');
                background-size cover
            &.delete
              background url('/static/images/delete_ico.png');
              background-size cover
              cursor pointer
              &:hover
                background url('/static/images/delete_ico_hover.png');
                background-size cover
      .left
        border-right 1px solid #ddd


</style>


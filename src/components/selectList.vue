<template>
  <div class="select-box" v-show="isShow">
    <div class="shade"></div>
    <div class="select-box-content">
      <div class="left">
        <div class="left-list">
          <div v-if="groupList.length">
            <p class="title">群组列表</p>
            <ul>
              <li v-for="(item,index) in groupList" :key="index" @click="select(item)">
                <img class="avatar" :src="item.avatar" alt>
                <p class="nick">{{item.nick}}</p>
                <span
                  :class="['button', 'checkbox', item.selected?'checked':'', item.disable?'disable':'']"
                ></span>
              </li>
            </ul>
          </div>
          <div v-if="userList.length">
            <p class="title">好友列表</p>
            <ul>
              <li v-for="(item,index) in userList" :key="index" @click="select(item)">
                <img class="avatar" :src="item.avatar" alt>
                <p class="nick">{{item.nick}}</p>
                <span :class="['button', 'checkbox', item.selected?'checked':'', item.disable?'disable':'']"></span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="right">
        <p class="text">已选择了{{selectedContactList.length}}个联系人</p>
        <ul class="left-list">
          <li v-for="(item,index) in selectedContactList" :key="index" @click="select(item)">
            <img class="avatar" :src="item.avatar" alt>
            <p class="nick">{{item.nick}}</p>
            <span class="button delete"></span>
          </li>
        </ul>
        <div class="button-box">
          <button class="ok" @click="ok">确定</button>
          <button class="cancel" @click="cancel">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedContactList: [],
      groupList: [],
      userList: [],
			listDataCopy: [],
    };
  },
  watch: {
    isShow(newval, oldval) {
      if (!newval) {
        this.selectedContactList = [];
        this.groupList = [];
        this.userList = [];
        this.listDataCopy = [];
      } else {
        this.listDataCopy = JSON.parse(JSON.stringify(this.listData));
        this.listDataCopy.forEach(item => {
          if (!item.selected) {
            item["selected"] = false;
          }
          if (item.type == "user") {
            this.userList.push(item);
          } else {
            this.groupList.push(item);
          }
        });
      }
		},
		selectedContactList(newval,oldval){
			if(this.checktype == 'radio' ) {
				if(newval.length){
					this.userList.forEach(item => {
						if(!item.disable&&item.uid!=newval[0].uid){
							item.disable = true
							this.userList.push()
						}
					});
				}else{
					this.userList.forEach(item => {
						if(item.disable){
							item.disable = false
							this.userList.push()
						}
					});
				}
			};
		}
  },
  props: {
    listData: {
      type: Array,
      default: () => []
    },
    isShow: {
      type: Boolean,
      default: false
		},
		checktype:{
			type: String,
			default: 'checkbox'
		}
  },
  methods: {
    ok() {
      this.$emit("onensure", this.selectedContactList);
    },
    cancel() {
      this.$emit("oncancel");
    },
    select(item) {
      if (item.disable) return;
      if (!item.selected && !item.disable) {
        this.selectedContactList.push(item);
      } else {
        let uid = item.uid;
        for (let i = 0; i < this.selectedContactList.length; i++) {
          if (this.selectedContactList[i].uid == uid) {
            this.selectedContactList.splice(i, 1);
            break;
          }
        }
      }
      item.selected = !item.selected;
    }
  }
};
</script>

<style lang="stylus" scoped>
.select-box {
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  z-index: 10000;

  .shade {
    position: absolute;
    width: 100%;
    height: 100%;
  }

  .select-box-content {
    position: relative;
    display: flex;
    z-index: 1;
    background: #fff;
    border-radius: 5px;
    box-shadow: 0 0 15px #aaa;
    width: 520px;
    height: 460px;

    &>div {
      padding: 20px 0;
      flex: 1;

      &.left {
        overflow-y: auto;

        li:hover {
          cursor: pointer;
          background: #ddd;
        }

        .title {
          padding: 0 20px;
          line-height: 20px;
        }
      }

      &.right {
        .text {
          padding: 0 20px 10px;
        }

        ul {
          height: 370px;
          overflow-y: scroll;
        }

        .button-box {
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: flex-end;

          button {
            border: none;
            border-radius: 3px;
            width: 60px;
            height: 30px;
            font-size: 12px;
            margin-right: 20px;

            &.ok {
              background: #56bd54;
              color: #fff;

              &:hover {
                background: #0bbb07;
              }
            }

            &.cancel:hover {
              background: #ccc;
            }
          }
        }
      }

      li {
        display: flex;
        padding: 10px 20px;
        align-items: center;

        .avatar {
          width: 40px;
          margin-right: 10px;
        }

        .nick {
          width: 140px;
          padding-right: 10px;
          font-size: 14px;
          line-height: 40px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .button {
          display: block;
          width: 20px;
          height: 20px;
					&.delete {
						background: url('/static/images/delete_ico.png');
						background-size: cover;
						cursor: pointer;
						&:hover {
							background: url('/static/images/delete_ico_hover.png');
							background-size: cover;
						}
					}
					&.checkbox {
						background: url('/static/images/checkbox.png');
						background-size: cover;
						&.disable {
							background: url('/static/images/checkbox_disable2.png');
							background-size: cover;
						}
						&.checked {
							background: url('/static/images/checkbox_checked.png');
							background-size: cover;
							&.disable {
								background: url('/static/images/checkbox_disable.png');
								background-size: cover;
							}
						}
					}
        }
      }
    }
    .left {
      border-right: 1px solid #ddd;
    }
  }
}
</style>


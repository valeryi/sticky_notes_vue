<template>
  <transition name="slide-fade">
    <div v-if="show" class="snackBar">
      <span class="msg">{{ msg }}</span>
      <div class="controllers" v-if="callback">
        <span class="btn cancel" @click.prevent="cancel">Cancel</span>
        <span class="btn action" @click.prevent="action">{{ actionName }}</span>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "SnackBar",
  data() {
    return {
      show: false,
      msg: "",
      callback: null,
      actionName: "",
      fadeOutTime: 4000,
      $unwatch: null,
      timeout: null
    };
  },
  created() {
    this.$snack = this.$store.watch(
      (state, getters) => getters["snackBar/state"],
      (update, previous) => {
        const { msg, callback, actionName } = update;

        if (msg.length) {
          this.clean();
          this.msg = msg;
          this.callback = callback;
          this.actionName = actionName;
          this.show = true;

          this.timeout = setTimeout(this.clean, this.fadeOutTime);
        }
      }
    );
  },
  methods: {
    clean() {
      this.show = false;
      clearTimeout(this.timeout);
      this.$store.commit("snackBar/setSnack", {});
      this.timeout = null;
    },
    cancel() {
      this.clean();
    },
    action() {
      this.callback();
      this.clean();
    }
  },
  beforeDestroy() {
    this.$snack();
  }
};
</script>

<style lang="scss">
.snackBar {
  position: fixed;
  z-index: 1000;
  left: 50%;
  bottom: 70px;
  transform: translateX(-50%);
  max-width: 400px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 25px;
  margin: 0 15px;
  background-color: lighten($primary-color, 10%);
  color: #fff;
  font-size: 0.7em;
  border-radius: 20px;
  transition: all 0.3s ease-in-out;

  .controllers {
    display: flex;
  }

  .btn {
    padding: 5px 10px;
    border: 2px solid;
    border-radius: 5px;
    margin: 0 5px;
    text-transform: uppercase;
    transition: all 0.3s ease-in-out;
    font-weight: bold;
    font-size: 0.8em;
    transition: all 0.3s ease-in-out;
    display: flex;

    &:hover {
      transform: scale(0.95);
    }
  }

  .msg {
    margin: 0 10px;
  }

  .action {
    border-color: $accent-color;
    color: $accent-color;
  }

  .cancel {
    border-color: $accent-contrast-color;
    color: $accent-contrast-color;
  }
}

.slide-fade-enter-active {
  transition: all 0.3s ease;
}

.slide-fade-leave-active {
  transition: all 0.5s ease-in-out;
}

.slide-fade-enter,
.slide-fade-leave-to {
  bottom: -15px;
  opacity: 0;
}
</style>
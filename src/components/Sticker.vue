<template>
  <div class="sticker-view">
    <div
      class="sticker-wrapper"
      v-for="(note, index) in getNotes"
      :key="note.id"
      :style="{'transform': `rotate(${note.angle ? note.angle : 2}deg)`}"
    >
      <div class="sticker">
        <div class="sticker-front">
          <span class="title">{{ note.title }}</span>
          <ul class="todos">
            <li v-for="todo in uncompleted[index].slice(0, visibleNumber)" :key="todo.id">
              <svg class="check-icon" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <circle r="9" cx="10" cy="10" />
              </svg>
              <span class="todo-title">{{ todo.title }}</span>
            </li>

            <ul class="details">
              <li
                class="hidden"
                v-if="uncompleted[index].length > visibleNumber"
              >{{ `+ ${uncompleted[index].length - visibleNumber} hidden tasks` }}</li>
              <li
                class="done"
                v-if="completed[index].some(todo => todo.done)"
              >{{ `${completed[index].length} completed` }}</li>
            </ul>
          </ul>
        </div>
        <div class="sticker-back">
          <svg
            class="edit-icon"
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            viewBox="0 0 24 24"
            width="24"
            @click="editTask(note)"
          >
            <path
              d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
            />
          </svg>
          <svg
            class="delete-icon"
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            viewBox="0 0 24 24"
            width="24"
            @click="deleteTask(note)"
          >
            <path
              d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5l-1-1h-5l-1 1H5v2h14V4z"
            />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      visibleNumber: 5
    };
  },
  computed: {
    ...mapGetters({
      getNotes: "notes/getNotes"
    }),
    completed() {
      return this.getNotes.map((note, index) => note.list.filter(todo => todo.done));
    },
    uncompleted() {
      return this.getNotes.map((note, index) => note.list.filter(todo => !todo.done));
    }
  },
  methods: {
    ...mapMutations({
      setSnack: "snackBar/setSnack"
    }),
    ...mapActions({
      resetHistory: "history/reset"
    }),
    deleteTask(note) {
      this.setSnack({
        msg: `Are you sure?`,
        callback: () => {
          this.$store.dispatch("notes/delete", note);
        },
        actionName: "Delete"
      });
    },
    editTask(note) {
      this.resetHistory();
      this.$router.push({ name: "Edit", params: { noteId: note.id } });
    }
  }
};
</script>

<style lang="scss">
.sticker-view {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  padding: 15px;
}

.sticker-wrapper {
  position: relative;
  z-index: 10;
  background-color: transparent;
  min-width: $sticky-note-min-width;
  max-width: $sticky-note-max-width;
  height: $sticky-note-height;
  perspective: 1000px;
  translate: all 0.3s ease-in-out;
  transition-delay: 0.2s;
  margin: 10px;

  &:hover {
    transform: rotate(0deg) !important;

    .sticker {
      transform: scale(0.8) rotateY(180deg);
    }
  }

  .sticker {
    position: relative;
    width: 100%;
    height: 100%;
    transition: transform 0.6s;
    transform-style: preserve-3d;
  }

  .sticker-front,
  .sticker-back {
    position: absolute;
    z-index: 13;
    width: 100%;
    height: 100%;
    @include prefix(backface-visibility, hidden);
    border-radius: 10px;
    margin: $note-gap;
    padding: 15px 15px 10px 15px;
    background-color: $sticky-note-color;
    overflow: hidden;
    outline: 1px solid transparent; // antialiasing rotation in moz

    &::after {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 11;
      background: url(../assets/note-texture.png) calc(100% - 20px)
        calc(100% - 10px);
      background-size: cover;
    }
  }
}

.sticker-back {
  transform: rotateY(180deg);
  display: flex;
  justify-content: space-around;
  align-items: center;

  &::before {
    content: "";
    position: absolute;
    z-index: 11;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba($color: #000000, $alpha: 0.5);
  }

  .delete-icon {
    border-color: $accent-color;
    fill: $accent-color;
  }

  .edit-icon {
    border-color: $accent-contrast-color;
    fill: $accent-contrast-color;
  }

  svg {
    position: relative;
    z-index: 13;
    width: $sticker-btn-size;
    height: $sticker-btn-size;
    border-radius: 50%;
    padding: 9px;
    transition: transform 0.2s ease-in-out;
    border: 3px solid;

    &:hover {
      transform: scale(1.2);
    }

    &:active {
      transform: scale(1);
    }
  }
}

.sticker-front {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
  z-index: 10;

  .title {
    display: flex;
    width: 100%;
    padding-bottom: 5px;
    font-weight: bold;
    font-size: 0.7em;
    text-transform: capitalize;
  }

  .todos {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    font-weight: 300;
    font-size: 0.7em;
    padding-top: 5px;

    li {
      padding: 5px 0;
      display: flex;
      align-content: center;

      .check-icon {
        width: 10px;
        height: 10px;
        stroke-width: 1;
        stroke: $primary-color;
        fill: transparent;
      }

      .todo-title {
        max-width: $sticky-note-min-width - 20px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding: 0 7px;
      }
    }
  }

  .details {
    font-size: 0.6rem;
    font-weight: 600;
    display: flex;
    align-items: flex-start;

    li {
      padding-left: 5px;
      display: flex;

      &:first-child {
        padding-left: 0;
      }
    }
  }
}
</style>
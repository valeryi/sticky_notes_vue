<template>
  <div class="edit" @keydown.ctrl.z.prevent.exact="goBack" @keydown.ctrl.z.shift.prevent.exact="goForth" v-focus>
    <div class="note-edit-wrapper">
      <span class="note-title">{{ getEditable && getEditable.title }}</span>

      <section class="todo-list">

        <ul v-if="getEditable && getEditable.list.length">
          <li v-for="todo in getEditable.list" :key="todo.id" :class="todo.done ? 'completed' : null">

            <!-- check icon start -->
            <span class="todo-check" @click.prevent="toggleTaskState(todo)">
              <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                <path v-if="todo.done" transform="scale(.5) translate(9, 10)" fill="#fff" d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
                <circle r="8" cy="11" cx="11" stroke="#fff" stroke-width="2" fill="transparent" />
              </svg>
            </span>

            <!-- todo task start -->
            <span v-if="!editableId || editableId !== todo.id" class="todo-title">
              <span @click.prevent="!todo.done ? editTitle(todo) : null">{{ todo.title }}</span>
              <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" @click.prevent="deleteTodo(todo.id)">
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5l-1-1h-5l-1 1H5v2h14V4z" />
              </svg>
            </span>

            <!-- Editable form start -->
            <span v-if="editableId && editableId === todo.id" class="todo-edit">
              <input type="text" v-model="editableTitle" @keyup.enter="updateTitle(todo)" v-focus @blur="onBlur" />
            </span>

          </li>
        </ul>

        <div class="empty" v-else>
          <span>No ToDos so far ;(</span>
        </div>

      </section>

      <section class="add-todo">
        <input type="text" v-model.trim="addInput" placeholder="add one more" @keyup.enter="addInput && addInput.length && add(addInput)" />
        <div class="actions">
          <button class="save" @click="saveNote">save</button>
          <button class="cancel" @click="cancelNote">cancel</button>
          <button class="delete" @click="deleteNote">delete</button>
        </div>
      </section>

    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import idb from "@/api/idb";

export default {
  name: "Edit",
  data() {
    return {
      noteId: null,
      addInput: null,
      editableId: null,
      titleUpdate: "",
      editableTitle: "",
      $history: null
    };
  },
  directives: {
    focus: {
      inserted: function(el) {
        el.setAttribute("tabindex", 0);
        el.focus();
      }
    },
  },
  async beforeMount() {
    this.noteId = this.$route.params.noteId;
    const idbNotes = await idb.get("notes");
    const note = idbNotes.find(note => note.id == this.noteId);

    await this.initEdit(note);
  },
  mounted() {

    // watching for todos' changes and updating the state accordingly
    this.$history = this.$store.subscribeAction({
      after: (action, state) => {
        if (/todos\//i.test(action.type)) {
          this.updateHistory(this.getEditable);
        }
      }
    });
  },
  computed: {
    ...mapGetters({
      getEditable: "todos/getEditable",
      getNotes: "notes/getNotes"
    })
  },
  methods: {
    ...mapMutations({
      setSnack: "snackBar/setSnack",
      setEditable: "todos/setEditable"
    }),
    ...mapActions({
      addTodo: "todos/add",
      updateTodo: "todos/update",
      deleteTodo: "todos/delete",
      initEdit: "todos/initEdit",
      syncNotes: "notes/sync",
      updateNote: "notes/update",
      destroyNote: "notes/delete",
      updateHistory: "history/update",
      resetHistory: "history/reset",
      goBack: "history/back",
      goForth: "history/forth"
    }),
    onBlur() {
      this.editableTitle = null;
      this.editableId = null;
    },
    clean() {
      this.addInput = null;
      this.editable = null;
      this.setEditable(null);
      this.resetHistory();
    },
    async saveNote() {
      await this.updateNote(this.getEditable);
      this.$router.push({ name: "Home" });
    },
    cancelNote() {
      this.setSnack({
        msg: "Really wanna cancel?",
        callback: () => {
          this.clean();
          this.$router.push({ name: "Home" });
        },
        actionName: "Yes!"
      });
    },
    deleteNote() {
      this.setSnack({
        msg: "Wanna delete it?",
        callback: async () => {
          this.destroyNote(this.getEditable);
          this.clean();
          this.$router.push({ name: "Home" });
        },
        actionName: "Yes!"
      });
    },
    add(title) {
      this.addTodo(title);
      this.addInput = null;
    },
    editTitle(todo) {
      const { id } = todo;

      this.editableTitle = this.getEditable.list.find(todo => todo.id === id).title;
      this.editableId = id;
    },
    updateTitle(todo) {
      const { id, title, done } = todo;

      this.updateTodo({ id, title: this.editableTitle, done });
      this.editableId = null;
    },
    toggleTaskState(todo) {
      const { id, title, done } = todo;

      this.editable = null;
      this.updateTodo({ id, title, done: !done });
    }
  },
  beforeDestroy() {
    this.$history();
    this.clean();
  }
};
</script>

<style lang='scss' scoped>
.edit {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 90vh;
  position: relative;
  z-index: 15;

  &:focus {
    outline: none;
  }

  .note-edit-wrapper {
    max-width: 800px;
    color: #fff;
    border: 1px solid rgba($color: #fff, $alpha: 0.1);
    border-radius: 10px;
    padding: 10px 15px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .note-title {
      font-size: 1em;
      padding-bottom: 15px;
      text-transform: uppercase;
    }

    .todo-list {
      display: flex;
      flex-direction: column;
      align-items: flex-center;
      justify-content: space-between;

      .empty {
        align-self: center;
        font-size: .8;
        color: rgba($color: #fff, $alpha: .2);
        padding: 25px 0;
      }

      li {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        justify-items: flex-start;
        align-items: center;
        width: 100%;
        padding: 7px 5px;
        margin: 3px 0;
        border-radius: 10px;
        background-color: lighten($color: $primary-color, $amount: 10%);
        transition: all 0.3s ease-in-out;

        span {
          display: flex;
          flex-direction: row;
          font-size: 0.7rem;
          margin-left: 2px;
          transition: all 0.3s ease-in-out;

          &:first-child {
            margin-left: 0;
          }

          &.todo-check {
            justify-content: center;
            flex: 1;
          }

          &.todo-title {
            justify-content: space-between;
            align-items: center;
            align-content: stretch;
            flex: 9;
            width: 100%;

            svg {
              width: 20px;
              height: 20px;
              fill: $accent-color;
              margin-right: 10px;

              &:active {
                transform: scale(0.95);
              }
            }

            &:hover {
              cursor: pointer;
            }
          }

          &.todo-edit {
            justify-content: space-between;
            align-items: center;
            flex: 9;

            input {
              background-color: lighten($color: $primary-color, $amount: 10%);
              border: none;
              color: $accent-contrast-color;
              width: 100%;
              padding-right: 20px;
              font-size: 0.7rem;
              padding: 10px 20px 10px 0;
              vertical-align: center;

              &:focus {
                outline: none;
              }
            }

            svg {
              border: none;
              background-color: $accent-contrast-color;
              color: #fff;
              font-weight: bold;
              text-transform: uppercase;
              width: 20px;
              height: 20px;
              border-radius: 50%;
              margin-right: 10px;

              &:focus {
                outline: none;
              }

              &:active {
                outline: none;
                transform: scale(0.95);
              }
            }
          }
        }
      }
    }

    .add-todo {
      padding-top: 15px;
      display: flex;
      flex-direction: column;

      input {
        width: 100%;
        padding: 10px 20px;
        font-size: 0.8em;
        line-height: 0.9em;
        border-radius: 20px;
        border: none;
        background-color: lighten($color: $primary-color, $amount: 10%);
        transition: all 0.3s ease-in-out;
        color: $accent-contrast-color;
        opacity: 0.3;

        &:focus {
          outline: none;
          background-color: lighten($color: $primary-color, $amount: 20%);
          opacity: 1;
        }
      }

      .actions {
        margin-top: 20px;
        display: flex;
        justify-content: space-between;

        button {
          border: none;
          border-radius: 10px;
          padding: 7px 15px;
          font-size: .8em;
          font-weight: bold;
          margin-left: 15px;
          transition: all .2s ease-in-out;

          &.save {
            background-color: rgb(59, 151, 59);
          }

          &.cancal {
            background-color: rgb(7, 137, 160);
          }

          &.delete {
            background-color: $accent-contrast-color;
          }

          &:first-child {
            margin-left: 0;
          }
          
          &:focus {
            outline: none;
          }

          &:active {
            transform: scale(.95);
          }
        }

      }
    }
  }
}

.completed {
  text-decoration: line-through;
  opacity: 0.3;
}
</style>

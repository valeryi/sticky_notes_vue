<template>
  <div class="createNote">
    <input @keydown.enter.prevent="inputValidity && CreateNote()" type="text" v-model.trim="input" placeholder="What's your next note about?" />
    <button class="submit-input" :disabled="!inputValidity" @click.prevent="CreateNote()">Create</button>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: "CreateNote",
  data() {
    return {
        input: ''
    };
  },
  computed: {
    inputValidity() {
      return this.input.length && /[a-zA-Z]+/i.test(this.input);
    }
  },
  methods: {
    ...mapActions({
      addNote: "notes/add",
      resetHistory: "history/reset"
    }),
    async CreateNote() {
      const min = -5;
      const max = 5;

      const createdNote = {
        title: this.input,
        list: [],
        angle: Math.random() * (min - max) + max
      };

      this.resetHistory();
      const created = await this.addNote(createdNote);
      this.$router.push({ name: "Edit", params: { noteId: created.id } });
      this.input = "";
    }
  }
};
</script>

<style lang="scss">

 .createNote {
    width: 70vh;
    position: fixed;
    bottom: 15px;
    z-index: 13;
    display: flex;
    justify-self: flex-end;
    align-self: center;

    input,
    button {
      font-size: 0.8em;
    }

    input {
      width: 100%;
      background-color: lighten($primary-color, 5%);
      border: none;
      border-radius: 20px;
      padding: 10px 15px;
      line-height: 1.2em;
      transition: all 0.3s ease-in-out;
      color: $accent-contrast-color;

      &:focus {
        background-color: lighten($primary-color, 15%);
        outline: none;
      }
    }

    button {
      margin: 0 7px;
      padding: 7px 14px;
      border-radius: 20px;
      border: none;
      background-color: $accent-contrast-color;
      font-weight: bold;
      transition: all 0.3s ease-in-out;
      text-transform: uppercase;
      font-size: 0.7rem;
      letter-spacing: 1px;

      &:disabled {
        background-color: lighten($primary-color, 5%);
      }

      &:active {
        transform: scale(0.95);
      }

      &:focus {
        outline: none;
      }
    }
  }

</style>
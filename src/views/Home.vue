<template>
  <div class="home">
    <Sticker v-if="getNotes.length" />

    <div class="empty" v-else>No notes so far ;(</div>

    <CreateNote />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Sticker from "@/components/Sticker";
import CreateNote from "@/components/CreateNote.vue";

export default {
  name: "Home",
  data() {
    return {
      visibleNumber: 5,
      $syncNotes: null
    };
  },
  async created() {
    await this.syncNotes();

    // watching any changes of notes and updating the app state accordingly
    this.$syncNotes = this.$store.subscribeAction({

      after: async (action, state) => {
        if (/notes/i.test(action.type) && !/notes\/sync/i.test(action.type)) {
          this.syncNotes();
        }
      }

    });
  },
  computed: {
    ...mapGetters({
      getNotes: "notes/getNotes"
    })
  },
  methods: {
    ...mapActions({
      syncNotes: "notes/sync"
    })
  },
  beforeDestroy() {
    this.$syncNotes();
  },
  components: {
    Sticker,
    CreateNote
  }
};
</script>

<style lang='scss'>
.home {
  min-height: 90vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-bottom: 70px;

  .empty {
    display: flex;
    align-self: center;
    justify-self: center;
  }
}
</style>

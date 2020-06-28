import idb from '@/api/idb'

export default {
    namespaced: true,
    state: {
        notes: [],
    },
    getters: {
        getNotes(state) {
            return state.notes;
        }
    },
    actions: {
        async update(_, editable) {
            await idb.update(editable, 'notes');
        },
        async delete(_, note) {
            await idb.delete(note, 'notes');
        },
        async add(_, note) {
            const created = await idb.save(note, 'notes');
            await idb.clear('history');
            return created;
        },
        async sync({ commit }) {
            const idbNotes = await idb.get('notes');
            commit("setNotes", idbNotes);
        }
    },
    mutations: {
        setNotes(state, notes) {
            state.notes = notes;
        }
    }
}
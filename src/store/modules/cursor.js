import idb from '@/api/idb';

export default {
    namespaced: true,
    state: {
        cursor: null,
    },
    getters: {
        position(state, _) {
            return state.cursor;
        }
    },
    actions: {
        async update({ commit }, updated) {
            await idb.update({ id: 1, cursor: updated }, 'cursor');
            commit("setCursor", updated);
        },
        async up({ dispatch }) {
            const cursor = await idb.get('cursor');
            const updated = cursor[0].cursor + 1;

            dispatch("update", updated);
        },
        async down({ dispatch }) {
            const cursor = await idb.get('cursor');
            const updated = cursor[0].cursor - 1;

            dispatch("update", updated);
        },
        reset({ commit }) {
            commit("setCursor", 0);
            idb.update({ id: 1, cursor: 0 }, 'cursor');
        }
    },
    mutations: {
        setCursor(state, position) {
            state.cursor = position;
        }
    }
}
import idb from '@/api/idb';

export default {
    namespaced: true,
    state: {
        history: [],
    },
    getters: {
        state: (state) => {
            return state.history;
        }
    },
    actions: {
        // cutting off snapshots saved in IndexedDB history (old history) which follow right after the new todos' event
        async slice({ rootGetters }) {
            const cursor = await idb.get('cursor');
            const previous = await idb.get('history');
            const refreshed = previous.slice(0, cursor[0].cursor + 1);
            await idb.clear('history');

            for (let i = 0; i < refreshed.length; i++) {
                const snapshot = refreshed[i];

                idb.save(snapshot, 'history');
            }
        },
        async update({ commit, dispatch, getters }, snapshot) {
            const previous = await idb.get('history');
            const cursor = await idb.get('cursor');
            const update = { snapshot, id: cursor[0].cursor };
            const updated = [...previous, update];

            if (cursor[0].cursor < previous.length) {
                dispatch("slice");
            }

            await idb.update(update, 'history');
            await dispatch("cursor/up", null, { root: true });
            commit("add", updated);

        },
        reset({ commit, dispatch }) {
            idb.clear('history');
            commit("destroy");
            dispatch("cursor/reset", null, { root: true });
        },
        async back({ commit, dispatch }) {
            const cursor = await idb.get('cursor');
            
            if (cursor[0].cursor > 1) {
                await dispatch("cursor/down", null, { root: true });

                const history = await idb.get('history');
                const newCursor = await idb.get('cursor');
                const previous = history[newCursor[0].cursor - 1].snapshot;

                commit("todos/setEditable", previous, { root: true });
            }
            
        },
        async forth({ commit, dispatch }) {
            const cursor = await idb.get('cursor');
            const history = await idb.get('history');

            if (cursor[0].cursor <= history.length) {

                if (cursor[0].cursor < history.length) {
                    await dispatch("cursor/up", null, { root: true });
                }

                const newCursor = await idb.get('cursor');
                const previous = history[newCursor[0].cursor - 1].snapshot;

                commit("todos/setEditable", previous, { root: true });
            }

        }
    },
    mutations: {
        destroy(state) {
            state.history = [];
        },
        add(state, updated) {
            state.history = [...updated];
        },
        updateCursor(state, cursor) {
            state.cursor = cursor;
        }
    }
}

import { createStore, EffectContext } from '@souche-f2e/muji';

type IState = {
  count: number;
};

const state: IState = {
  count: 0,
};

const store = createStore({
  state,
  reducers: {
    ADD(state: IState, payload: number) {
      state.count += payload;
    },
  },
  effects: {
    async add(
      payload: number,
      { update, state, rootState }: EffectContext<IState>,
    ) {
      await new Promise((r: any) => setTimeout(r, 1000));
      this.ADD(payload || 1);
    },
  },
});

export default store;

import {createStore} from "vuex";

export default createStore({
	//state:コンポーネントでいうdata
	state: {
		isBounce: false,
		isStart: false,
		isAllClear: false,
		isGameOver: false,
	},
	//getters:コンポーネントでいうcomputed的なもの
	getters: {
		//messageを使用するgetter
		isBounce(state) {
			return state.isBounce;
		},
		isStart(state) {
			return state.isStart;
		},
		isAllClear(state) {
			return state.isAllClear;
		},
		isGameOver(state) {
			return state.isGameOver;
		},
	},
	mutations: {
		setIsBounce(state, payload) {
			state.isBounce = payload;
		},
		setIsStart(state, payload) {
			state.isStart = payload;
		},
		setIsAllClear(state, payload) {
			state.isAllClear = payload;
		},
		setIsGameOver(state, payload) {
			state.isGameOver = payload;
		},
	},
	actions: {
		UpdateIsBounce({ commit }, payloadInAction) {
			commit("setIsBounce", payloadInAction);
		},
		UpdateIsStart({ commit }, payloadInAction) {
			commit("setIsStart", payloadInAction);
		},
		UpdateIsAllClear({ commit }, payloadInAction) {
			commit("setIsAllClear", payloadInAction);
		},
		UpdateIsGameOver({ commit }, payloadInAction) {
			commit("setIsGameOver", payloadInAction);
		},
	},
});

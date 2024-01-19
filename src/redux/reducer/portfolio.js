
import { SET_GRAPH, SET_MEMBER, LOG_OUT, CHECK_LOGIN, CHANGE_LOGIN } from '../actions/portfolio.actions'

const initState = {
    graphValue: null,
    isLoading: true,
    memberDetails: null,
    transactionShareIssuanceArray: null,
    isLogin: false
}

export default function Reducer(state = initState, action) {
    const { type, payload } = action
    switch (type) {
        case SET_GRAPH: return { ...state, graphValue: payload }
        case CHECK_LOGIN: return { ...state, isLoading: false, memberDetails: payload }
        case SET_MEMBER: return { ...state, memberDetails: payload, isLoading: false }
        case LOG_OUT: return { ...state, memberDetails: null }
        case CHANGE_LOGIN: return { ...state, isLogin: !state.isLogin }
        default:
            return state

    }
}
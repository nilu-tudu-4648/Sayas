
import { APPLICATION_MONEY, SHARES_FOR_MEMBER, TRANSACTION_APPLICATION } from '../actions/transaction.actions'
import {SET_DATAACQUISTION} from '../actions/dataAccution.actions'

const initState = {
    trasactionApplicationMoney: 0,
    trasactionApplicationArray: [],
    transactionShareIssuanceArray: [],
    dataAcqutions: []
}

export default function Reducer(state = initState, action) {
    const { type, payload } = action
    switch (type) {
        case APPLICATION_MONEY: return { ...state, trasactionApplicationMoney: payload }
        case TRANSACTION_APPLICATION: return { ...state, trasactionApplicationArray: payload }
        case SHARES_FOR_MEMBER: return { ...state, transactionShareIssuanceArray: payload }
        case SET_DATAACQUISTION: return { ...state, dataAcqutions: payload }
        default:
            return state

    }
}
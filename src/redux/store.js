import { createStore, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";
import Reducer from "./reducer/Reducer.js";
import portfolio from './reducer/portfolio';
import notification from "./reducer/notificationReducer.js";
const rootReducer = combineReducers({
    Reducer,
    portfolio,
    notification
})

export const Store = createStore(rootReducer, applyMiddleware(thunk))

import { UNREAD_NOTIFICATIONS, ALL_NOTIFICATIONS, NOTIFI_STATE, SET_NOTIFICATIONS, EMPTY_NOTIFICATIONS, NOTIFI_LENGTH, SAVE_SINGLE_BACK_NOTIFI } from '../actions/notifications.actions.js'

const initState = {
    initNotifications: [],
    singleBackNotifi: '',
    notifiState: false,
    allNotification: [],
    readNotifications: [],
    unreadNotifications: [],
}

export default function notificationReducer(state = initState, action) {
    const { type, payload } = action
    switch (type) {
        case SET_NOTIFICATIONS:
            return { ...state, initNotifications: [...state.initNotifications, payload] }
        case EMPTY_NOTIFICATIONS:
            return { ...state, initNotifications: [] }
        case NOTIFI_STATE:
            return { ...state, notifiState: !state.notifiState }
        case SAVE_SINGLE_BACK_NOTIFI:
            return { ...state, singleBackNotifi: payload }
        case ALL_NOTIFICATIONS:
            return { ...state, allNotification: payload }
        case UNREAD_NOTIFICATIONS:
            return { ...state, unreadNotifications: payload }
        default:
            return state

    }
}
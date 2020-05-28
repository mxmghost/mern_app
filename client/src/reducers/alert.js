import { SET_ALERT, REMOVE_ALERT } from "../actions/types";

const initialState = [];
// A function that take a initial state and an action
export default function (state = initialState, action) {
  // Action contain a mandatory type and an optional payload with data
  const { type, payload } = action;

  switch (type) {
    case SET_ALERT:
      return [...state, payload];
    case REMOVE_ALERT:
      return state.filter((alert) => alert.id !== payload);
    default:
      return state;
  }
}

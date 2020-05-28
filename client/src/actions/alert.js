import uuid from "uuid";
import { SET_ALERT, REMOVE_ALERT } from "./types";
// Because of the thunk middleware we just now have the posibility to dispatch two types of alerts
export const setAlert = (msg, alertType, timeout = 5000) => (dispatch) => {
  const id = uuid.v4();
  dispatch({
    type: SET_ALERT,
    payload: { msg, alertType, id },
  });

  setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), timeout);
};

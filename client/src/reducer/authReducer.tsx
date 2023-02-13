import { authState, authAction } from "../context/auth";

interface reducerMap {
  LOGIN: (state: authState, action: authAction) => authState;
  LOGOUT: (state: authState, action: authAction) => authState;
  STOP_LOADING: (state: authState, action: authAction) => authState;
}

// initialState
export const authInitialState = {
  authenticated: false,
  user: null,
  loading: true,
};

// reducerMap
export const authReducerMap: reducerMap = {
  LOGIN: (state, { payload }) => ({
    ...state,
    authenticated: true,
    user: payload,
  }),
  LOGOUT: (state) => ({
    ...state,
    authenticated: false,
    user: null,
  }),
  STOP_LOADING: (state) => ({
    ...state,
    loading: false,
  }),
};

// reducer
export const authReducer = (state: authState, action: authAction) =>
  authReducerMap[action.type]?.(state, action) || state;

import { authState, authAction } from "../context/auth";

// Keyof operator
export type authActionType = keyof typeof authReducerMap;

// Index Signature
export interface reducerMap {
  [key: string]: (state: authState, action: authAction) => authState;
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

import axios from "axios";
import { createContext, useContext, useEffect, useReducer } from "react";
import { authReducer, authInitialState } from "../reducer/authReducer";
import { User } from "../types";

// type
export interface State {
  authenticated: boolean;
  user: User | undefined;
  loading: boolean;
}

export interface Action {
  type: string;
  payload: any;
}

// createContext
const StateContext = createContext<State>({
  authenticated: false,
  user: undefined,
  loading: true,
});

const DispatchContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, defaultDispatch] = useReducer(authReducer, authInitialState);

  const dispatch = (type: string, payload?: any) => {
    defaultDispatch({ type, payload });
  };

  console.log("state", state);

  //   useEffect(() => {
  //       async function loadUser() {
  //           try {
  //               const res = await axios.get("/auth/me");
  //               dispatch("LOGIN", res.data);
  //           } catch (error) {
  //               console.log(error)
  //           } finally {
  //               dispatch("STOP_LOADING");
  //           }
  //       }
  //       loadUser();
  //   }, [])

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  );
};

export const useAuthState = () => useContext(StateContext);
export const useAuthDispatch = () => useContext(DispatchContext);

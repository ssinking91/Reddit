import axios from "axios";
import { createContext, useContext, useEffect, useReducer } from "react";
import {
  authReducer,
  authInitialState,
  authActionType,
} from "../reducer/authReducer";
import { User } from "../types";

// type
export interface authState {
  authenticated: boolean;
  user: User | undefined | null;
  loading: boolean;
}

export interface authAction {
  type: authActionType;
  payload?: any;
}

// createContext
const StateContext = createContext<authState>({
  authenticated: false,
  user: undefined,
  loading: true,
});

const DispatchContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, defaultDispatch] = useReducer(authReducer, authInitialState);

  const dispatch = (type: authActionType, payload?: any) => {
    defaultDispatch({ type, payload });
  };

  console.log("state", state);

  // 로그인 후에는 로그인 페이지나 회원 가입 페이지에 들어가도 다시 메인 페이지로 돌아오게 만들기
  useEffect(() => {
    async function loadUser() {
      try {
        const res = await axios.get("/auth/me");
        console.log("/auth/me", res);
        dispatch("LOGIN", res.data);
        //
      } catch (error) {
        console.log(error);
        //
      } finally {
        dispatch("STOP_LOADING");
      }
    }

    loadUser();
  }, []);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  );
};

export const useAuthState = () => useContext(StateContext);
export const useAuthDispatch = () => useContext(DispatchContext);

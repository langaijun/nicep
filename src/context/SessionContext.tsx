import React, { createContext, useContext, useReducer, useCallback } from 'react';
import type { SessionData, UserState, PathType, ScreenId } from '@/types';

interface SessionState {
  currentScreen: ScreenId;
  currentPath: PathType;
  sessionData: SessionData;
  allowedCount: number;
}

type SessionAction =
  | { type: 'SET_SCREEN'; screen: ScreenId }
  | { type: 'SET_PATH'; path: PathType }
  | { type: 'SET_STATE'; state: UserState }
  | { type: 'SET_ACCEPT_TEXT'; text: string }
  | { type: 'SET_SPARK_TEXT'; text: string }
  | { type: 'SET_SPARK_BODY_TEXT'; text: string }
  | { type: 'SET_SOCRATIC_TEXT'; text: string }
  | { type: 'SET_DONE'; done: boolean }
  | { type: 'INCREMENT_ALLOWED' }
  | { type: 'RESET_SESSION' };

const initialSessionData: SessionData = {
  state: '',
  acceptText: '',
  sparkText: '',
  sparkBodyText: '',
  socraticText: '',
  done: false,
  timestamp: null,
};

const initialState: SessionState = {
  currentScreen: 'home',
  currentPath: '',
  sessionData: { ...initialSessionData },
  allowedCount: 0,
};

function sessionReducer(state: SessionState, action: SessionAction): SessionState {
  switch (action.type) {
    case 'SET_SCREEN':
      return { ...state, currentScreen: action.screen };
    case 'SET_PATH':
      return { ...state, currentPath: action.path };
    case 'SET_STATE':
      return { ...state, sessionData: { ...state.sessionData, state: action.state } };
    case 'SET_ACCEPT_TEXT':
      return { ...state, sessionData: { ...state.sessionData, acceptText: action.text } };
    case 'SET_SPARK_TEXT':
      return { ...state, sessionData: { ...state.sessionData, sparkText: action.text } };
    case 'SET_SPARK_BODY_TEXT':
      return { ...state, sessionData: { ...state.sessionData, sparkBodyText: action.text } };
    case 'SET_SOCRATIC_TEXT':
      return { ...state, sessionData: { ...state.sessionData, socraticText: action.text } };
    case 'SET_DONE':
      return { ...state, sessionData: { ...state.sessionData, done: action.done } };
    case 'INCREMENT_ALLOWED':
      return { ...state, allowedCount: state.allowedCount + 1 };
    case 'RESET_SESSION':
      return {
        ...initialState,
        currentScreen: 'home',
      };
    default:
      return state;
  }
}

interface SessionContextValue {
  state: SessionState;
  dispatch: React.Dispatch<SessionAction>;
  showScreen: (screen: ScreenId) => void;
  chooseState: (userState: UserState) => void;
  goHome: () => void;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(sessionReducer, initialState);

  const showScreen = useCallback((screen: ScreenId) => {
    dispatch({ type: 'SET_SCREEN', screen });
    window.scrollTo(0, 0);
  }, []);

  const chooseState = useCallback((userState: UserState) => {
    dispatch({ type: 'SET_STATE', state: userState });
    if (userState === 'noisy' || userState === 'empty') {
      dispatch({ type: 'SET_PATH', path: 'accept' });
      dispatch({ type: 'SET_SCREEN', screen: 'anchor' });
    } else {
      dispatch({ type: 'SET_PATH', path: 'spark' });
      dispatch({ type: 'SET_SCREEN', screen: 'spark' });
    }
  }, []);

  const goHome = useCallback(() => {
    dispatch({ type: 'RESET_SESSION' });
  }, []);

  return (
    <SessionContext.Provider value={{ state, dispatch, showScreen, chooseState, goHome }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}

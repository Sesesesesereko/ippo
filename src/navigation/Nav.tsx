// 画面の切り替え。試作では軽い自前の仕組みにしている。
// 画面ごとの部品（screens/）はそのまま使えるので、
// 将来 Expo Router などに移すときは、ここだけを置き換えればよい。
import React, { createContext, useContext, useState } from 'react';

export type Route =
  | { name: 'home' }
  | { name: 'tasks' }
  | { name: 'taskEdit'; taskId: string }
  | { name: 'focus' }
  | { name: 'routines' }
  | { name: 'data' };

interface NavValue {
  route: Route;
  push: (r: Route) => void;
  back: () => void;
  home: () => void;
  canGoBack: boolean;
}

const Ctx = createContext<NavValue | null>(null);

export function NavProvider({ children }: { children: React.ReactNode }) {
  const [stack, setStack] = useState<Route[]>([{ name: 'home' }]);
  const value: NavValue = {
    route: stack[stack.length - 1],
    push: (r) => setStack((s) => [...s, r]),
    back: () => setStack((s) => (s.length > 1 ? s.slice(0, -1) : s)),
    home: () => setStack([{ name: 'home' }]),
    canGoBack: stack.length > 1,
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useNav(): NavValue {
  const v = useContext(Ctx);
  if (!v) throw new Error('useNav は NavProvider の中で使ってください');
  return v;
}

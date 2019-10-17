import { createContext } from 'react';

const defaultRouterContext = {
  currentRoute: {},
};
const RouterContext = createContext<typeof defaultRouterContext>(
  defaultRouterContext,
);
export default RouterContext;

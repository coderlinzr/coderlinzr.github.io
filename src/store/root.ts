import { makeAutoObservable, configure } from "mobx";
import { createContext } from 'react';

class RootStore {
  constructor(props: any) {
    props && Object.assign(this, props);
    makeAutoObservable(this);
    configure({});
  }

  blogUrl: string = '';
}

const root: RootStore = new RootStore({});
export const rootStore = root;
const Content = createContext(root);
export default Content;


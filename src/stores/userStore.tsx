import { makeAutoObservable } from "mobx";

class UserStore {
  user = null;

  constructor() {
    makeAutoObservable(this);
  }

  setUser(user: any) {
    this.user = user;
  }

  get isLoggedIn() {
    return !!this.user;
  }
}

const userStore = new UserStore();
export default userStore;

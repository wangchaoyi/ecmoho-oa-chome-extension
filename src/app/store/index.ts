import { configure } from "mobx";

export { default as userStore, User } from "./modules/user";
export { default as approveStore, ApproveStore } from "./modules/approve";
export {
  default as addApproveStore,
  AddApproveStore
} from "./modules/approve-add";

// 强制在action里面进行操作
configure({
  enforceActions: true
});

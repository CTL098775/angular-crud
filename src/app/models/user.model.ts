// user
export interface User {
  id?: string;
  name: string;
  country: string;
  salary: number;
  email: string;
};
// 獲取user列表 傳參
export type GetUserListParams = {
  name?: string;
  country?: string;
  salary?: number | null;
  email?: string;
  id?: string;
}
// 新增user 傳參 
export type CreateUserParams = {
  name: string;
  country: string;
  salary: number;
  email: string;
}
// 編輯user 傳參
export type EditUserParams = {
  id: string;
  name: string;
  country: string;
  salary: number;
  email: string;
}
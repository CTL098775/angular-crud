import { Injectable } from '@angular/core';
import { from, Observable, tap } from 'rxjs';
import { AddUserParams, EditUserParams, GetUserListParams, User } from '../models/user.model';
import * as _ from 'lodash';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  mockUserList: User[] = [
    {
      name: 'Carl',
      country: 'Norway',
      salary: 5,
      email: 'Guithay65@gustr.com',
      id: '1'
    },
    {
      name: 'Jani',
      country: 'Norway',
      salary: 5,
      email: 'cluphetret@hotmail.com',
      id: '2'
    },
    {
      name: 'Margareth',
      country: 'England',
      salary: 5,
      email: 'phitrudreh@yahoo.com',
      id: '3'
    },
    {  
      name: 'Hege',
      country: 'Norway',
      salary: 15,
      email: 'thapripich@gmail.com',
      id: '4'
    },
    {
      name: 'Joe',
      country: 'Denmark',
      salary: 20,
      email: 'qakyssaxisu@yopmail.com',
      id: '5'
    }
  ]
  constructor(
  ) { }
  // 獲取全部user 
  getUserList(params: GetUserListParams): Observable<User[]> {
    return from(new Promise<User[]>((resolve,reject)=>{
      let result: User[] = _.clone(this.mockUserList);
      if(params.id) {
        result = result.find(p => p.id === params.id) ? [this.mockUserList.find(p => p.id === params.id)!] : [];
      }
      if(params.email) {
        result = result.filter(r => r.email.toLowerCase().includes(params.email!.toLowerCase()));
      }
      if(params.name) {
        result = result.filter(r => r.name.toLowerCase().includes(params.name!.toLowerCase()));
      }
      if(params.country) {
        result = result.filter(r => r.country.toLowerCase().includes(params.country!.toLowerCase()));
      }
      if(params.salary) {
        result = result.filter(r => (r.salary + '').includes(params.salary! + ''));
      }
      resolve(result);
    }));
  }
  // 新增user
  addUser(params: AddUserParams): Observable<boolean> {
    let user: User = {
      id: '',
      name: params.name,
      country: params.country,
      salary: params.salary,
      email: params.email
    }
    let id = Math.random().toString(36).substring(2, 18);
    const ids = this.mockUserList.map(p => p.id);
    while(ids.includes(id)) {
      id = Math.random().toString(36).substring(2, 18);
    }
    user.id = id;
    this.mockUserList.splice(0, 0, user);
    return from(new Promise<boolean>((resolve,reject)=>{
      resolve(true);
    }));
  }
  // 編輯user
  editUser(params: EditUserParams): Observable<boolean> {
    const user = this.mockUserList.find(p => p.id === params.id);
    if(user) {
      user.name = params.name;
      user.email = params.email;
      user.salary = params.salary;
      user.country = params.country;
    }
    return from(new Promise<boolean>((resolve,reject)=>{
      resolve(true);
    }));
  }
  // 刪除user
  deleteUser(id: string): Observable<boolean> {
    return from(new Promise<boolean>((resolve,reject)=>{
      resolve(true);
    })).pipe(
      tap(()=>{
        const index = this.mockUserList.findIndex(user => user.id === id);
        this.mockUserList.splice(index, 1);
      })
    );
  }
}

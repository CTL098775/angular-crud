import { Component } from '@angular/core';
import { OperateItem, TableColumnDef } from 'src/app/common-table/common-table.model';
import { CreateUserParams,EditUserParams, GetUserListParams, User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { MatDialog } from '@angular/material/dialog';
import * as _ from 'lodash'
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  // 列表 
  userList: User[] = [];
  // table欄位定義 
  tableColumnDefs!: TableColumnDef<User>[];
  // table動作定義 
  operateItems: OperateItem<User>[] = [];
  // Search 的參數 
  queryParams: GetUserListParams = {
    name: '',
    country: '',
    salary: null,
    email: '',
    id: ''
  }
  // Search參數 查詢列表用
  queryParamsForm: GetUserListParams = {
    name: '',
  }
  // 選擇Edit的資料
  selectUser?: User;
  // 表單類型（Edit或Add user） 
  formType!: 'Edit' | 'Create';
  // 是否顯示表單 
  visibleUserForm = false;

  formGroup!: FormGroup;
  get name(): FormControl {
    return this.formGroup.controls['name'] as FormControl;
  }
  get country(): FormControl {
    return this.formGroup.controls['country'] as FormControl;
  }
  get salary(): FormControl {
    return this.formGroup.controls['salary'] as FormControl;
  }
  get email(): FormControl {
    return this.formGroup.controls['email'] as FormControl;
  }
  constructor(
    private userService: UserService,
    public dialog: MatDialog
  ) {

  }
  ngOnInit(): void {
    this.setTableCoulumnDefs();
    this.setOperateItems();
    this.getUserList();
  }
  // 獲取user資料 
  getUserList(): void {
    this.userService.getUserList(this.queryParams).subscribe({
      next: (userList) => {
        this.userList = userList;
      }
    })
  }
  // Add user 
  createUser(user: User){
    const params: CreateUserParams = {
      name: user.name,
      country: user.country,
      salary: user.salary!,
      email: user.email
    }
    const subscripiton = this.userService.createUser(params).subscribe({
      next:(success) =>{
        // 新增成功後關閉跟重新查詢
        if(success){
          this.closeUserForm();
          this.getUserList();
        }
      },
      complete: ()=>{
        subscripiton.unsubscribe();
      }
    });
  }
  // Edit user資料 
  editUser(user: User){
    const params: EditUserParams = {
      id: user.id!,
      name: user.name,
      country: user.country,
      salary: user.salary!,
      email: user.email
    }
    const subscripiton = this.userService.editUser(params).subscribe({
      next:(success) =>{
        // 修改成功後關閉跟重新查詢 
        if(success){
          this.closeUserForm();
          this.getUserList();
        }
      },
      complete: ()=>{
        subscripiton.unsubscribe();
      }
    });
  }
  // delete user資料 
  deleteUser(id: string) {
    this.userService.deleteUser(id).subscribe({
      next: (success) => {
        // 刪除成功後重新查詢資料, 如果已經打開表單且剛好刪除該筆資料,則關閉表單 
        if(success) {
          if(this.selectUser && this.selectUser.id === id) {
            this.closeUserForm();
          }
          this.getUserList();
        }
      }
    });
  }

  setFormGroup(user: User) {
    this.formGroup = new FormGroup({
      name: new FormControl(user.name, Validators.required),
      country: new FormControl(user.country, Validators.required),
      salary: new FormControl(user.salary, [Validators.required]),
      email: new FormControl(user.email, [Validators.required, Validators.email, this.wordValidator('email')])
    });
  }
  // 定義table欄位 
  setTableCoulumnDefs(): void {
    this.tableColumnDefs = [
      {
        dataKey: 'name',
        headerNames: 'Name',
        widthOfTable: '80px'
      },
      {
        dataKey: 'country',
        headerNames: 'Country',
        widthOfTable: '80px'
      },
      {
        dataKey: 'salary',
        headerNames: 'Salary',
        widthOfTable: '80px'
      },
      {
        dataKey: 'email',
        headerNames: 'Email',
        widthOfTable: '200px'
      }
    ];
  }
  // 設定table動作 
  setOperateItems(): void {
    this.operateItems = [
      {
        name: 'Edit',
        handleOperate: (data: User) => {
          this.editUserForm(data);
        }
      },
      {
        name: 'Delete',
        handleOperate: (data: User) => {
          this.deleteUser(data.id!);
        }
      }
    ]
  }

  // 開啟table
  openUserForm() {
    this.visibleUserForm = true;
  }
  // 關閉table
  closeUserForm() {
    this.visibleUserForm = false;
    // 關閉時重置
    this.formGroup.reset();
  }
  // save跟upload
  submitForm(user: User, type: 'Edit' | 'Create') {
    console.log(type,user);
    if(type === 'Edit') {
      user.id = this.selectUser!.id;
      this.editUser(user);
    } else if(type === 'Create'){
      this.createUser(user);
    }
  }
  // 新增user表單 
  createUserForm() {
    const user: User = {
      name: '',
      country: '',
      salary: null,
      email: ''
    };
    // 新增user時, 將已選擇Edit的資料設置為空
    this.selectUser = undefined;
    this.formType = 'Create';
    this.setFormGroup(user)
    this.openUserForm();
  }
  // Edit 開啟
  editUserForm(user: User) {
    this.formType = 'Edit';
    this.selectUser = _.cloneDeep(user);
    this.setFormGroup(user);
    this.openUserForm();
  }
  // Search 
  advancedSearch() {
    this.queryParams.name = this.queryParamsForm.name;
    this.getUserList();
  }
  // 自定義驗證 有無重複值
  wordValidator(field: keyof User): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const inputValue: any = control.value;
      // 倘selectUser有資料,則過濾掉selectUser的資料
      const userList = this.selectUser ? this.userList.filter(p => p.id !== this.selectUser!.id) : _.cloneDeep(this.userList);
      const isDuplicate: boolean = userList.map(p => p[field]).includes(inputValue);

      if (isDuplicate) {
        return { uniqueValue: true }; // 自訂錯誤名稱為 uniqueValue
      } else {
        return null; // 驗證通過
      }
    };
  }
}

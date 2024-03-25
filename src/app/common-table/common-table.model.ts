import { TemplateRef } from '@angular/core';
import { CommonTableFieldTemplateDirective } from './common-table-field-template.directive';
export type OrNull<Type> = Type | null;
// 可用PickObj來取某物件中的某屬性的型別
export type PickObj<T, U extends keyof T> = T[U];
export interface ViewColumnDef<T> extends TableColumnDef<T> {
  fieldDirective: OrNull<CommonTableFieldTemplateDirective<T>>;
}
export interface TableColumnDef<T> {
  // 資料鍵
  dataKey: keyof T;
  // 欄位標題名稱
  headerNames: string;
  // 欄位長度
  widthOfTable: string;
  // 輸入框框長度
  widthOfInput?: string;
  // 欄位內名稱
  fieldName?: string;
  formatFunc?: (data: T) => string;
  fieldTemplate?: TemplateRef<any>;
  // 是否隱藏key
  hiddenKey?: boolean;
}

export type TableData<T> = {
  [key in keyof T]: PickObj<T, key>;
};

export interface OperateItem<TableData> {
  name: string;
  handleOperate: (data: TableData) => void;
}

export interface TableTemplateRefData<T> {
  $implicit: {
    data: any,
    index: number,
    rowData: T,
  };
  columnDef: TableColumnDef<T>;
}

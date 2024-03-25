import { Component, Input, Output, EventEmitter, SimpleChanges, ContentChildren, QueryList,
  ContentChild, OnChanges } from '@angular/core';
import { TableColumnDef, TableData, OperateItem, ViewColumnDef } from './common-table.model';
import { CommonTableFieldTemplateDirective } from './common-table-field-template.directive';
import * as _ from 'lodash';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-common-table',
  templateUrl: './common-table.component.html',
  styleUrls: ['./common-table.component.scss'],
})

export class CommonTableComponent<DataT> implements OnChanges {
  @ContentChildren(CommonTableFieldTemplateDirective)
  fieldTemplateDirectives!: QueryList<CommonTableFieldTemplateDirective<DataT>>;

  @ContentChild(CommonTableComponent)
  childTableTemplate!: CommonTableComponent<DataT>;

  // table 表的標頭資訊 
  @Input() tableColumnDefs: TableColumnDef<DataT>[] = [];
  @Input() dataPkKey!: keyof DataT;
  // table 資料
  @Input() tableData: TableData<DataT>[] = []; //表單資料
  @Input() pageSize = 5; // 單頁要顯示的資料數量(預設是5)
  @Input() pageIndex = 0; // 頁數最低為1
  @Input() dataTotalRows = 0; //資料總數
  @Input() tablePageOptions: number[] = [5, 10, 20, 30, 40]; // 選擇分頁
  @Input() operateItems: OperateItem<TableData<DataT>>[] = []; 
  @Input() showTotal = false; // 顯示總數
  @Input() totalField?: keyof DataT; // total的欄位名稱
  @Output() pageSizeChange = new EventEmitter<number>(); // 列表資料數量改變
  @Output() pageIndexChange = new EventEmitter<number>(); // 列表頁數改變
  @Output() pageChange = new EventEmitter<number>(); // 列表頁的動作

  viewData: TableData<DataT>[] = [];
  oldData: TableData<DataT>[] = [];
  viewColumnDefs: ViewColumnDef<DataT>[] = [];
  directiveFieldMap = new Map<string | number, CommonTableFieldTemplateDirective<DataT>>();
  fieldDirective: any;
  totalFieldIndex?: number; // 計算total的欄位
  total?: number; 

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void { const { tableData, tableColumnDefs } = changes;
  //  倘tableData發現新值，深度複製到viewData
    if (tableData && tableData.currentValue) {
      this.viewData = _.cloneDeep(this.tableData); // .cloneDeep是深複製用(3/20 daily會議提出)
      // 設定total index
      if(this.showTotal) {
        this.totalFieldIndex = this.viewColumnDefs.findIndex(columnDef => columnDef.dataKey === this.totalField);
        this.setTotal();
      }
    }
    if (tableColumnDefs && tableColumnDefs.currentValue) { this.viewColumnDefs = this._createViewTableCoumnDef();
    }
  }

  ngAfterContentInit(): void {
    this.fieldTemplateDirectives?.forEach((directive) => {
      this.directiveFieldMap.set(directive.dataKey, directive);
    });
    this.viewColumnDefs = this._createViewTableCoumnDef();
  }

  // 回傳一個view用的表單定義
  private _createViewTableCoumnDef(): ViewColumnDef<DataT>[] {
    return this.tableColumnDefs.map((columnDef: TableColumnDef<DataT>) => {
      const cloneDef: TableColumnDef<DataT> = _.cloneDeep(columnDef);
      const viewDef: ViewColumnDef<DataT> = {
        ...cloneDef,
        fieldDirective: this.directiveFieldMap.get(columnDef.dataKey as string) ?? null,
      };
      return viewDef;
    });
  }
  // ngFor使用, 表身使用 
  trackByFn(index: number, data: DataT): string {
    return String(data[this.dataPkKey]) ?? index; 
  }

  trackByFnIndex(index: number) {
    return index;
  }

  //頁數 單頁總數 變更事件
  pageChangeEvent(event: PageEvent, sendEvent=true) {
    if(this.pageSize !== event.pageSize) {
      this.pageSize = event.pageSize;
      this.pageSizeChange.emit(this.pageSize);
    }
    if(this.pageIndex !== event.pageIndex){
      this.pageIndex = event.pageIndex;
      this.pageIndexChange.emit(this.pageIndex);
    }
    if(this.showTotal) {
      this.setTotal();
    }
    if(sendEvent){
      this.pageChange.emit();
    }
  }

  //設定總數
  setTotal() {
    if(this.viewData.length) {
      const startIndex = this.pageIndex * this.pageSize;
      // 倘計算出的endIndex 超出資料長度, 則改為資料長度
      const endIndex = (this.pageIndex + 1) * this.pageSize > this.viewData.length ? this.viewData.length : (this.pageIndex + 1) * this.pageSize;
      // 整理出顯示在畫面上的資料的陣列(透過totalField去指定要計算哪個欄位)
      const numbers = this.viewData.slice(startIndex, endIndex).map(data => Number(data[this.totalField!]));
      if(numbers.length === 0  && this.pageIndex > 0){
        // 如果numbers為undefined且頁碼在第一頁以後
        this.pageChangeEvent({
          pageIndex: this.pageIndex - 1,
          pageSize: this.pageSize,
          length: this.viewData.length
        });
      } else if (numbers.length === 0 && this.pageIndex === 0) {
        // 如果numbers為undefined且頁碼在第一頁
        this.total = 0;
      } else {
        // 如果numbers正常有值
        this.total = numbers.reduce((a,b) => a + b);
      }
    } else {
      this.total = 0;
    }
  }
}

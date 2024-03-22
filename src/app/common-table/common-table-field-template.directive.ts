import { Directive, Input, TemplateRef, inject } from '@angular/core';
import { TableTemplateRefData } from './common-table.model';
@Directive({
  selector: '[appCommonTableFieldTemplate]'
})
export class CommonTableFieldTemplateDirective<T> {

  @Input() dataKey = '';
  constructor(public fieldTemplateRef: TemplateRef<TableTemplateRefData<T>>) { }


}

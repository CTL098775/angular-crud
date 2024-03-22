import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonTableComponent } from './common-table.component';
import { FormsModule } from '@angular/forms';
import { CommonTableFieldTemplateDirective } from './common-table-field-template.directive';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
@NgModule({
  declarations: [CommonTableComponent, CommonTableFieldTemplateDirective],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatPaginatorModule
  ],
  exports: [CommonTableComponent, CommonTableFieldTemplateDirective],
})
export class CommonTableModule {}

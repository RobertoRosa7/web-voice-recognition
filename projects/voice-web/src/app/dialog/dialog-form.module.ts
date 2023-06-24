import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DialogFormComponent } from './dialog-form.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { CurrencyMaskModule } from 'ng2-currency-mask';

@NgModule({
  declarations: [DialogFormComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    CurrencyMaskModule,
  ],
  entryComponents: [DialogFormComponent],
})
export class DialogFormModule {}

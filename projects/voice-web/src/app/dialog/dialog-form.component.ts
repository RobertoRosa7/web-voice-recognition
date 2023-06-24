import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product } from '../interfaces/product.interface';
import { MatDialogRef } from '@angular/material/dialog';
import { DIALOG_DATA } from '@angular/cdk/dialog';

@Component({
  selector: 'app-dialog-form',
  templateUrl: 'dialog-form.component.html',
  styleUrls: ['dialog-form.component.scss'],
})
export class DialogFormComponent implements OnInit {
  public form: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required]],
    price: [0, [Validators.required]],
  });

  constructor(
    @Inject(DIALOG_DATA) public readonly data: Product,
    private readonly formBuilder: FormBuilder,
    private readonly dialogRef: MatDialogRef<DialogFormComponent>
  ) {}

  ngOnInit(): void {
    if (this.data) {
      this.form.patchValue({
        name: this.data.name,
        price: this.data.price,
      });
    }
  }

  public onSubmit(): void {
    const product: Product = this.form.value;
    this.dialogRef.close(product);
  }
}

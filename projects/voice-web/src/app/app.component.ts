import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  map,
  of,
  mergeMap,
  BehaviorSubject,
  distinctUntilChanged,
  debounceTime,
  startWith,
  filter,
} from 'rxjs';
import { AudioComponent } from './audio/audio.component';
import { AudioService } from './services/audio/audio.service';
import { eventType } from './audio/event.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogFormComponent } from './dialog/dialog-form.component';
import { Product } from './interfaces/product.interface';
import { ProductService } from './services/products/product.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public names = ['carro', 'bike'];
  public placeholder = '';
  public audioComponent!: AudioComponent;
  public isRecording: boolean = false;
  public productList$: BehaviorSubject<Array<Product>> = new BehaviorSubject<
    Array<Product>
  >([]);

  public formSearch: FormGroup = this.formBuilder.group({
    search: ['', [Validators.required]],
  });

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly audioService: AudioService,
    private readonly productService: ProductService,
    private readonly dialog: MatDialog
  ) {}

  public ngOnInit(): void {
    this.productService
      .all()
      .subscribe((prods: Array<Product>) => this.productList$.next(prods));

    this.formSearch
      .get('search')
      ?.valueChanges.pipe(
        startWith(' '),
        distinctUntilChanged(),
        debounceTime(300),
        mergeMap((value) => {
          if (value) {
            return this.productService.findByName(value).pipe(
              filter((prod) => !!prod),
              map((prod) => [prod])
            );
          }
          return this.productService.all();
        })
      )
      .subscribe((prod: Product[]) => this.productList$.next(prod));
  }

  public onSubmit(): void {}

  public startRecord(): void {
    this.isRecording = true;
    this.audioComponent = new AudioComponent();

    this.audioComponent.on(eventType.AUDIO_LISTENING, () => {
      this.audioComponent.startRecorder();
    });
  }

  public stopRecording(): void {
    this.audioComponent.on(
      eventType.AUDIO_RECORDED,
      (file: File, metadata: AudioBuffer) => {
        const reader = new FileReader();

        reader.onloadend = () => {
          this.audioService
            .postAudio(reader.result as string)
            .subscribe(({ keyword }) =>
              this.formSearch.get('search')?.setValue(keyword)
            );
        };
        reader.readAsDataURL(file);
      }
    );
    this.audioComponent.stopRecorder();
    this.isRecording = false;
  }

  public edit(prod: Product): void {
    this.dialog
      .open(DialogFormComponent, {
        maxWidth: 600,
        data: prod,
      })
      .beforeClosed()
      .pipe(
        mergeMap((p: Product) => {
          if (p) {
            return this.productService
              .edit({ ...prod, name: p.name, price: p.price })
              .pipe(mergeMap(() => this.productService.all()));
          }
          return of(null);
        })
      )
      .subscribe((prods: Array<Product> | null) => {
        if (prods) {
          this.productList$.next(prods);
        }
      });
  }

  public remove(prod: Product): void {
    this.productService
      .removeOne(prod)
      .pipe(mergeMap(() => this.productService.all()))
      .subscribe((prods: Array<Product>) => this.productList$.next(prods));
  }

  public dialogOpen(): void {
    this.dialog
      .open(DialogFormComponent, {
        maxWidth: 600,
      })
      .beforeClosed()
      .pipe(
        mergeMap((prod: Product) => {
          if (prod) {
            return this.productService
              .create(prod)
              .pipe(mergeMap(() => this.productService.all()));
          }
          return of(null);
        })
      )
      .subscribe((prods: Array<Product> | null) => {
        if (prods) {
          this.productList$.next(prods);
        }
      });
  }
}

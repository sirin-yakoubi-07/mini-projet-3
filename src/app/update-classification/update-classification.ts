import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Classification } from '../model/classification.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-update-classification',
  imports: [FormsModule],
  templateUrl: './update-classification.html',
  styles: ``,
})
export class UpdateClassification implements OnInit {

  @Input()
  classification!: Classification;

  @Input()
  ajout!: boolean;

  @Output()
  classificationUpdated = new EventEmitter<Classification>();

  ngOnInit(): void {
    console.log("ngOnInit du composant UpdateClassification  ", this.classification);
  }

  saveClassification() {
    this.classificationUpdated.emit(this.classification);
  }
}
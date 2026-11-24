import { Component, OnInit } from '@angular/core';
import { GameService } from '../services/game';
import { Classification } from '../model/classification.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UpdateClassification } from '../update-classification/update-classification';

@Component({
  selector: 'app-liste-classifications',
  imports: [FormsModule, CommonModule, UpdateClassification],
  templateUrl: './liste-classifications.html',
  standalone: true,
  styles: ``,
})
export class ListeClassifications implements OnInit {

  classifications!: Classification[];
  updatedClass: Classification = { "idClass": 0, "nomClass": "" };
  ajout: boolean = true;
  ancienId: number = 0;

  constructor(private gameService: GameService) { }

  ngOnInit(): void {
    this.chargerClassifications();
  }

  classificationUpdated(clas: Classification) {
    console.log("Classification updated event", clas);

    if (this.ajout) {
      // ADD a new line
      this.gameService.ajouterClassification(clas).
        subscribe(() => this.terminer());
    } else {
      // MODIFY the line we clicked on
      const nouvelId = Number(clas.idClass);
      const dejaUtilise = this.classifications.some(
        c => c.idClass == nouvelId && c.idClass != this.ancienId
      );
      if (!nouvelId || dejaUtilise) {
        alert("Cet id existe déjà ou n'est pas valide. Choisissez un autre id.");
        return;
      }
      this.gameService.modifierClassification(this.ancienId, clas).
        subscribe(() => this.terminer());
    }
  }

  // reload the table and empty the form
  terminer() {
    this.chargerClassifications();
    this.updatedClass = { "idClass": 0, "nomClass": "" };
    this.ajout = true;
    this.ancienId = 0;
  }

  chargerClassifications() {
    this.gameService.listeClassificationsObs().
      subscribe(clas => {
        this.classifications = clas;
        console.log(clas);
      });
  }

  updateClassification(clas: Classification) {
    // we work on a copy, and we remember the old id
    this.updatedClass = { ...clas };
    this.ancienId = clas.idClass;
    this.ajout = false;
  }                           
}
import { Component, OnInit } from '@angular/core';
import { Game } from '../model/game.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GameService } from '../services/game';
import { Router } from '@angular/router';
import { Classification } from '../model/classification.model';

@Component({
  imports: [FormsModule, CommonModule],
  standalone: true,
  selector: 'app-add-game',
  styleUrl: './add-game.css',
  templateUrl: './add-game.html',
})
export class AddGame implements OnInit {
  newGame = new Game();
  message: string = '';
  classifications: Classification[] = [];
  newIdClass: number | null = null; // nothing selected by default
  priceText: string = '';           // the price is typed as normal text, converted when saving
  saving: boolean = false;          // prevents adding the same game twice (double click)

  constructor(private gameService: GameService, private router: Router) {}

  ngOnInit(): void {
    this.gameService.listeClassifications().subscribe({
      next: clas => {
        this.classifications = clas._embedded?.classifications ?? [];
      },
      error: err => console.error('Cannot load classifications', err)
    });
  }

  addGame() {
    if (this.saving) return;
    if (!this.newGame.gamename) {
      this.message = 'Please enter the game name';
      return;
    }

    // convert the typed price (accepts 59.99 or 59,99)
    const price = Number(this.priceText.replace(',', '.'));
    if (this.priceText.trim() === '' || isNaN(price) || price < 0) {
      this.message = 'Please enter a valid price (example: 59.99)';
      return;
    }
    this.newGame.gameprice = price;

    // the classification is only set if the user chose one
    this.newGame.classification = this.newIdClass != null
      ? this.classifications.find(c => c.idClass == this.newIdClass)
      : undefined;

    this.saving = true;
    this.gameService.ajouterGame(this.newGame).subscribe({
      next: () => {
        this.router.navigate(['/games']); // the list reloads from the backend
      },
      error: err => {
        console.error(err);
        this.saving = false;
        this.message = 'Error: the game was not added';
      }
    });
  }
}
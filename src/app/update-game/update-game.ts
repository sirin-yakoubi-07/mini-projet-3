import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Game } from '../model/game.model';
import { Classification } from '../model/classification.model';
import { ActivatedRoute, Router } from '@angular/router';
import { GameService } from '../services/game';

@Component({
  imports: [FormsModule, CommonModule],
  selector: 'app-update-game',
  standalone: true,
  templateUrl: './update-game.html',
  styles: ``
})
export class UpdateGame implements OnInit {
  currentGame = new Game();
  classifications: Classification[] = [];
  updatedClassId!: number;
  priceText: string = '';
  message: string = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private gameService: GameService
  ) {}

  ngOnInit(): void {
    this.gameService.listeClassifications().subscribe(cats => {
      this.classifications = cats._embedded?.classifications ?? [];
    });

    this.gameService.consulterGame(this.activatedRoute.snapshot.params['id'])
      .subscribe(g => {
        this.currentGame = g;
        this.priceText = g.gameprice != null ? String(g.gameprice) : '';
        if (g.classification) {
          this.updatedClassId = g.classification.idClass;
        }
      });
  }

  updateGame() {
    const price = Number(this.priceText.replace(',', '.'));
    if (this.priceText.trim() === '' || isNaN(price) || price < 0) {
      this.message = 'Please enter a valid price (example: 59.99)';
      return;
    }
    this.currentGame.gameprice = price;
    this.currentGame.classification = this.classifications.find(c => c.idClass == this.updatedClassId);
    this.gameService.updateGame(this.currentGame).subscribe(() => {
      this.router.navigate(['/games']);
    });
  }
}
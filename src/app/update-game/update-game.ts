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
  classifications!: Classification[];
  updatedClassId!: number;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private gameService: GameService
  ) {}

  ngOnInit(): void {
    this.gameService.listeClassifications().subscribe(cats => {
      this.classifications = cats._embedded.classifications;
    });

    this.gameService.consulterGame(this.activatedRoute.snapshot.params['id'])
      .subscribe(g => {
        this.currentGame = g;
        if (g.classification) {
          this.updatedClassId = g.classification.idClass;
        }
      });
  }

  updateGame() {
    this.currentGame.classification = this.gameService.consulterClassification(this.updatedClassId);
    this.gameService.updateGame(this.currentGame).subscribe(() => {
      this.router.navigate(['/games']);
    });
  }
}
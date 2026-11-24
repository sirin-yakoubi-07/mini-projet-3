import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Game } from '../model/game.model';
import { Classification } from '../model/classification.model';
import { GameService } from '../services/game';

@Component({
  selector: 'app-search-by-class',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-by-class.html',
  styleUrl: './search-by-class.css'
})
export class SearchByClass implements OnInit {
  classifications: Classification[] = [];
  games: Game[] = [];
  selectedClassId: number = 0; // 0 = all classes

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    this.gameService.listeClassifications().subscribe(cats => {
      this.classifications = cats._embedded.classifications;
    });
    this.gameService.rechercherParClass(0).subscribe(gs => {
      this.games = gs;
    });
  }

  onChange(id: number) {
    this.selectedClassId = Number(id);
    this.gameService.rechercherParClass(this.selectedClassId).subscribe(gs => {
      this.games = gs;
    });
  }
}
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Game } from '../model/game.model';
import { GameService } from '../services/game';

@Component({
  selector: 'app-search-by-name',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-by-name.html',
  styleUrl: './search-by-name.css'
})
export class SearchByName implements OnInit {
  games: Game[] = [];
  searchedName: string = '';

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    this.gameService.listeGames().subscribe(gs => {
      this.games = gs;
    });
  }

  searchGames() {
    this.gameService.rechercherParNom(this.searchedName).subscribe(gs => {
      this.games = gs;
    });
  }
}   
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Game } from '../model/game.model';
import { GameService } from '../services/game';
import { Auth } from '../services/auth';

@Component({
  selector: 'app-games',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './games.html',
  styleUrl: './games.css'
})
export class GamesComponent implements OnInit {
  games: Game[] = [];

  constructor(private gameService: GameService,
    public authService: Auth) { }

  ngOnInit(): void {
    this.chargerGames();
  }

  chargerGames() {
    this.gameService.listeGames().subscribe({
      next: gs => this.games = gs,
      error: err => console.error('API error (is Spring Boot running on 8081?)', err)
    });
  }

  supprimerGame(g: Game) {
    let conf = confirm("Do you want to delete this?");
    if (conf) {
      this.gameService.supprimerGame(g).subscribe(() => {
        this.chargerGames();
      });
    }
  }
}
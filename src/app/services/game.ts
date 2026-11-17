import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Game } from '../model/game.model';
import { Classification } from '../model/classification.model';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  games: Game[];
  game!: Game;
  classifications: Classification[];

  constructor() {
    this.classifications = [
      { idClass: 1, nomClass: "action" },
      { idClass: 2, nomClass: "openworld" },
      { idClass: 3, nomClass: "rpg" },
      { idClass: 4, nomClass: "strategy" },
      { idClass: 5, nomClass: "fighting" },
      { idClass: 6, nomClass: "shooter" }
    ];

    // 3 jeux par défaut affichés sur la page d'accueil
    this.games = [
      {
        idgame: 1,
        gamename: "God of War Ragnarok",
        gameprice: 59.99,
        creationdate: new Date("2022-11-09"),
        classification: { idClass: 1, nomClass: "action" }
      },
      {
        idgame: 2,
        gamename: "The Witcher 3",
        gameprice: 39.99,
        creationdate: new Date("2015-05-19"),
        classification: { idClass: 3, nomClass: "rpg" }
      },
      {
        idgame: 3,
        gamename: "Red Dead Redemption 2",
        gameprice: 49.99,
        creationdate: new Date("2018-10-26"),
        classification: { idClass: 2, nomClass: "openworld" }
      }
    ];
  }

  listeGames(): Game[] {
    return this.games;
  }

  // Normal list (used by add-game, update-game, search-by-class)
  listeClassifications(): Classification[] {
    return this.classifications;
  }

  // Same list, but as a "delivery" so you can use subscribe
  listeClassificationsObs(): Observable<Classification[]> {
    return of(this.classifications);
  }

  ajouterGame(game: Game) {
    // id unique : si vide ou déjà utilisé, on en génère un nouveau
    const id = Number(game.idgame);
    if (!id || this.games.some(g => g.idgame == id)) {
      game.idgame = Math.max(0, ...this.games.map(g => Number(g.idgame))) + 1;
    } else {
      game.idgame = id;
    }
    this.games.push(game);
  }

  supprimerGame(g: Game) {
    const index = this.games.indexOf(g, 0);
    if (index > -1) {
      this.games.splice(index, 1);
    }
  }

  consulterGame(id: number): Game {
    this.game = this.games.find(g => g.idgame == id)!;
    return this.game;
  }

  updateGame(game: Game) {
    const index = this.games.indexOf(game, 0);
    if (index > -1) {
      this.games.splice(index, 1);
      this.games.splice(index, 0, game);
    }
  }

  consulterClassification(id: number): Classification {
    return this.classifications.find(cls => cls.idClass == id)!;
  }

  // Search by class (0 = toutes les classes)
  rechercherParClass(idClass: number): Game[] {
    if (!idClass) return [...this.games];
    return this.games.filter(g => g.classification?.idClass == idClass);
  }

  // Search by name
  rechercherParNom(nom: string): Game[] {
    const terme = (nom || '').trim().toLowerCase();
    return this.games.filter(g => g.gamename.toLowerCase().includes(terme));
  }

  // Add a NEW classification (always with a new id)
  ajouterClassification(cls: Classification): Observable<Classification> {
    const nouvelle: Classification = {
      idClass: Math.max(0, ...this.classifications.map(c => Number(c.idClass))) + 1,
      nomClass: cls.nomClass
    };
    this.classifications.push(nouvelle);
    return of(nouvelle);
  }

  // Modify an EXISTING classification (found with its old id), never adds a new line
  modifierClassification(ancienId: number, cls: Classification): Observable<Classification> {
    const index = this.classifications.findIndex(c => c.idClass == ancienId);
    if (index > -1) {
      this.classifications[index] = {
        idClass: Number(cls.idClass),
        nomClass: cls.nomClass
      };
      return of(this.classifications[index]);
    }
    return of(cls);
  }
}
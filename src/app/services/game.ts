import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, map } from 'rxjs';
import { Game } from '../model/game.model';
import { Classification } from '../model/classification.model';
import { ClassificationWrapper } from '../model/classificationWrapped.model';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  classifications: Classification[];

  apiURL: string = 'http://localhost:8081/games/api';
  apiURLClass: string = 'http://localhost:8081/games/classifications';

  constructor(private http: HttpClient) {
    this.classifications = [
      { idClass: 1, nomClass: "PEGI 12" },
      { idClass: 2, nomClass: "action" },
      { idClass: 3, nomClass: "openworld" },
      { idClass: 4, nomClass: "rpg" },
      { idClass: 5, nomClass: "strategy" },
      { idClass: 6, nomClass: "fighting" },
      { idClass: 7, nomClass: "shooter" }
    ];
  }

  // ---- Translators (English <-> French names) ----
  private toBackend(g: Game): any {
    return {
      idGame: g.idgame,
      nomGame: g.gamename,
      prixGame: g.gameprice,
      dateCreation: g.creationdate,
      classification: g.classification ? { idClass: g.classification.idClass } : null
    };
  }

  private fromBackend(b: any): Game {
    const g = new Game();
    g.idgame = b.idGame;
    g.gamename = b.nomGame;
    g.gameprice = b.prixGame;
    g.creationdate = b.dateCreation ? new Date(b.dateCreation) : (null as any);
    g.classification = b.classification ? b.classification : undefined;
    return g;
  }

  // ---- Games (Spring Boot) ----
  listeGames(): Observable<Game[]> {
    return this.http.get<any[]>(this.apiURL).pipe(
      map(list => list.map(b => this.fromBackend(b)))
    );
  }

  ajouterGame(game: Game): Observable<Game> {
    const body = this.toBackend(game);
    delete body.idGame; // the database creates the id
    return this.http.post<any>(this.apiURL, body).pipe(map(b => this.fromBackend(b)));
  }

  supprimerGame(g: Game): Observable<void> {
    return this.http.delete<void>(this.apiURL + '/' + g.idgame);
  }

  consulterGame(id: number): Observable<Game> {
    return this.http.get<any>(this.apiURL + '/' + id).pipe(map(b => this.fromBackend(b)));
  }

  updateGame(game: Game): Observable<Game> {
    return this.http.put<any>(this.apiURL, this.toBackend(game)).pipe(map(b => this.fromBackend(b)));
  }

  rechercherParClass(idClass: number): Observable<Game[]> {
    if (!idClass) {
      return this.listeGames();
    }
    return this.http.get<any[]>(this.apiURL + '/gamesclass/' + idClass).pipe(
      map(list => list.map(b => this.fromBackend(b)))
    );
  }

  rechercherParNom(nom: string): Observable<Game[]> {
    const terme = (nom || '').trim().toLowerCase();
    return this.listeGames().pipe(
      map(list => list.filter(g => (g.gamename || '').toLowerCase().includes(terme)))
    );
  }

  // ---- Classifications ----
  listeClassifications(): Observable<ClassificationWrapper> {
    return this.http.get<ClassificationWrapper>(this.apiURLClass);
  }

  listeClassificationsObs(): Observable<Classification[]> {
    return of(this.classifications);
  }

  consulterClassification(id: number): Classification {
    return this.classifications.find(cls => cls.idClass == id)!;
  }

  ajouterClassification(cls: Classification): Observable<Classification> {
    const nouvelle: Classification = {
      idClass: Math.max(0, ...this.classifications.map(c => Number(c.idClass))) + 1,
      nomClass: cls.nomClass
    };
    this.classifications.push(nouvelle);
    return of(nouvelle);
  }

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
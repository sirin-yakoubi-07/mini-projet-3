import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Game } from '../model/game.model';
import { Classification } from '../model/classification.model';
import { ClassificationWrapper } from '../model/classificationWrapped.model';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  // Same port and context-path as the Spring Boot app (application.properties):
  // server.port=8081 and server.servlet.context-path=/games
  apiURL: string = 'http://localhost:8081/games/api';
  apiURLClass: string = 'http://localhost:8081/games/classifications';

  constructor(private http: HttpClient) {}

  // A different value on every call, so the browser never reuses an old answer:
  // the list always comes from the backend.
  private fresh() {
    return { params: { _t: Date.now().toString() } };
  }

  // ---- Translators (Angular names <-> Spring Boot names) ----
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

  // ---- Games ----
  listeGames(): Observable<Game[]> {
    return this.http.get<any[]>(this.apiURL, this.fresh()).pipe(
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
    return this.http.get<any>(this.apiURL + '/' + id, this.fresh()).pipe(map(b => this.fromBackend(b)));
  }

  updateGame(game: Game): Observable<Game> {
    return this.http.put<any>(this.apiURL, this.toBackend(game)).pipe(map(b => this.fromBackend(b)));
  }

  rechercherParClass(idClass: number): Observable<Game[]> {
    if (!idClass) {
      return this.listeGames();
    }
    return this.http.get<any[]>(this.apiURL + '/gamesclass/' + idClass, this.fresh()).pipe(
      map(list => list.map(b => this.fromBackend(b)))
    );
  }

  rechercherParNom(nom: string): Observable<Game[]> {
    const terme = (nom || '').trim().toLowerCase();
    return this.listeGames().pipe(
      map(list => list.filter(g => (g.gamename || '').toLowerCase().includes(terme)))
    );
  }

  // ---- Classifications (Spring Data REST: /games/classifications) ----
  listeClassifications(): Observable<ClassificationWrapper> {
    return this.http.get<ClassificationWrapper>(this.apiURLClass, this.fresh());
  }

  listeClassificationsObs(): Observable<Classification[]> {
    return this.listeClassifications().pipe(
      map(w => (w._embedded?.classifications ?? []) as Classification[])
    );
  }

  ajouterClassification(cls: Classification): Observable<Classification> {
    return this.http.post<Classification>(this.apiURLClass, { nomClass: cls.nomClass });
  }

  modifierClassification(id: number, cls: Classification): Observable<Classification> {
    return this.http.put<Classification>(this.apiURLClass + '/' + id, { nomClass: cls.nomClass });
  }
}
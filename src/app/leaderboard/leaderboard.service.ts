import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map } from 'rxjs';

interface Player {
  PlayerId: number;
  Name: string;
}
interface Score {
  PlayerId: number;
  TotalScore: number;
  GamesPlayed: number;
}

@Injectable({ providedIn: 'root' })
export class LeaderboardService {
  constructor(private http: HttpClient) {}

  getLeaderboard() {
    const players$ = this.http
      .get<{ Players: Player[] }>('assets/players.json')
      .pipe(map((res) => res.Players));
    const scores$ = this.http
      .get<{ Results: Score[] }>('https://mab-mockapi.free.beeceptor.com/data')
      .pipe(map((res) => res.Results));

    return forkJoin([players$, scores$]).pipe(
      map(([players, scores]) =>
        scores
          .map((score) => {
            const player = players.find((p) => p.PlayerId === score.PlayerId);
            return {
              rank: 0,
              name: player?.Name ?? 'Unknown',
              ...score,
              avgScore: score.TotalScore / score.GamesPlayed,
              gamesPlayed: score.GamesPlayed,
            };
          })
          // sorts by totalScore descending & re-ranks
          .sort((a, b) => b.TotalScore - a.TotalScore)
          .map((p, i) => ({ ...p, rank: i + 1 }))
      )
    );
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaderboardComponent } from './leaderboard/leaderboard';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, LeaderboardComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class AppComponent {}

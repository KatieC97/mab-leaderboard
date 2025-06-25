import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { LeaderboardService } from './leaderboard.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatIconModule],
  templateUrl: './leaderboard.html',
  styleUrls: ['./leaderboard.scss'],
})
export class LeaderboardComponent implements OnInit {
  isDark = false;
  isMobile = window.innerWidth <= 480;
  displayedCols: string[] = [];
  dataSource: any[] = [];

  constructor(
    private leaderboardService: LeaderboardService,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit() {
    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .subscribe((result) => {
        this.isMobile = result.matches;
        this.displayedCols = ['rank', 'name', 'avg', 'gamesPlayed'];
      });

    this.leaderboardService.getLeaderboard().subscribe((data) => {
      this.dataSource = data;
    });
  }
  public get avgScoreLabel(): string {
    return this.isMobile ? 'Avg. Score' : 'Average Score';
  }
}

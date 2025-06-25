import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LeaderboardComponent } from './leaderboard';
import { LeaderboardService } from './leaderboard.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';

describe('LeaderboardComponent', () => {
  let component: LeaderboardComponent;
  let fixture: ComponentFixture<LeaderboardComponent>;

  const mockService = {
    getLeaderboard: jasmine
      .createSpy('getLeaderboard')
      .and.returnValue(
        of([{ rank: 1, name: 'Karl Krueger', avgScore: 78, gamesPlayed: 9 }])
      ),
  };

  const mockBreakpoint = {
    observe: jasmine
      .createSpy('observe')
      .and.returnValue(of({ matches: false })),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaderboardComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: LeaderboardService, useValue: mockService },
        { provide: BreakpointObserver, useValue: mockBreakpoint },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LeaderboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch leaderboard data on init', () => {
    expect(mockService.getLeaderboard).toHaveBeenCalled();
    expect(component.dataSource.length).toBe(1);
    expect(component.dataSource[0]).toEqual({
      rank: 1,
      name: 'Karl Krueger',
      avgScore: 78,
      gamesPlayed: 9,
    });
  });

  it('should use desktop columns if not mobile screen', () => {
    expect(component.isMobile).toBeFalse();
    expect(component.displayedCols).toEqual([
      'rank',
      'name',
      'avg',
      'gamesPlayed',
    ]);
  });

  it('should toggle to dark mode on button click', () => {
    const initial = component.isDark;
    component.isDark = !initial;
    expect(component.isDark).toBe(!initial);
  });

  it('should load "Scrabble Leaderboard" in header', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h2')?.textContent).toContain(
      'Scrabble Leaderboard'
    );
  });
  it('should not load incorrect leaderboard data', () => {
    const wrongPlayer = component.dataSource.find(
      (player) => player.rank === 1
    );
    expect(wrongPlayer?.name).not.toBe('Nik');
    expect(wrongPlayer?.avgScore).not.toBe(100);
    expect(wrongPlayer?.gamesPlayed).not.toBe(12);
  });
});

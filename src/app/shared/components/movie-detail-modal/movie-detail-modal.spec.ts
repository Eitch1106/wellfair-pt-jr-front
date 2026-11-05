import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieDetailModal } from './movie-detail-modal';

describe('MovieDetailModal', () => {
  let component: MovieDetailModal;
  let fixture: ComponentFixture<MovieDetailModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieDetailModal],
    }).compileComponents();

    fixture = TestBed.createComponent(MovieDetailModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

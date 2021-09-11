import { TestBed, inject } from '@angular/core/testing';

import { CardReviewGameService } from './card-review-game.service';

describe('CardReviewGameService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CardReviewGameService]
    });
  });

  it('should be created', inject([CardReviewGameService], (service: CardReviewGameService) => {
    expect(service).toBeTruthy();
  }));
});

import { NgModule }             from '@angular/core/';
import { RouterModule, Routes } from '@angular/router';

import { HomepageComponent } from './homepage/homepage.component';
import { RatingsScaleHelpComponent } from './ratings-scale-help/ratings-scale-help.component';
import { SetStatisticsTabComponent } from './set-statistics-tab/set-statistics-tab.component';
import { YourLimitedSetReviewsComponent } from './your-limited-set-reviews/your-limited-set-reviews.component';
import { CardReviewGameComponent } from './card-review-game/card-review-game.component';
import { CompareSetReviewsComponent } from './compare-set-reviews/compare-set-reviews.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CreateAccountComponent } from './create-account/create-account.component';

import { AuthGuardService } from './Services/auth-guard.service';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard/homepage', pathMatch: 'full' },
  { path: 'dashboard',  component: DashboardComponent,
   children : [
    { path: '', component: HomepageComponent },
    { path: 'homepage', component: HomepageComponent },
    { path: 'ratingsScaleHelp', component: RatingsScaleHelpComponent },
    { path: 'setStatistics', component: SetStatisticsTabComponent },
    { path: 'cardReviewGame', component: CardReviewGameComponent },
    { path: 'yourLimitedSetReviews', canActivate: [AuthGuardService], component: YourLimitedSetReviewsComponent },
    { path: 'compareReviews', canActivate: [AuthGuardService], component: CompareSetReviewsComponent },
    { path: 'login', children : [{ path: '', component: LoginComponent },{ path: 'createAccount', component: CreateAccountComponent }]}
  ]},
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
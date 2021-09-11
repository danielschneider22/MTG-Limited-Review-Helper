import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SetStatisticsTabComponent } from './set-statistics-tab/set-statistics-tab.component';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { BarChartComponent } from './shared/bar-chart/bar-chart.component';
import { GroupedBarChartComponent } from './shared/grouped-bar-chart/grouped-bar-chart.component';
import { AppRoutingModule } from './/app-routing.module';
import { YourLimitedSetReviewsComponent } from './your-limited-set-reviews/your-limited-set-reviews.component';
import { CardFilterComponent } from './card-filter/card-filter.component';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database-deprecated';
import { environment } from '../environments/environment';
import { AuthService } from './Services/auth.service';
import { AuthGuardService } from './Services/auth-guard.service';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CreateAccountComponent } from './create-account/create-account.component';
import { CompareSetReviewsComponent } from './compare-set-reviews/compare-set-reviews.component';
import { HomepageComponent } from './homepage/homepage.component';
import { RatingsScaleHelpComponent } from './ratings-scale-help/ratings-scale-help.component';
import { CardReviewGameComponent } from './card-review-game/card-review-game.component';
import { CardReviewGameSetupComponent } from './card-review-game-setup/card-review-game-setup.component';

@NgModule({
  declarations: [
    AppComponent,
    SetStatisticsTabComponent,
    BarChartComponent,
    GroupedBarChartComponent,
    YourLimitedSetReviewsComponent,
    CardFilterComponent,
    LoginComponent,
    DashboardComponent,
    CreateAccountComponent,
    CompareSetReviewsComponent,
    HomepageComponent,
    RatingsScaleHelpComponent,
    CardReviewGameComponent,
    CardReviewGameSetupComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    NgbModule.forRoot(),
  ],
  providers: [AuthService,AuthGuardService],
  bootstrap: [AppComponent]
})
export class AppModule { }

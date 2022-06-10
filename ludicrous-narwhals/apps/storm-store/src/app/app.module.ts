import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { StormStoreModule } from '@ludicrous-narwhals/store';
import { AppComponent } from './app.component';
import { NxWelcomeComponent } from './nx-welcome.component';
import { RowState } from './states/row.state';
import { UserState } from './states/user.state';


@NgModule({
  declarations: [AppComponent, NxWelcomeComponent],
  imports: [BrowserModule, StormStoreModule.forRoot([
    UserState, RowState
  ])],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

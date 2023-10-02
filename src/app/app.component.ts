import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'simple-crm';

  openSite(){
    window.open('https://pascal-dietz.developerakademie.net/portfoliowebsite/')
  }
}

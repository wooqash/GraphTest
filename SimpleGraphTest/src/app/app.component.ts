import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'SimpleGraphTest';
  apiUrl = 'https://swapi.co/api/people/';

  ngOnInit(): void {
    fetch(this.apiUrl).then(resp => {
      console.log(resp);
  })
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

  }
}

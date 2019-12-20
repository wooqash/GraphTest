import { Component, OnInit } from '@angular/core';
// import * as swapiModule from 'swapi-wrapper';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'SimpleGraphTest';
  apiUrl = 'https://swapi.co/api/people/';
  private people;

  ngOnInit(): void {
    new Promise((resolve, reject) => {
      this.getPeople(this.apiUrl, [], resolve, reject);
    })
    .then(response => {
      this.people = response;
      console.log(this.people);
    });
  }

  private getPeople = (url, people, resolve, reject) => {
    fetch(url)
    .then(resp => resp.json())
    .then(data => {
      const retrivedPeople = people.concat(data.results);
      if (data.next !== null) {
        this.getPeople(data.next, retrivedPeople, resolve, reject);
      } else {
        resolve(retrivedPeople);
      }
    })
    .catch((err) => {
      console.log(err);
      reject(err);
    });
  }
}

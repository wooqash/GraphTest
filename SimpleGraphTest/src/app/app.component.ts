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
  private charactersWithBMI;
  private otherCharacters;
  private unknownCharacters;
  private sortedCharacters;
  private graphData;
  private unknownLbl = 'unknown'

  ngOnInit(): void {
    new Promise((resolve, reject) => {
      this.getPeople(this.apiUrl, [], resolve, reject);
    }).then(response => {
      this.people = response;
      console.log(this.people);
      this.unknownCharacters = this.getUnknowCharacters(this.people);
      console.log(this.unknownCharacters);
      this.otherCharacters = this.getOtherCharacters(this.people);
      console.log(this.otherCharacters);
      this.sortedCharacters = this.sortCharactersByBirthYear(this.otherCharacters);
      this.charactersWithBMI = this.assignBmiToCharacter(this.sortedCharacters);
      console.log(this.charactersWithBMI);

      this.graphData = this.assignPeopleToAgeRange(this.sortedCharacters);
      console.log(this.graphData);
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
      .catch(err => {
        console.log(err);
        reject(err);
      });
  }

  private assignBmiToCharacter = people => {
    if (!people) {
      return;
    }

    return people.map(character => {
      character.BMI = this.countBMI(character).toPrecision(4);
      return character;
    });
  }

  private countBMI = character => {
    if (!character.height || !character.mass) {
      return;
    }
    const mass = character.mass.replace(',', '.') * 1;
    const height = character.height.replace(',', '.') * 1;

    return (mass / Math.pow(height / 100, 2));
  }

  private getOtherCharacters = people => {
    if (!people) {
      return;
    }
    return people.filter(
      item => item !== this.unknownCharacters.find(character => character.name === item.name)
    );
  }

  private getUnknowCharacters = people => {
    if (!people) {
      return;
    }
    return people.filter(
      item => !item.birth_year || !item.mass || !item.height || (item.birth_year || item.mass || item.height) === this.unknownLbl
    );
  }

  private sortCharactersByBirthYear = people => {
    if (!people) {
      return;
    }
    return people.sort(this.compareCharactersByBirthYear);
  }

  private compareCharactersByBirthYear = (currentCharacter, nextCharacter) => {
    const firstCharacter = this.transformDate(currentCharacter.birth_year);
    const secondCharacter = this.transformDate(nextCharacter.birth_year);

    let comparison = 0;
    if (firstCharacter > secondCharacter) {
      comparison = 1;
    } else if (firstCharacter < secondCharacter) {
      comparison = -1;
    }
    return comparison;
  }

  private transformDate = date => {
    if (!date) {
      return;
    }

    return date.toUpperCase().replace('BBY', '') * 1;
  }

  private assignPeopleToAgeRange = people => {
    if (!people) {
      return;
    }

    return [
      {
        name: '0-20BBY',
        series: people.filter(
          character =>
            this.transformDate(character.birth_year) >= 0 &&
            this.transformDate(character.birth_year) < 20
        )
      },
      {
        name: '20-40BBY',
        series: people.filter(
          character =>
            this.transformDate(character.birth_year) >= 20 &&
            this.transformDate(character.birth_year) < 40
        )
      },
      {
        name: '40-60BBY',
        series: people.filter(
          character =>
            this.transformDate(character.birth_year) >= 40 &&
            this.transformDate(character.birth_year) < 60
        )
      },
      {
        name: '60-80BBY',
        series: people.filter(
          character =>
            this.transformDate(character.birth_year) >= 60 &&
            this.transformDate(character.birth_year) < 80
        )
      },
      {
        name: '80-100BBY',
        series: people.filter(
          character =>
            this.transformDate(character.birth_year) >= 80 &&
            this.transformDate(character.birth_year) < 100
        )
      },
      {
        name: '100BBY++',
        series: people.filter(
          character => this.transformDate(character.birth_year) >= 100
        )
      },
      {
        name: this.unknownLbl,
        series: this.unknownCharacters
      }
    ];
  }
}

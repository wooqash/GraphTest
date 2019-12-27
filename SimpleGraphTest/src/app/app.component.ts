import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'SimpleGraphTest';
  apiUrl = 'https://swapi.co/api/people/';
  private characters;
  private charactersWithDoB;
  private charachtersWithoutDoB;
  private groupCharactersByDoB;
  private unknownLbl = 'unknown';
  public graphData;


  ngOnInit(): void {
    new Promise((resolve, reject) => {
      this.getPeople(this.apiUrl, [], resolve, reject);
    }).then(response => {
      this.characters = response;
      this.assignBMIToCharacter(this.characters);
      this.charachtersWithoutDoB = this.filterCharactersWithoutDoB(this.characters);
      this.charactersWithDoB = this.filterCharactersWithDoB(this.characters);
      this.graphData = this.assignCharactersToAgeRange(this.charactersWithDoB);
      this.sortCharactersByBirthYear(this.graphData);
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

  private assignBMIToCharacter = characters => {
    if (!characters) {
      return;
    }

    return characters.map(character => {
      character.BMI = !isNaN((this.countBMI(character))) ? parseFloat(this.countBMI(character).toPrecision(4)) : undefined;
      character.BMIclass = this.assignColorToBMI(character.BMI);
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

  private assignColorToBMI = BMIvalue => {
    if (BMIvalue < 16) {
      return 'underweight';
    } else if (BMIvalue >= 16 && BMIvalue <= 24.99) {
      return 'normal';
    } else if (BMIvalue >= 25 && BMIvalue <= 39.99) {
      return 'overweight';
    } else if (BMIvalue > 40) {
      return 'obesity';
    } else {
      return 'undefined';
    }
  }

  private filterCharactersWithDoB = characters => {
    if (!characters) {
      return;
    }
    return characters.filter(
      item => item.birth_year && item.birth_year !== this.unknownLbl
    );
  }

  private filterCharactersWithoutDoB = characters => {
    if (!characters) {
      return;
    }
    return characters.filter(
      item => !item.birth_year || item.birth_year === this.unknownLbl
    );
  }

  private sortCharactersByBirthYear = characters => {
    if (!characters) {
      return;
    }
    return characters.map(group => group.series.sort(this.compareCharactersByBirthYear));

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

  private assignCharactersToAgeRange = characters => {
    if (!characters) {
      return;
    }

    return [
      {
        name: '0-20BBY',
        series: characters.filter(
          character =>
            this.transformDate(character.birth_year) >= 0 &&
            this.transformDate(character.birth_year) < 20
        )
      },
      {
        name: '20-40BBY',
        series: characters.filter(
          character =>
            this.transformDate(character.birth_year) >= 20 &&
            this.transformDate(character.birth_year) < 40
        )
      },
      {
        name: '40-60BBY',
        series: characters.filter(
          character =>
            this.transformDate(character.birth_year) >= 40 &&
            this.transformDate(character.birth_year) < 60
        )
      },
      {
        name: '60-80BBY',
        series: characters.filter(
          character =>
            this.transformDate(character.birth_year) >= 60 &&
            this.transformDate(character.birth_year) < 80
        )
      },
      {
        name: '80-100BBY',
        series: characters.filter(
          character =>
            this.transformDate(character.birth_year) >= 80 &&
            this.transformDate(character.birth_year) < 100
        )
      },
      {
        name: '100BBY++',
        series: characters.filter(
          character => this.transformDate(character.birth_year) >= 100
        )
      },
      {
        name: this.unknownLbl,
        series: this.charachtersWithoutDoB
      }
    ];
  }
}

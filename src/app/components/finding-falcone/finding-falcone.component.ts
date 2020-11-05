import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatSelectionListChange } from '@angular/material/list';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AppService } from '../../services/app.service';
import { Planet } from '../../shared/planet';
import { Vehicle } from '../../shared/vehicle';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-finding-falcone',
  templateUrl: './finding-falcone.component.html',
  styleUrls: ['./finding-falcone.component.scss'],
})
export class FindingFalconeComponent implements OnInit, OnDestroy {
  /**
   * Object which is used to get the autoComplete event.
   */
  @ViewChild(MatAutocompleteTrigger) autocomplete: MatAutocompleteTrigger;
  /**
   * Array which is used to store the planet data.
   */
  planets: Planet[] = [];
  /**
   * Variable which is used to store the err response for the planet object.
   */
  planeterrMessage;
  /**
   * Array which is used to store the Vehicle data.
   */
  vehicles: Vehicle[] = [];
  /**
   * Variable which is used to store the err response for the vehicle object.
   */
  vehicleerrMessage;
  /**
   * Array which is used to get the subscribed objects.
   */
  subscriptionArray = [];
  /**
   * Varaible which is used to store the boolean value , when will first planet image and vehicle list open.
   */
  isFirstPlanetOpen = false;
  /**
   * Varaible which is used to store the boolean value , when will second planet image and vehicle list open.
   */
  isSecondPlanetOpen = false;
  /**
   * Varaible which is used to store the boolean value , when will third planet image and vehicle list open.
   */
  isThirdPlanetOpen = false;
  /**
   * Varaible which is used to store the boolean value , when will fourth planet image and vehicle list open.
   */
  isFourthPlanetOpen = false;
  /**
   * Variable which is used to store the response recieved status
   */
  responseRecieved = false;
  /**
   * Varaible which is used to store the first planet value
   */
  firstCtrl = new FormControl('');
  /**
   * Varaible which is used to store the second planet value
   */
  secondCtrl = new FormControl('');
  /**
   * Varaible which is used to store the third planet value
   */
  thirdCtrl = new FormControl('');
  /**
   * Varaible which is used to store the fourth planet value
   */
  fourthCtrl = new FormControl('');
  /**
   * Varaible which is used to store the first vehcile value
   */
  firstVehicle;
  /**
   * Varaible which is used to store the second vehcile value
   */
  secondVehicle;
  /**
   * Varaible which is used to store the third vehcile value
   */
  thirdVehicle;
  /**
   * Varaible which is used to store the fourth vehcile value
   */
  fourthVehicle;
  /**
   * Varaible which is used to store the observable value of first planet.
   */
  filteredFirstCtrl: Observable<Planet[]>;
  /**
   * Varaible which is used to store the observable value of second planet.
   */
  filteredSecondCtrl: Observable<Planet[]>;
  /**
   * Varaible which is used to store the observable value of third planet.
   */
  filteredThirdCtrl: Observable<Planet[]>;
  /**
   * Varaible which is used to store the observable value of fourth planet.
   */
  filteredFourthCtrl: Observable<Planet[]>;
  /**
   * Array which is used for dynamic first vehicle choosen changes.
   */
  firstVehicleDynamicChanges = [];
  /**
   * Array which is used for dynamic second vehicle choosen changes.
   */
  secondVehicleDynamicChanges = [];
  /**
   * Array which is used for dynamic third vehicle choosen changes.
   */
  thirdVehicleDynamicChanges = [];
  /**
   * Array which is used for dynamic fourth vehicle choosen changes.
   */
  fourthVehicleDynamicChanges = [];
  /**
   * Variable which is used to store the distance reached value.
   */
  distanceCovered = 0;

  /**
   * Constructore which is used to create the new object for required services.
   * @param appService Which is used to get all our application related data
   * @param router Which is used for navigation to the user.
   * @param snackBar Which is used to display the information modal to the user.
   */
  constructor(
    private appService: AppService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    // Which hold the async first planet values for auto complete
    this.filteredFirstCtrl = this.firstCtrl.valueChanges.pipe(
      startWith(''),
      map((data) => this._filterFirstPlanet(data))
    );
    // Which hold the async second planet values for auto complete
    this.filteredSecondCtrl = this.secondCtrl.valueChanges.pipe(
      startWith(''),
      map((data) => this._filterSecondPlanet(data))
    );
    // Which hold the async third planet values for auto complete
    this.filteredThirdCtrl = this.thirdCtrl.valueChanges.pipe(
      startWith(''),
      map((data) => this._filterThirdPlanet(data))
    );
    // Which hold the async s planet values for auto complete
    this.filteredFourthCtrl = this.fourthCtrl.valueChanges.pipe(
      startWith(''),
      map((data) => this._filterFourthPlanet(data))
    );
  }
  /**
   * Application main Component OnInit life cycle hook
   */
  ngOnInit(): void {
    this.subscriptionArray[
      'revisedVehicle'
    ] = this.appService.onVehicleLogs().subscribe((data) => {
      if (data && data.value) {
        this.vehicles = [...data.value];
      }
    });
    this.subscriptionArray[
      'distanceCalculated'
    ] = this.appService.onDistanceChange().subscribe((data) => {
      if (data && data.value) {
        this.distanceCovered = data.value;
      } else {
        this.distanceCovered = 0;
      }
    });
    this.subscriptionArray[
      'getPlanet'
    ] = this.appService.getPlanets().subscribe(
      (data) => {
        if (data) {
          this.planets = [...data];
        }
      },
      (errMsg) => {
        this.planeterrMessage = errMsg;
        this.router.navigate(['../home']);
      }
    );

    this.subscriptionArray[
      'getVehicle'
    ] = this.appService.getVehicles().subscribe(
      (data) => {
        if (data) {
          this.vehicles = [...data];
          this.appService.initialVehicle = [...data];
          this.appService.allVehicles = [...data];
          this.responseRecieved = true;
        }
      },
      (errMsg) => {
        this.planeterrMessage = errMsg;
        this.router.navigate(['../home']);
        this.responseRecieved = true;
      }
    );
    this.subscriptionArray[
      'firstCtrlchanges'
    ] = this.firstCtrl.valueChanges.subscribe((result) => {
      if (result) {
        this.isFirstPlanetOpen = false;
        const checkedPlanet = this.planets.filter(
          (data) => data.name === result
        );
        if (checkedPlanet.length > 0) {
          const revisedCheck = checkedPlanet.find(
            (datas) =>
              datas.name === this.secondCtrl.value ||
              datas.name === this.thirdCtrl.value ||
              datas.name === this.fourthCtrl.value
          );
          if (revisedCheck) {
            this.snackBar.open(
              'You already choose this Planet , Please choose other planet',
              'Information',
              {
                duration: 2000,
              }
            );
            this.firstCtrl.setValue('');
          } else {
            this.isFirstPlanetOpen = true;
          }
        }
      }
    });
    this.subscriptionArray[
      'fourthCtrlchanges'
    ] = this.fourthCtrl.valueChanges.subscribe((result) => {
      if (result) {
        this.isFourthPlanetOpen = false;
        const checkedPlanet = this.planets.filter(
          (data) => data.name === result
        );
        if (checkedPlanet.length > 0) {
          const revisedCheck = checkedPlanet.find(
            (datas) =>
              datas.name === this.secondCtrl.value ||
              datas.name === this.thirdCtrl.value ||
              datas.name === this.firstCtrl.value
          );
          if (revisedCheck) {
            this.snackBar.open(
              'You already choose this Planet , Please choose other planet',
              'Information',
              {
                duration: 2000,
              }
            );
            this.fourthCtrl.setValue('');
          } else {
            this.isFourthPlanetOpen = true;
          }
        }
      }
    });
    this.subscriptionArray[
      'thirdCtrlchanges'
    ] = this.thirdCtrl.valueChanges.subscribe((result) => {
      if (result) {
        this.isThirdPlanetOpen = false;
        const checkedPlanet = this.planets.filter(
          (data) => data.name === result
        );
        if (checkedPlanet.length > 0) {
          const revisedCheck = checkedPlanet.find(
            (datas) =>
              datas.name === this.secondCtrl.value ||
              datas.name === this.firstCtrl.value ||
              datas.name === this.fourthCtrl.value
          );
          if (revisedCheck) {
            this.snackBar.open(
              'You already choose this Planet , Please choose other planet',
              'Information',
              {
                duration: 2000,
              }
            );
            this.thirdCtrl.setValue('');
          } else {
            this.isThirdPlanetOpen = true;
          }
        }
      }
    });
    this.subscriptionArray[
      'secondCtrlchanges'
    ] = this.secondCtrl.valueChanges.subscribe((result) => {
      if (result) {
        this.isSecondPlanetOpen = false;
        const checkedPlanet = this.planets.filter(
          (data) => data.name === result
        );
        if (checkedPlanet.length > 0) {
          const revisedCheck = checkedPlanet.find(
            (datas) =>
              datas.name === this.firstCtrl.value ||
              datas.name === this.thirdCtrl.value ||
              datas.name === this.fourthCtrl.value
          );
          if (revisedCheck) {
            this.snackBar.open(
              'You already choose this Planet , Please choose other planet',
              'Information',
              {
                duration: 2000,
              }
            );
            this.secondCtrl.setValue('');
          } else {
            this.isSecondPlanetOpen = true;
          }
        }
      }
    });
  }

  // inputFocused() {
  //   this.autocomplete.closePanel();
  // }

  /**
   * Method which is used to get the planet name from plant object
   * @param planet which holds the planet object
   */
  displayFn(planet: Planet): string {
    return planet && planet.name ? planet.name : '';
  }

  /**
   * Method which is used to filter the first planet object
   * @param value Which holds the current user choosen first planet value
   */
  private _filterFirstPlanet(value: string): Planet[] {
    this.appService.distanceChanges(0, 'first');
    const filterValue = value.toLowerCase();
    const data = this.planets.filter(
      (datas) =>
        datas.name !== this.secondCtrl.value &&
        datas.name !== this.thirdCtrl.value &&
        datas.name !== this.fourthCtrl.value
    );
    if (data && data.length < this.planets.length) {
      return data.filter(
        (datas) => datas.name.toLowerCase().indexOf(filterValue) === 0
      );
    } else {
      return this.planets.filter(
        (datas) => datas.name.toLowerCase().indexOf(filterValue) === 0
      );
    }
  }
  /**
   * Method which is used to filter the second planet object
   * @param value Which holds the current user choosen second planet value
   */
  private _filterSecondPlanet(value: string): Planet[] {
    this.appService.distanceChanges(0, 'second');

    const filterValue = value.toLowerCase();
    const data = this.planets.filter(
      (datas) =>
        datas.name !== this.firstCtrl.value &&
        datas.name !== this.thirdCtrl.value &&
        datas.name !== this.fourthCtrl.value
    );
    if (data && data.length < this.planets.length) {
      return data.filter(
        (datas) => datas.name.toLowerCase().indexOf(filterValue) === 0
      );
    } else {
      return this.planets.filter(
        (datas) => datas.name.toLowerCase().indexOf(filterValue) === 0
      );
    }
  }

  /**
   * Method which is used to filter the third planet object
   * @param value Which holds the current user choosen third planet value
   */
  private _filterThirdPlanet(value: string): Planet[] {
    this.appService.distanceChanges(0, 'third');

    const filterValue = value.toLowerCase();
    const data = this.planets.filter(
      (datas) =>
        datas.name !== this.firstCtrl.value &&
        datas.name !== this.secondCtrl.value &&
        datas.name !== this.fourthCtrl.value
    );
    if (data && data.length < this.planets.length) {
      return data.filter(
        (datas) => datas.name.toLowerCase().indexOf(filterValue) === 0
      );
    } else {
      return this.planets.filter(
        (datas) => datas.name.toLowerCase().indexOf(filterValue) === 0
      );
    }
  }
  /**
   * Method which is used to filter the fourth planet object
   * @param value Which holds the current user choosen fourth planet value
   */
  private _filterFourthPlanet(value: string): Planet[] {
    this.appService.distanceChanges(0, 'fourth');

    const filterValue = value.toLowerCase();
    const data = this.planets.filter(
      (datas) =>
        datas.name !== this.firstCtrl.value &&
        datas.name !== this.secondCtrl.value &&
        datas.name !== this.thirdCtrl.value
    );
    if (data && data.length < this.planets.length) {
      return data.filter(
        (datas) => datas.name.toLowerCase().indexOf(filterValue) === 0
      );
    } else {
      return this.planets.filter(
        (datas) => datas.name.toLowerCase().indexOf(filterValue) === 0
      );
    }
  }
  /**
   * Method which is used to change the vehicle list dynmaically for first planet
   * @param event Which holds the current selected list of first planet
   */
  onFirstSelection(event: MatSelectionListChange) {
    if (event) {
      const selectedPlanet = this.planets.find(
        (datas) => datas.name === this.firstCtrl.value
      );
      this.firstVehicleDynamicChanges.unshift(
        this.vehicles.find((datas) => datas.name === event.option.value.name)
      );
      if (this.firstVehicleDynamicChanges.length > 1) {
        this.appService.vehicleChanges(
          this.firstVehicleDynamicChanges[1],
          'add'
        );
        this.appService.vehicleChanges(
          this.firstVehicleDynamicChanges[0],
          'delete'
        );
      } else {
        this.appService.vehicleChanges(event.option.value, 'delete');
      }
      this.distanceCalculated(selectedPlanet, event.option.value, 'first');
      this.firstVehicle = event.option.value;
    } else {
      return false;
    }
  }
  /**
   * Method which is used to change the vehicle list dynmaically for second planet
   * @param event Which holds the current selected list of second planet
   */
  onSecondSelection(event: MatSelectionListChange) {
    if (event) {
      const selectedPlanet = this.planets.find(
        (datas) => datas.name === this.secondCtrl.value
      );
      this.secondVehicleDynamicChanges.unshift(
        this.vehicles.find((datas) => datas.name === event.option.value.name)
      );
      if (this.secondVehicleDynamicChanges.length > 1) {
        this.appService.vehicleChanges(
          this.secondVehicleDynamicChanges[1],
          'add'
        );
        this.appService.vehicleChanges(
          this.secondVehicleDynamicChanges[0],
          'delete'
        );
      } else {
        this.appService.vehicleChanges(event.option.value, 'delete');
      }
      this.distanceCalculated(selectedPlanet, event.option.value, 'second');
      this.secondVehicle = event.option.value;
    } else {
      return false;
    }
  }
  /**
   * Method which is used to change the vehicle list dynmaically for third planet
   * @param event Which holds the current selected list of third planet
   */
  onThirdSelection(event: MatSelectionListChange) {
    if (event) {
      const selectedPlanet = this.planets.find(
        (datas) => datas.name === this.thirdCtrl.value
      );

      this.thirdVehicleDynamicChanges.unshift(
        this.vehicles.find((datas) => datas.name === event.option.value.name)
      );
      if (this.thirdVehicleDynamicChanges.length > 1) {
        this.appService.vehicleChanges(
          this.thirdVehicleDynamicChanges[1],
          'add'
        );

        this.appService.vehicleChanges(
          this.thirdVehicleDynamicChanges[0],
          'delete'
        );
      } else {
        this.appService.vehicleChanges(event.option.value, 'delete');
      }
      this.distanceCalculated(selectedPlanet, event.option.value, 'third');
      this.thirdVehicle = event.option.value;
    } else {
      return false;
    }
  }
  /**
   * Method which is used to change the vehicle list dynmaically for fourth planet
   * @param event Which holds the current selected list of fourth planet
   */
  onFourthSelection(event: MatSelectionListChange) {
    if (event) {
      const selectedPlanet = this.planets.find(
        (datas) => datas.name === this.fourthCtrl.value
      );
      this.fourthVehicleDynamicChanges.unshift(
        this.vehicles.find((datas) => datas.name === event.option.value.name)
      );
      if (this.fourthVehicleDynamicChanges.length > 1) {
        this.appService.vehicleChanges(
          this.fourthVehicleDynamicChanges[1],
          'add'
        );
        this.appService.vehicleChanges(
          this.fourthVehicleDynamicChanges[0],
          'delete'
        );
      } else {
        this.appService.vehicleChanges(event.option.value, 'delete');
      }
      this.distanceCalculated(selectedPlanet, event.option.value, 'fourth');
      this.fourthVehicle = event.option.value;
    } else {
      return false;
    }
  }
  /**
   * Method which is used to return the boolean value for list disable or not
   * @param vehicle Which holds the choosen vehicle object
   * @param fetchFrom Which holds from which planet field it came (first,second,third,fourth)
   */
  checkDisable(vehicle, fetchFrom) {
    if (fetchFrom === 'first') {
      const data = this.planets.find(
        (datas) => datas.name === this.firstCtrl.value
      );
      if (
        (data && vehicle.max_distance < data.distance) ||
        vehicle.total_no === 0
      ) {
        return true;
      } else {
        return false;
      }
    } else if (fetchFrom === 'second') {
      const data = this.planets.find(
        (datas) => datas.name === this.secondCtrl.value
      );

      if (
        (data && vehicle.max_distance < data.distance) ||
        vehicle.total_no === 0
      ) {
        return true;
      } else {
        return false;
      }
    } else if (fetchFrom === 'third') {
      const data = this.planets.find(
        (datas) => datas.name === this.thirdCtrl.value
      );
      if (
        (data && vehicle.max_distance < data.distance) ||
        vehicle.total_no === 0
      ) {
        return true;
      } else {
        return false;
      }
    } else if (fetchFrom === 'fourth') {
      const data = this.planets.find(
        (datas) => datas.name === this.fourthCtrl.value
      );
      if (
        (data && vehicle.max_distance < data.distance) ||
        vehicle.total_no === 0
      ) {
        return true;
      } else {
        return false;
      }
    }
  }
  /**
   * Method which is used to reset the find falcone home again.
   */
  resetGame() {
    this.router.navigate(['../home']);
  }
  /**
   * Method which is used to calulate the currect distance
   * @param planet which holds the planet object
   * @param vehicles which holds the vehicle object
   * @param planetFrom which holds from which planet this object came.
   */
  distanceCalculated(planet, vehicles, planetFrom) {
    const data = planet.distance / vehicles.speed;
    this.appService.distanceChanges(data, planetFrom, vehicles);
  }
  /**
   * Method which is used to check whether falcone result is findable or not
   */
  isFindable() {
    if (
      this.firstVehicle &&
      this.firstVehicle.name &&
      this.secondVehicle &&
      this.secondVehicle.name &&
      this.thirdVehicle &&
      this.thirdVehicle.name &&
      this.fourthVehicle &&
      this.fourthVehicle.name &&
      this.firstCtrl &&
      this.firstCtrl.value &&
      this.secondCtrl &&
      this.secondCtrl.value &&
      this.thirdCtrl &&
      this.thirdCtrl.value &&
      this.fourthCtrl &&
      this.fourthCtrl.value
    ) {
      return true;
    } else {
      return false;
    }
  }
  /**
   * Method which is used to get the falcone result
   */
  findFalcone() {
    window.scrollBy({
      top: 0,
      behavior: 'smooth',
    });
    const data = {
      planets: [
        this.firstCtrl.value,
        this.secondCtrl.value,
        this.thirdCtrl.value,
        this.fourthCtrl.value,
      ],
    };
    this.snackBar.open(
      'We are Searching , Please wait for a while',
      'Information',
      {
        duration: 1500,
      }
    );
    this.subscriptionArray['getResult'] = this.appService
      .findFlacone(data)
      .subscribe(
        (result) => {
          this.appService.setResult(result, this.distanceCovered);
          this.router.navigate(['../result']);
        },
        (error) => {
          this.snackBar.open('Find falcone api call failed', 'Information', {
            duration: 1000,
          });
          this.router.navigate(['../home']);
        }
      );
  }
  /**
   * Component OnDestroy life cycle hook.
   * And unsubscribe all the subscriptions in the component.
   */
  ngOnDestroy(): void {
    if (this.subscriptionArray && this.subscriptionArray.length > 0) {
      this.subscriptionArray.forEach((item) => item.unsubscribe());
    }
    this.appService.resetEverything();
    this.thirdCtrl.reset();
    this.firstCtrl.reset();
    this.secondCtrl.reset();
    this.fourthCtrl.reset();
  }
}

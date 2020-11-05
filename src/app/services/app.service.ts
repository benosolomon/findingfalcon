import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProcessHttpService } from './process-http.service';
import { baseURL } from '../shared/baseurl';
import { Planet } from '../shared/planet';
import { Vehicle } from '../shared/vehicle';
import { Observable } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import { Subject } from 'rxjs/internal/Subject';
/**
 * Class which is used for store the planet,vehicle and result object for our application.
 */
@Injectable({
  providedIn: 'root',
})
export class AppService {
  /**
   * Variable which is used to store the result object.
   */
  result: any = {};
  /**
   * Array which is used to store all the vehicle data.
   */
  initialVehicle: Vehicle[] = [];
  /**
   * Array which is used to store all the vehicle data dynamically based on the application user selected.
   */
  allVehicles: Vehicle[] = [];
  /**
   * Observable which is used to check and react according to the user changes of vehicle object.
   */
  vehicleSubject: Subject<any>;
  /**
   * Observable which is used to store the distance dynamically..
   */
  distanceCalculatedSubject: Subject<any>;
  /**
   * Object which is used to store the http protocol header object.
   */
  headers: HttpHeaders;
  /**
   * Variable which is used to store the first planet reached distance by vehicles
   */
  firstPlanetDistance = 0;
  /**
   * Variable which is used to store the second planet reached distance by vehicles
   */
  secondPlanetDistance = 0;
  /**
   * Variable which is used to store the third planet reached distance by vehicles
   */
  thirdPlanetDistance = 0;
  /**
   * Variable which is used to store the fourth planet reached distance by vehicles
   */
  fourthPlanetDistance = 0;
  /**
   * Variable which is used to store the first choosen vehicle name.
   */
  firstVehicle;
  /**
   * Variable which is used to store the second choosen vehicle name.
   */
  secondVehicle;
  /**
   * Variable which is used to store the third choosen vehicle name.
   */
  thirdVehicle;
  /**
   * Variable which is used to store the fourth choosen vehicle name.
   */
  fourthVehicle;
  /**
   *  Constructor which is used to inject the required service
   * @param http To send the request and get response from server
   * @param processHttp To make the error object dynamically
   */
  constructor(
    private http: HttpClient,
    private processHttp: ProcessHttpService
  ) {
    this.headers = new HttpHeaders()
      .append('Accept', 'application/json')
      .append('Content-Type', 'application/json');
    // create new subject object for distance calculation
    this.distanceCalculatedSubject = new Subject<any>();
    // create new subject object for vehicle calculation
    this.vehicleSubject = new Subject<any>();
  }
  /**
   * Method which is used to get the planets data from server.
   */
  getPlanets(): Observable<Planet[]> {
    return this.http
      .get<Planet[]>(baseURL + 'planets')
      .pipe(catchError(this.processHttp.handleError));
  }
  /**
   * Method which is used to get the vehicle data from server.
   */
  getVehicles(): Observable<Vehicle[]> {
    return this.http
      .get<Vehicle[]>(baseURL + 'vehicles')
      .pipe(catchError(this.processHttp.handleError));
  }
  /**
   * Method which is used to add, remove the selected vehicle list dynamically.
   * @param data which holds the selected vehcile object
   * @param status which holds the action to be done (add,delete)
   */
  vehicleChanges(data, status) {
    if (status !== 'reset') {
      this.allVehicles
        .filter((datas) => datas.name === data.name)
        .filter(
          (datas) =>
            (datas.total_no =
              status === 'add' ? datas.total_no + 1 : datas.total_no - 1)
        );
      this.vehicleSubject.next({ value: [...this.allVehicles] });
    } else {
      this.vehicleSubject.next({ value: [...this.initialVehicle] });
    }
  }
  /**
   * Method which is used to return the observable if vehicle value cahnged
   */
  onVehicleLogs(): Observable<any> {
    return this.vehicleSubject.asObservable();
  }
  /**
   * Method which is used to change the distance covered value dynamically.
   * @param data which hold the distance value
   * @param planetFrom which hold from which planet object it came
   * @param vehcle which holds the vehicle object.
   */
  distanceChanges(data, planetFrom, vehcle?) {
    if (planetFrom === 'first') {
      this.firstPlanetDistance = data;
      vehcle ? (this.firstVehicle = vehcle.name) : '';
    }

    if (planetFrom === 'second') {
      this.secondPlanetDistance = data;
      vehcle ? (this.secondVehicle = vehcle.name) : '';
    }

    if (planetFrom === 'third') {
      this.thirdPlanetDistance = data;
      vehcle ? (this.thirdVehicle = vehcle.name) : '';
    }

    if (planetFrom === 'fourth') {
      this.fourthPlanetDistance = data;
      vehcle ? (this.fourthVehicle = vehcle.name) : '';
    }

    this.distanceCalculatedSubject.next({
      value:
        this.firstPlanetDistance +
        this.secondPlanetDistance +
        this.thirdPlanetDistance +
        this.fourthPlanetDistance,
    });
  }
  /**
   * Method which is used to return the observable after distance changed.
   */
  onDistanceChange(): Observable<any> {
    return this.distanceCalculatedSubject.asObservable();
  }
  /**
   * Method which is used to reset every values and subscription.
   */
  resetEverything() {
    this.allVehicles = [];
    this.initialVehicle = [];

    this.distanceCalculatedSubject.next();

    this.vehicleSubject.next();
    this.distanceCalculatedSubject.next();
  }
  /**
   * Method which is used to set the result object
   * @param res Which holds the response object
   * @param timeTaken Which holds the distance covered value.
   */
  setResult(res: any, timeTaken) {
    this.result = res;
    this.result['timeTaken'] = timeTaken;
  }
  /**
   * Method which is used to return the resule object.
   */
  getResult() {
    return this.result;
  }
  /**
   * Method which is used to find the falcone finally.
   * @param data Which hold the req related objects
   */
  findFlacone(data) {
    return this.http
      .post<string>(baseURL + 'token', null, { headers: this.headers })
      .pipe(mergeMap((token) => this.find(token, data)));
  }
  /**
   * Method which is used to get the result after all planets, vehicle selected.
   * @param token which hold the token value
   * @param data which hold the object value
   */
  find(token: any, data: any) {
    let body = {
      token: token.token,
      planet_names: data.planets,
      vehicle_names: [
        this.firstVehicle,
        this.secondVehicle,
        this.thirdVehicle,
        this.fourthVehicle,
      ],
    };
    return this.http.post<any>(baseURL + 'find', body, {
      headers: this.headers,
    });
  }
}

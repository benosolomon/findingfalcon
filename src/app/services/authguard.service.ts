import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AppService } from './app.service';

/**
 * Guard which is used to denied the result is accessble or not.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthguardService {
  /**
   *  Constructor which is used to inject the required service
   * @param appService Service which is used to access the application objet
   * @param router To navigate the user
   */
  constructor(private appService: AppService, private router: Router) {}
  /**
   * Method which is used to decide whether the route can be activated or not.
   * @param next Which is used to define the future route that will be activated.
   * @param state Which is used to define the future routerstate.
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // Check whether the result object is get or not
    if (this.appService.getResult().status) {
      return true;
    }
    // if result object is not accessable means we navigate the user to home page.
    this.router.navigate(['/home']);
    return false;
  }
}

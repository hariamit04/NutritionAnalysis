import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { User } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>;
  private userdet: User;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(app_id: string, app_key: string) {
    //return this.http.post<any>(`${environment.apiUrl}/users/authenticate`, { app_id, app_key })
    //    .pipe(map(user => {
    //        // store user details and jwt token in local storage to keep user logged in between page refreshes
    //        localStorage.setItem('currentUser', JSON.stringify(user));
    //      this.currentUserSubject.next(user);
    //      alert('1');
    //      alert(user);
    //        return user;
    //    }));
    return this.http.get<any>('https://api.edamam.com/api/nutrition-data?app_id=' + app_id + '&app_key=' + app_key + '&ingr=apple')
      .pipe(map(user => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        this.userdet = { id: 1, app_id: app_id, app_key: app_key, firstName: 'Test', lastName: 'User' };
        localStorage.setItem('currentUser', JSON.stringify(this.userdet));
        this.currentUserSubject.next(this.userdet);
        //alert(JSON.stringify(user));
        return user;
      }));

  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}

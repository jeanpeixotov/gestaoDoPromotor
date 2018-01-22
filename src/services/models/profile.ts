import device from 'react-native-device-info';
import { Observable, Subject } from 'rxjs';

import { dateFormatter } from '../../formatters/date';
import { IUser } from '../../interfaces/user';
import { IUserToken } from '../../interfaces/userToken';
import { ApiService } from './api';
import { CacheService } from './cache';
import { TokenService } from './token';

export class ProfileService {
  private profileUpdate$: Subject<IUser>;

  constructor(
    private churchSlug: string,
    private apiService: ApiService,
    private cacheService: CacheService,
    private tokenService: TokenService
  ) {
    this.profileUpdate$ = new Subject();
  }

  public get(refresh?: boolean): Observable<IUser> {
    return this.tokenService.getToken().switchMap(token => {
      if (!token) {
        return Observable.of(null);
      }

      return this.apiService.get<IUser>('profile')
        .cache('service-profile', { refresh })
        .map(profile => {
          return dateFormatter.parseObj(profile);
        }).concat(this.profileUpdate$);
    });
  }

  public save(model: IUser): Observable<IUser> {
    return this.apiService.post<IUser>('profile', model).map(profile => {
      profile = dateFormatter.parseObj(profile);
      this.profileUpdate$.next(profile);
      return profile;
    });
  }

  public isLogged(): Observable<boolean> {
    return this.userChanged().map(t => !!t);
  }

  public userChanged(): Observable<IUserToken> {
    return this.tokenService.getUser()
      .distinctUntilChanged((n, o) => (n || { id: null }).id === (o || { id: null }).id);
  }

  public logout(): Observable<void> {
    return this.apiService
      .post('profile/logout', { deviceId: device.getUniqueID(), application: this.churchSlug })
      .switchMap(() => this.tokenService.clearToken())
      .switchMap(() => this.cacheService.clear());
  }

}
import { Observable } from 'rxjs';

import { dateFormatter } from '../../formatters/date';
import { IProvider } from '../../interfaces/provider';
import { enInformativeType } from '../enums/informativeType';
import { ApiService } from './api';

export class ProviderService {
  constructor(private apiService: ApiService) { }

  public list(refresh?: boolean): Observable<IProvider[]> {
    return this.apiService.get<IProvider[]>('informatives')
      .cache('service-informative-list', { refresh })
      .map(data => {
        return (data || []).map(informative => {
          informative.icon = informative.typeId === enInformativeType.cell ? 'home' : 'cart';
          return dateFormatter.parseObj(informative);
        });
      });
  }

  public get(id: number, refresh?: boolean): Observable<IProvider> {
    return this.list(refresh)
      .first()
      .switchMap(providers => {
        const provider = providers.find(i => i.id === id);

        if (provider) {
          return Observable.of(provider);
        }

        return this.apiService
          .get<IProvider>(`informatives/${id}`)
          .map(i => dateFormatter.parseObj(i));
      });
  }

  public last(refresh?: boolean): Observable<IProvider> {
    return this.list(refresh).map(providers => providers[0]);
  }

}
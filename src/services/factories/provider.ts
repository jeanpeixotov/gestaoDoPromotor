import { Container } from '../container';
import { ProviderService } from '../models/provider';

export function providerFactory(container: Container): ProviderService {
  return new ProviderService(container.get('apiService'));
}
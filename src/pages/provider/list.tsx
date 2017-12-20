import { Body, Button, Container, Content, Header, Icon, Left, List, ListItem, Right, Text, Title } from 'native-base';
import * as React from 'react';
import { RefreshControl } from 'react-native';
import { NavigationDrawerScreenOptions } from 'react-navigation';

import { BaseComponent, IStateBase } from '../../components/base';
import { ErrorMessage } from '../../components/errorMessage';
import { dateFormatter } from '../../formatters/date';
import { IProvider } from '../../interfaces/provider';
import { toast } from '../../providers/toast';
import * as services from '../../services';
import { ProviderService } from '../../services/models/provider';
import { theme } from '../../theme';

interface IState extends IStateBase {
  refreshing: boolean;
  providers: IProvider[];
  error?: any;
}

export default class ProviderListPage extends BaseComponent<IState> {
  public static navigationOptions: NavigationDrawerScreenOptions = {
    drawerLabel: 'Fornecedores' as any,
    drawerIcon: ({ tintColor }) => (
      <Icon name='cart' style={{ color: tintColor }} />
    )
  };

  private providerService: ProviderService;

  constructor(props: any) {
    super(props);

    this.providerService = services.get('providerService');
    this.state = { refreshing: true, providers: [] };
  }

  public componentDidMount(): void {
    this.load();
  }

  public details(provider: IProvider): void {
    this.navigate('ProviderDetails', { provider });
  }

  public load(refresh: boolean = false): void {
    this.setState({ refreshing: true }, true);

    this.providerService.list(refresh)
      .logError()
      .bindComponent(this)
      .subscribe(providers => {
        providers = providers || [];
        this.setState({ refreshing: false, providers, error: false });
      }, error => {
        if (refresh) toast('Não conseguimos atualizar');
        this.setState({ refreshing: false, error });
      });
  }

  public render(): JSX.Element {
    const { refreshing, providers, error } = this.state;

    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={() => this.openDrawer()}>
              <Icon name='menu' />
            </Button>
          </Left>
          <Body>
            <Title>Fornecedores</Title>
          </Body>
          <Right />
        </Header>
        <Content
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => this.load(true)} />
          }
        >
          {!refreshing && error && !providers.length &&
            <ErrorMessage error={error} />
          }
          <List dataArray={providers} renderRow={provider =>
            <ListItem button key={provider.id} style={theme.listItem} onPress={() => this.details(provider)}>
              <Left style={theme.listIconWrapper}>
                <Icon name={provider.icon} style={theme.listIcon} />
              </Left>
              <Body>
                <Text>{provider.title}</Text>
                <Text note>{dateFormatter.format(provider.date, 'dddd, DD [de] MMMM [de] YYYY')}</Text>
              </Body>
              <Right style={theme.listIconWrapperSmall}>
                <Icon name='arrow-forward' />
              </Right>
            </ListItem>
          }
          />
        </Content>
      </Container>
    );
  }
}
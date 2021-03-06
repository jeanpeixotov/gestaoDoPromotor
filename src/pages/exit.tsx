import {
  Body,
  Button,
  Container,
  Content,
  Header,
  Icon,
  Left,
  Right,
  Spinner,
  Text,
  Title,
  View,
} from 'native-base';
import * as React from 'react';
import { Image, Linking, StyleSheet } from 'react-native';
import { NavigationDrawerScreenOptions } from 'react-navigation';

import { BaseComponent, IStateBase } from '../components/base';
import { ErrorMessage } from '../components/errorMessage';
import * as services from '../services';
import { ChurchService } from '../services/models/church';
import { theme } from '../theme';

interface IState extends IStateBase {
  loading: boolean;
  error?: any;
}

export default class ExitPage extends BaseComponent<IState> {
  public static navigationOptions: NavigationDrawerScreenOptions = {
    drawerLabel: 'Sair' as any,
    drawerIcon: ({ tintColor }) => (
      <Icon name='exit' style={{ color: tintColor }} />
    )
  };

  private churchService: ChurchService;

  constructor(props: any) {
    super(props);

    this.churchService = services.get('churchService');
    this.state = { loading: true };
  }

  public componentDidMount(): void {
    this.churchService.info()
      .logError()
      .bindComponent(this)
      .subscribe(church => {
        this.setState({ loading: false, error: null });
      }, error => this.setState({ loading: false, error }));
  }

  public openUrl(url: string): void {
    Linking.openURL(url);
  }

  public render(): JSX.Element {
    const { loading, error } = this.state;

    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={() => this.openDrawer()}>
              <Icon name='menu' style={theme.menuIcon} />
            </Button>
          </Left>
          <Body>
            <Title>{'Gestão do Promotor'}</Title>
          </Body>
          <Right />
        </Header>
        <Content>
          {loading && <Spinner />}
          {!loading && !!error &&
            <ErrorMessage error={error} />
          }
          {!loading && !error &&
            <View style={styles.container}>
              <View style={StyleSheet.flatten([theme.emptyMessage, theme.alignCenter])}>
                <Image source={require('../images/logo.png')} style={styles.logo} />

                <Button block onPress={() => this.navigate('Welcome', { force: true })}>
                  <Text>SAIR</Text>
                </Button>
              </View>

            </View>
          }
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingBottom: 20
  },
  logo: {
    height: 120,
    width: 120,
    marginBottom: 30
  },
  headerText: {
    opacity: 0.6
  },
  list: {
    marginTop: 30
  },
  listItem: {
    borderBottomWidth: 0
  }
});

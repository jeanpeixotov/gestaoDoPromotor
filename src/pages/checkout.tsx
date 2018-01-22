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
  Card,
  CardItem
} from 'native-base';
import * as React from 'react';
import { Linking, StyleSheet } from 'react-native';
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

export default class CheckOutPage extends BaseComponent<IState> {
  public static navigationOptions: NavigationDrawerScreenOptions = {
    drawerLabel: 'Check-out' as any,
    drawerIcon: ({ tintColor }) => (
      <Icon name='arrow-down' style={{ color: tintColor }} />
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
      <Container style={styles.container}>
        <Header>
          <Left>
            <Button transparent onPress={() => this.openDrawer()}>
              <Icon name='menu' style={theme.menuIcon}/>
            </Button>
          </Left>
          <Body>
            <Title style={theme.headerTitle}>Check-Out</Title>
          </Body>
          <Right />
        </Header>
        <Content>
          {loading && <Spinner />}
          {!loading && !!error &&
            <ErrorMessage error={error} />
          }
          {!loading && !error &&
            <View>
              <View style={StyleSheet.flatten([theme.emptyMessage, theme.alignCenter])}>
                <Icon name="md-exit" style={styles.thumbnail}/>
                <Text style={styles.loginText}>Tem certeza que deseja efetuar o check-out ?</Text>
                <Button block onPress={() => this.navigate('Welcome', { force: true })} rounded>
                  <Text>Check-out</Text>
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
    backgroundColor: '#F2F2F2',
  },
  loginText: {
    marginTop: 10,
    textAlign: 'center',
    marginBottom: 150,
    fontSize: 20,
    fontWeight: 'bold'
  },
  thumbnail: {
    color: '#333',
    fontSize: 220
  },
  label: {
    marginTop: 20
  },
  listItem: {
    marginBottom: 30
  },
  cardContent: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

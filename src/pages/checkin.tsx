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
  ListItem,
  Picker,
  Item,
  Label,
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

export default class CheckInPage extends BaseComponent<IState> {
  public static navigationOptions: NavigationDrawerScreenOptions = {
    drawerLabel: 'Check-in' as any,
    drawerIcon: ({ tintColor }) => (
      <Icon name='pin' style={{ color: tintColor }} />
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
              <Icon name='menu' style={theme.menuIcon}/>
            </Button>
          </Left>
          <Body>
            <Title style={theme.headerTitle}>Check-In</Title>
          </Body>
          <Right />
        </Header>
        <Content style={styles.container}>
          {loading && <Spinner />}
          {!loading && !!error &&
            <ErrorMessage error={error} />
          }
          {!loading && !error &&
            <View style={StyleSheet.flatten([theme.emptyMessage, theme.alignCenter])}>
              <Card style={styles.thumbnail}>
                <CardItem>
                  <Body style={styles.cardContent}>
                  </Body>
                </CardItem>
              </Card>
              <Text style={styles.loginText}>Escolha a rede e a loja que deseja fazer o checkin:</Text>
              <Label style={styles.label}>Rede</Label>
              <ListItem>
                <Picker
                  iosHeader="Rede"
                  mode="dropdown"
                  selectedValue={"key0"}
                  style={styles.picker}
                >
                  <Item label="Assai" value="key0" />
                  <Item label="Extra" value="key1" />
                  <Item label="Carrefour" value="key2" />
                </Picker>
              </ListItem>
              <Label style={styles.label}>Loja</Label>
              <ListItem style={styles.listItem}>
                <Picker
                  iosHeader="Loja"
                  mode="dropdown"
                  selectedValue={"key0"}
                  style={styles.picker}
                >
                  <Item label="Sorocaba 1" value="key0" />
                  <Item label="Sorocaba 2" value="key1" />
                  <Item label="São Paulo 1" value="key2" />
                </Picker>
              </ListItem>
              <Button block onPress={() => this.navigate('Welcome', { force: true })} rounded>
                <Text>Check-in</Text>
              </Button>
            </View>

          }
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F2F2F2'
  },
  loginText: {
    marginTop: 10,
    textAlign: 'center',
    marginBottom: 20
  },
  picker: {
    width: 270,
    height: 18
  },
  thumbnail: {
    width: 300,
    height: 200,
    borderWidth: 1,
    borderColor: '#000'
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

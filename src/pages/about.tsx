import {
  Body,
  Button,
  Container,
  Content,
  H2,
  Header,
  Icon,
  Left,
  List,
  Right,
  Spinner,
  Title,
  View,
  ListItem,
  Text
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

export default class AboutPage extends BaseComponent<IState> {
  public static navigationOptions: NavigationDrawerScreenOptions = {
    drawerLabel: 'Sobre o aplicativo' as any,
    drawerIcon: ({ tintColor }) => (
      <Icon name='information-circle' style={{ color: tintColor }} />
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
            <Title style={theme.headerTitle}>{'Sobre o aplicativo'}</Title>
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
              <View style={theme.alignCenter}>
                <Image source={require('../images/logo.png')} style={styles.logo} />
                <H2 style={styles.headerText}>{'Sobre o aplicativo'}</H2>
              </View>
              <List style={styles.list}>
                <ListItem last>
                  <Text style={styles.about}>Consulte informações sobre seus promotores a qualquer hora e em qualquer
                  lugar. Acompanhe métricas e analise performance por região ou filial.</Text>
                </ListItem>
              </List>
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
    height: 150,
    width: 300,
    marginBottom: 30
  },
  headerText: {
    marginBottom: 10
  },
  list: {
    marginTop: 0
  },
  listItem: {
    borderBottomWidth: 0
  },
  about: {
    textAlign: 'center'
  }
});

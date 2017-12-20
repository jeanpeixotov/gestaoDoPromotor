import { Button, Container, Icon, Text, View, Form, Item, Input } from 'native-base';
import * as React from 'react';
import { Animated, Image, ImageBackground, StatusBar, StyleSheet } from 'react-native';
import SplashScreen from 'react-native-splash-screen';

import { BaseComponent, IStateBase } from '../components/base';
import { alertError } from '../providers/alert';
import * as services from '../services';
import { FacebookService } from '../services/models/facebook';
import { NotificationService } from '../services/models/notification';
import { ProfileService } from '../services/models/profile';
import { StorageService } from '../services/models/storage';
import { isDevelopment } from '../settings';
import { theme, variables } from '../theme';

interface IState extends IStateBase {
  loaded: boolean;
  animationHeight: Animated.Value;
  animationFade: Animated.Value;
  animationClass: any;
  force: boolean;
}

export default class WelcomPage extends BaseComponent<IState> {
  private storageService: StorageService;
  private notificationService: NotificationService;
  private profileService: ProfileService;
  private facebookService: FacebookService;

  constructor(props: any) {
    super(props);

    this.storageService = services.get('storageService');
    this.notificationService = services.get('notificationService');
    this.profileService = services.get('profileService');
    this.facebookService = services.get('facebookService');

    this.state = {
      loaded: false,
      animationHeight: new Animated.Value(0),
      animationFade: new Animated.Value(0),
      animationClass: {},
      force: (this.params || {}).force
    };
  }

  public navigateToHome(): void {
    if (this.state.force) {
      this.goBack();
      return;
    }

    if (isDevelopment) return this.navigate('Home', null, true);
    this.navigate('Home', null, true);
  }

  public completed(): void {
    this.storageService.set('welcomeCompleted', true)
      .logError()
      .bindComponent(this)
      .subscribe(() => this.navigateToHome());
  }

  public viewLoaded(event: any): void {
    if (this.state.loaded || this.state.force) {
      return;
    }

    this.setState({ loaded: true });
    const finalHeight = event.nativeEvent.layout.height;
    this.notificationService.appDidOpen();

    this.storageService.get<boolean>('welcomeCompleted')
      .combineLatest(this.notificationService.hasInitialNotification().first())
      .map(([welcomeCompleted, hasNotification]) => {

        if (hasNotification) {
          return;
        }

        if (welcomeCompleted) {
          this.navigateToHome();
          SplashScreen.hide();
          return;
        }

        this.animate(finalHeight);
      })
      .logError()
      .bindComponent(this)
      .subscribe();
  }

  public animate(finalHeight: number): void {
    this.setState({
      animationClass: {
        height: this.state.animationHeight,
        opacity: this.state.animationFade
      }
    }).then(() => {
      SplashScreen.hide();
      setTimeout(() => {
        Animated.timing(this.state.animationFade, { toValue: 1 }).start();
        Animated.timing(this.state.animationHeight, { toValue: finalHeight }).start();
      }, 500);
    });
  }

  public loginSocial(provider: 'facebook'): void {
    const providers = {
      'facebook': this.facebookService
    };

    providers[provider].login()
      .filter(accessToken => !!accessToken)
      .switchMap(accessToken => this.profileService.register(provider, accessToken))
      .loader()
      .logError()
      .bindComponent(this)
      .subscribe(() => this.completed(), err => alertError(err).subscribe());
  }

  public render(): JSX.Element {
    return (
      <Container>
        <View style={styles.container}>
          <StatusBar backgroundColor='#000000'></StatusBar>
          <Image source={require('../images/logo.png')} style={styles.logo} />
          <Animated.View
            onLayout={(event: any) => this.viewLoaded(event)}
            style={this.state.animationClass}>

            <Form>
              <Item style={styles.formItem}>
                <Input placeholder='Usuário' style={styles.formInput} />
              </Item>
              <Item style={styles.formItem}>
                <Input placeholder='Senha' style={styles.formInput} secureTextEntry />
              </Item>
            </Form>
            <View style={styles.buttons}>
              <Button onPress={() => this.navigate('Welcome')} iconLeft style={StyleSheet.flatten([styles.loginIcon, theme.iconLarge])}>
                <Icon name='contact' />
                <Text>Entrar</Text>
              </Button>
            </View>
            <View style={styles.skipWrapper}>
              <Button block transparent onPress={() => this.completed()}>
                <Text style={styles.skipText}>PULAR</Text>
              </Button>
            </View>
          </Animated.View>
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loginIcon: {
    marginTop: 20,
    marginBottom: 10,
    color: variables.accent
  },
  formItem: {
    width: 200,
    textAlign: 'center',
    marginRight: 25,
    color: 'white',
    backgroundColor: 'transparent'
  },
  formInput: {
    color: 'white'
  },
  // welcome: {
  //   fontSize: 30,
  //   textAlign: 'center',
  //   marginBottom: 5,
  //   color: 'white',
  //   backgroundColor: 'transparent'
  // },
  // instructions: {
  //   fontSize: 20,
  //   textAlign: 'center',
  //   color: 'white',
  //   backgroundColor: 'transparent'
  // },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: variables.deviceHeight,
    width: variables.deviceWidth,
    backgroundColor: 'black'
  },
  logo: {
    height: 120,
    width: 120,
    marginBottom: 30
  },
  buttons: {
    marginTop: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonFirst: {
    marginRight: 20
  },
  skipWrapper: {
    marginTop: 50,
  },
  skipText: {
    color: 'white'
  }
});
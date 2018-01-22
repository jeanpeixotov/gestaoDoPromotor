import { Button, Container, Text, View, Form, Item, Input } from 'native-base';
import * as React from 'react';
import { Animated, Image, StatusBar, StyleSheet } from 'react-native';
import SplashScreen from 'react-native-splash-screen';

import { BaseComponent, IStateBase } from '../components/base';
import { alertError } from '../providers/alert';
import * as services from '../services';
import { FacebookService } from '../services/models/facebook';
import { StorageService } from '../services/models/storage';
import { isDevelopment } from '../settings';
import { variables } from '../theme';

interface IState extends IStateBase {
  loaded: boolean;
  animationHeight: Animated.Value;
  animationFade: Animated.Value;
  animationClass: any;
  force: boolean;
}

export default class WelcomPage extends BaseComponent<IState> {
  private storageService: StorageService;
  private facebookService: FacebookService;

  constructor(props: any) {
    super(props);

    this.storageService = services.get('storageService');
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

    this.storageService.get<boolean>('welcomeCompleted')
      .map((welcomeCompleted) => {

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
      .loader()
      .logError()
      .bindComponent(this)
      .subscribe(() => this.completed(), err => alertError(err).subscribe());
  }

  public render(): JSX.Element {
    return (
      <Container>
        <View style={styles.container}>
          <StatusBar backgroundColor='#000'></StatusBar>
          <Image source={require('../images/logo.png')} style={styles.logo} />
          <Animated.View
            onLayout={(event: any) => this.viewLoaded(event)}
            style={this.state.animationClass}>

            <Form style={styles.form}>
              <Item style={styles.formItem} inlineLabel>
                <Input style={styles.formInput} placeholder='Usuário' />
              </Item>
              <Item style={styles.formItem} inlineLabel>
                <Input style={styles.formInput} secureTextEntry placeholder='Senha' />
              </Item>
            </Form>
            <View style={styles.buttons}>
              <Button onPress={() => this.navigate('Welcome')} style={styles.buttonAccess} primary rounded>
                <Text style={styles.buttonAccessText}>Acessar</Text>
              </Button>
            </View>
            <View style={styles.skipWrapper}>
              <Button block transparent onPress={() => this.completed()}>
                <Text style={styles.skipText}>Esqueci minha senha</Text>
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
  form: {
    marginTop: 0,
    marginBottom: 40
  },
  formItem: {
    height: 32,
    width: 300,
    marginBottom: 35,
    backgroundColor: 'transparent'
  },
  labelFormItem: {
    marginBottom: 7,
    fontSize: 14
  },
  formInput: {
    color: 'black',
    fontSize: 16
  },
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
    width: 250,
    marginBottom: 10
  },
  buttons: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonFirst: {
    marginRight: 20,
    fontSize: 15
  },
  buttonAccess: {
    backgroundColor: '#6600fc',
    width: 200,
  },
  buttonAccessText: {
    textAlign: 'center',
    width: 150
  },
  skipWrapper: {
    marginTop: 5,
  },
  skipText: {
    color: 'black',
    fontSize: 12
  }
});

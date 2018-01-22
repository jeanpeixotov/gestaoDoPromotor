import { Body, Button, Container, Content, Header, Icon, Left, Right, Title, View } from 'native-base';
import * as React from 'react';
import { NavigationDrawerScreenOptions } from 'react-navigation';

import { BaseComponent } from '../../components/base';
import { theme } from '../../theme';
import ProviderCard from './components/providerCard';

export default class HomePage extends BaseComponent {
  public static navigationOptions: NavigationDrawerScreenOptions = {
    drawerLabel: 'Início' as any,
    drawerIcon: ({ tintColor }) => (
      <Icon name='home' style={{ color: tintColor }}/>
    )
  };

  public render(): JSX.Element {

    return (
      <Container style={theme.cardsContainer}>
        <Header>
          <Left>
            <Button transparent onPress={() => this.openDrawer()}>
              <Icon style={theme.menuIcon} name='menu' />
            </Button>
          </Left>
          <Body>
            <Title style={theme.headerTitle}>Início</Title>
          </Body>
          <Right />
        </Header>
        <Content>
          <View style={theme.cardsPadding}>
            <ProviderCard></ProviderCard>
          </View>
        </Content>
      </Container>
    );
  }
}

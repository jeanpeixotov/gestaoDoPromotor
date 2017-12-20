import { Body, Button, Container, Content, Header, Icon, Left, Right, Title, View } from 'native-base';
import * as React from 'react';
import { NavigationDrawerScreenOptions } from 'react-navigation';

import { BaseComponent } from '../../components/base';
import { theme } from '../../theme';
import ChurchCard from './components/churchCard';
import EventCard from './components/eventCard';
import EventFeaturedCard from './components/eventFeaturedCard';
import ProviderCard from './components/providerCard';

export default class HomePage extends BaseComponent {
  public static navigationOptions: NavigationDrawerScreenOptions = {
    drawerLabel: 'Início' as any,
    drawerIcon: ({ tintColor }) => (
      <Icon name='home' style={{ color: tintColor }} />
    )
  };

  public render(): JSX.Element {

    return (
      <Container style={theme.cardsContainer}>
        <Header>
          <Left>
            <Button transparent onPress={() => this.openDrawer()}>
              <Icon name='menu' />
            </Button>
          </Left>
          <Body>
            <Title>Gestão do Promotor</Title>
          </Body>
          <Right />
        </Header>
        <Content>
          <View style={theme.cardsPadding}>
            <EventFeaturedCard></EventFeaturedCard>
            <ChurchCard></ChurchCard>
            <ProviderCard></ProviderCard>
            <EventCard></EventCard>
          </View>
        </Content>
      </Container>
    );
  }
}

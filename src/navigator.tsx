import { DrawerNavigator, NavigationContainer, StackNavigator } from 'react-navigation';

import { SideMenu } from './components/sideMenu';
import DevPage from './pages/_dev';
import AboutPage from './pages/about';
import CheckInPage from './pages/checkin';
import CheckOutPage from './pages/checkout';
import ExitPage from './pages/exit';
import EventDetailsPage from './pages/event/details';
import EventListPage from './pages/event/list';
import HomePage from './pages/home';
import ProviderDetailsPage from './pages/provider/details';
import ProviderDetailsProductPage from './pages/provider/detailsProduct';
import ProviderListPage from './pages/provider/list';
import WelcomePage from './pages/welcome';
import { variables } from './theme';

const appDrawer = DrawerNavigator({
  Home: { screen: HomePage },
  Event: { screen: EventListPage },
  Provider: { screen: ProviderListPage },
  Checkin: { screen: CheckInPage },
  Checkout: { screen: CheckOutPage },
  About: { screen: AboutPage },
  Exit: { screen: ExitPage },
  Dev: { screen: DevPage },
}, {
    initialRouteName: 'Home',
    contentComponent: SideMenu as any,
    contentOptions: {
      inactiveTintColor: 'black',
      activeTintColor: variables.accent,
      ...(variables.platform === 'ios' ? {
        activeBackgroundColor: variables.toolbarDefaultBg
      } : {})
    }
  });

// tslint:disable-next-line:variable-name
export const Navigator: NavigationContainer = StackNavigator({
  Welcome: { screen: WelcomePage },
  Home: { screen: appDrawer },
  Event: { screen: appDrawer },
  EventDetails: { screen: EventDetailsPage },
  Provider: { screen: appDrawer },
  ProviderDetails: { screen: ProviderDetailsPage },
  ProviderDetailsProduct: { screen: ProviderDetailsProductPage },
  Checkin: { screen: appDrawer },
  Checkout: { screen: appDrawer },
  About: { screen: appDrawer },
  Exit: { screen: appDrawer },
  Dev: { screen: appDrawer }
}, {
    headerMode: 'none',
    initialRouteName: 'Welcome',
  });
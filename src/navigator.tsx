import { DrawerNavigator, NavigationContainer, StackNavigator } from 'react-navigation';

import { SideMenu } from './components/sideMenu';
import DevPage from './pages/_dev';
import ChurchPage from './pages/church';
import CheckInPage from './pages/checkin';
import CheckOutPage from './pages/checkout';
import ExitPage from './pages/exit';
import ChurchReportFormPage from './pages/church-report/form';
import ChurchReportListPage from './pages/church-report/list';
import EventDetailsPage from './pages/event/details';
import EventListPage from './pages/event/list';
import HomePage from './pages/home';
import ProviderDetailsPage from './pages/provider/details';
import ProviderListPage from './pages/provider/list';
import ProfileDetails from './pages/profile/details';
import ProfileEditPage from './pages/profile/form';
import WelcomePage from './pages/welcome';
import { variables } from './theme';

const appDrawer = DrawerNavigator({
  Home: { screen: HomePage },
  Profile: { screen: ProfileDetails },
  Event: { screen: EventListPage },
  Provider: { screen: ProviderListPage },
  Checkin: { screen: CheckInPage },
  Checkout: { screen: CheckOutPage },
  ChurchReport: { screen: ChurchReportListPage },
  Church: { screen: ChurchPage },
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
  Profile: { screen: appDrawer },
  ProfileEdit: { screen: ProfileEditPage },
  Event: { screen: appDrawer },
  EventDetails: { screen: EventDetailsPage },
  Provider: { screen: appDrawer },
  ProviderDetails: { screen: ProviderDetailsPage },
  ChurchReport: { screen: appDrawer },
  ChurchReportForm: { screen: ChurchReportFormPage },
  Checkin: { screen: appDrawer },
  Checkout: { screen: appDrawer },
  Church: { screen: appDrawer },
  Exit: { screen: appDrawer },
  Dev: { screen: appDrawer }
}, {
    headerMode: 'none',
    initialRouteName: 'Welcome',
  });
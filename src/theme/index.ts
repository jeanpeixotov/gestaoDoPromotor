import { Dimensions, StyleSheet } from 'react-native';

import variablesTheme from './native-base/variables/platform';

export const variables = variablesTheme;

export const theme = StyleSheet.create({
  headerTitle: {
    textAlign: 'center',
    fontSize: 17,
    width: 225,
    color: '#FFF'
  },
  menuIcon: {
    color: '#FFF'
  },
  buttonFacebook: {
    backgroundColor: '#3b5998'
  },
  buttonGoogle: {
    backgroundColor: '#de5245'
  },
  cardsContainer: {
    backgroundColor: '#f4f4f7'
  },
  cardsPadding: {
    padding: 8
  },
  fabPadding: {
    paddingBottom: 90
  },
  cardItemMultiline: {
    width: Dimensions.get('screen').width - 120,
  },
  centerPage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: Dimensions.get('window').height
  },
  emptyMessage: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16
  },
  textCenter: {
    textAlign: 'center'
  },
  alignCenter: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  alignRight: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end'
  },
  listItem: {
    marginLeft: 8,
    marginRight: 8,
    marginTop: 8,
    marginBottom: 3,
    backgroundColor: '#FAFAFA',
    borderWidth: 0.2,
    borderColor: '#000',
  },
  listIconWrapper: {
    maxWidth: 45,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  listIconWrapperSmall: {
    maxWidth: 25,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  listIcon: {
    width: 40,
    fontSize: 30,
    marginLeft: 10,
    textAlign: 'center'
  },
  iconLarge: {
    fontSize: 80
  }
});

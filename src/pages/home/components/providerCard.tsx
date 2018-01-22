import { Body, Button, Card, CardItem, Icon, Right, Spinner, Text, View } from 'native-base';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import { withNavigation } from 'react-navigation';

import { BaseComponent, IStateBase } from '../../../components/base';
import { dateFormatter } from '../../../formatters/date';
import { IProvider } from '../../../interfaces/provider';
import * as services from '../../../services';
import { ProviderService } from '../../../services/models/provider';
import { theme, variables } from '../../../theme';

interface IState extends IStateBase {
  loading: boolean;
  provider?: IProvider;
  error?: any;
}

class ProviderCard extends BaseComponent<IState> {
  private providerService: ProviderService;

  constructor(props: any) {
    super(props);

    this.providerService = services.get('providerService');
    this.state = { loading: true };
  }

  public componentDidMount(): void {
    this.providerService.last()
      .logError()
      .bindComponent(this)
      .subscribe(provider => {
        this.setState({ loading: false, provider, error: false });
      }, () => this.setState({ loading: false, error: true }));
  }

  public render(): JSX.Element {
    const { provider, loading, error } = this.state;

    return (
      <Card>
        <CardItem header>
          <Text>Último informativo</Text>
        </CardItem>
        {loading &&
          <CardItem>
            <Body style={theme.alignCenter}>
              <Spinner />
            </Body>
          </CardItem>
        }
        {!loading && error && !provider &&
          <CardItem style={theme.alignCenter}>
            <Text note>Não conseguimos atualizar</Text>
          </CardItem>
        }
        {!loading && !error && !provider &&
          <CardItem style={theme.alignCenter}>
            <Text note>Nenhum informativo criado</Text>
          </CardItem>
        }
        {!loading && provider &&
          <View style={styles.card}>
            <CardItem button onPress={() => this.navigate('ProviderDetails', { provider })}>
              <Icon name={provider.icon} />
              <View style={styles.viewContent}>
                <Text numberOfLines={1}>{provider.title}</Text>
                <Text note>{dateFormatter.format(provider.date, 'dddd, DD [de] MMMM [de] YYYY')}</Text>
              </View>
              <Right>
                <Icon name='arrow-forward' style={{color: '#6600fc'}}/>
              </Right>
            </CardItem>
            <CardItem footer style={theme.alignRight}>
              <Button transparent onPress={() => this.navigate('Provider')}>
                <Text>VER TODOS</Text>
              </Button>
            </CardItem>
          </View>
        }
      </Card>
    );
  }
}

const styles = StyleSheet.create({
  viewContent: {
    width: variables.deviceWidth - 120
  },
  card: {
    backgroundColor: '#FAFAFA'
  }
});

export default withNavigation(ProviderCard);

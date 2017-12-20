import { Body, Button, Container, Content, Header, Icon, Left, Right, Spinner, Title, View } from 'native-base';
import * as React from 'react';
import { Share, WebView } from 'react-native';

import { BaseComponent, IStateBase } from '../../components/base';
import { EmptyMessage } from '../../components/emptyMessage';
import { ErrorMessage } from '../../components/errorMessage';
import { providerRender } from '../../formatters/providerRender';
import { IProvider } from '../../interfaces/provider';
import * as services from '../../services';
import { enInformativeType } from '../../services/enums/informativeType';
import { ProviderService } from '../../services/models/provider';

interface IState extends IStateBase {
  loading: boolean;
  provider?: IProvider;
  html: string;
  text?: string;
  error?: any;
}

export default class ProviderDetailsPage extends BaseComponent<IState> {
  private providerService: ProviderService;

  constructor(props: any) {
    super(props);

    this.providerService = services.get('providerService');
    const { provider } = this.params;

    this.state = {
      loading: provider ? false : true,
      provider,
      html: provider ? providerRender(provider) : null
    };
  }

  public componentDidMount(): void {
    if (this.state.provider) return;

    this.providerService.get(this.params.id)
      .logError()
      .bindComponent(this)
      .subscribe(provider => {
        const html = provider ? providerRender(provider) : null;
        this.setState({ loading: false, provider, html });
      }, error => this.setState({ loading: false, error }));
  }

  public share(): void {
    Share.share({
      title: this.state.provider.title,
      message: this.state.text
    });
  }

  public setText(text: string): void {
    this.setState({ text });
  }

  public render(): JSX.Element {
    const { loading, html, provider, error } = this.state;
    let title = 'Fornecedores';

    if (provider) {
      title = provider.typeId === enInformativeType.cell ? 'Célula' : 'Igreja';
    }

    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={() => this.goBack()}>
              <Icon name='arrow-back' />
            </Button>
          </Left>
          <Body>
            <Title>{title}</Title>
          </Body>
          <Right>
            {provider &&
              <Button transparent onPress={() => this.share()}>
                <Icon name='share' />
              </Button>
            }
          </Right>
        </Header>
        {loading &&
          <Content>
            <Spinner />
          </Content>
        }
        {!loading && error &&
          <Content>
            <ErrorMessage error={error} />
          </Content>
        }
        {!loading && !error && !provider &&
          <Content>
            <EmptyMessage icon='sad' message='Não encontramos' />
          </Content>
        }
        {!loading && !error && !!provider &&
          <View style={{ flex: 1 }}>
            <WebView
              source={{ html }}
              onMessage={event => this.setText(event.nativeEvent.data)}
              style={{ flex: 1 }} />
          </View>
        }
      </Container>
    );
  }
}
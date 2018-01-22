import { Body, Button, Container, Content, Header, Icon, Left, Spinner, Title, List, ListItem, Text, CardItem, Card } from 'native-base';
import * as React from 'react';
import { Share, StyleSheet } from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid';

import { BaseComponent, IStateBase } from '../../components/base';
import { EmptyMessage } from '../../components/emptyMessage';
import { ErrorMessage } from '../../components/errorMessage';
import { providerRender } from '../../formatters/providerRender';
import { IProvider } from '../../interfaces/provider';
import * as services from '../../services';
import { theme } from '../../theme';
import { ProviderService } from '../../services/models/provider';

interface IState extends IStateBase {
  loading: boolean;
  provider?: IProvider;
  html: string;
  text?: string;
  error?: any;
}

export default class ProviderDetailsProductPage extends BaseComponent<IState> {
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

  public detailsProduct(provider: IProvider): void {
    this.navigate('ProviderProductDetails', { provider });
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
    const { loading, provider, error } = this.state;
    let title = 'Fornecedores';

    if (provider) {
      title = 'Produto';
    }

    return (
      <Container style={styles.container}>
        <Header>
          <Left>
            <Button transparent onPress={() => this.goBack()}>
              <Icon name='arrow-back' style={theme.menuIcon}/>
            </Button>
          </Left>
          <Body>
            <Title style={theme.headerTitle}>{title}</Title>
          </Body>
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
        <List dataArray={['']} renderRow={provider =>
          <ListItem key={provider.id} last>
            <Body style={styles.bodyListItem}>
              <Card style={styles.card}>
                <CardItem>
                  <Body>
                    <Grid>
                      <Row style={styles.rowTitle}><Text style={styles.title}>54534 - Produto X</Text></Row>
                      <Row style={styles.rowContent2}>
                        <Col>
                          <Text style={styles.subTitle}>Fornecedor</Text>
                          <Text style={styles.value}>X</Text>
                          <Text style={styles.subTitle}>Posição</Text>
                          <Text style={styles.value}>G19</Text>
                          <Text style={styles.subTitle}>Código de Barra</Text>
                          <Text style={styles.value}>2132131 23123123 8923913</Text>
                        </Col>
                      </Row>
                    </Grid>
                  </Body>
                </CardItem>
              </Card>
              <Card style={styles.card}>
                <CardItem>
                  <Body>
                    <Grid>
                      <Row style={styles.rowTitle}><Text style={styles.title}>Venda</Text></Row>
                      <Row style={styles.rowContent}>
                        <Col style={styles.colContent}>
                          <Text style={styles.subTitle}>Dias sem venda</Text>
                          <Text style={styles.value}>X dias</Text>
                        </Col>
                      </Row>
                      <Row style={styles.rowContent}>
                        <Col style={styles.colContent}>
                          <Text style={styles.subTitle}>Preço atacado</Text>
                          <Text style={styles.value}>R$11,90</Text>
                        </Col>
                        <Col style={styles.colContent}>
                          <Text style={styles.subTitle}>Preço varejo</Text>
                          <Text style={styles.value}>R$13,50</Text>
                        </Col>
                      </Row>
                    </Grid>
                  </Body>
                </CardItem>
              </Card>
            </Body>
          </ListItem>

        }
        />
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FAFAFA'
  },
  card: {
    width: 350
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center'
  },
  bodyListItem:{
    justifyContent: 'space-between',
    flexDirection: 'column',
    alignItems: 'center'
  },
  subTitle: {
    color: '#6600fc',
    fontWeight: 'bold',
    fontSize: 16
  },
  value: {
    marginBottom: 15,
    fontSize: 14
  },
  rowTitle: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  colContent: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10
  },
  rowContent: {
    justifyContent: 'space-between',
    width: 300
  },
  rowContent2: {
    width: 300
  }
});

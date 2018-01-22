import { Body, Button, Container, Content, Header, Icon, Left, List, ListItem, Right, Text, Title, Item, Input, Card, CardItem } from 'native-base';
import * as React from 'react';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { RefreshControl, StyleSheet } from 'react-native';
import { NavigationDrawerScreenOptions } from 'react-navigation';

import { BaseComponent, IStateBase } from '../../components/base';
import { ErrorMessage } from '../../components/errorMessage';
import { IProvider } from '../../interfaces/provider';
import { toast } from '../../providers/toast';
import * as services from '../../services';
import { ProviderService } from '../../services/models/provider';
import { theme } from '../../theme';
import { PopupMenu } from '../../components/popupMenu';

interface IState extends IStateBase {
  refreshing: boolean;
  providers: IProvider[];
  error?: any;
}

export default class ProviderDetailsPage extends BaseComponent<IState> {
  public actions:any = [{display: 'Maior Estoque', onPress: () => console.log('here i am')}, {display: 'Menor Estoque', onPress: () => console.log('here i am')},
                        {display: 'Mais Vendas', onPress: () => console.log('here i am')}, {display: 'Menos Vendas', onPress: () => console.log('here i am')}];
  public static navigationOptions: NavigationDrawerScreenOptions = {
    drawerLabel: 'Fornecedores' as any,
    drawerIcon: ({ tintColor }) => (
      <Icon name='cart' style={{ color: tintColor }} />
    )
  };

  private providerService: ProviderService;

  constructor(props: any) {
    super(props);

    this.providerService = services.get('providerService');
    this.state = { refreshing: true, providers: [] };
  }

  public componentDidMount(): void {
    this.load();
  }

  public details(provider: IProvider): void {
    this.navigate('ProviderDetailsProduct', { provider });
  }

  public load(refresh: boolean = false): void {
    this.setState({ refreshing: true }, true);

    this.providerService.list(refresh)
      .logError()
      .bindComponent(this)
      .subscribe(providers => {
        providers = providers || [];
        this.setState({ refreshing: false, providers, error: false });
      }, error => {
        if (refresh) toast('Não conseguimos atualizar');
        this.setState({ refreshing: false, error });
      });
  }

  public render(): JSX.Element {
    const { refreshing, providers, error } = this.state;

    return (
      <Container style={styles.container}>
        <Header>
          <Left>
            <Button transparent onPress={() => this.goBack()}>
              <Icon name='arrow-back' style={theme.menuIcon} />
            </Button>
          </Left>
          <Body>
            <Title style={theme.headerTitle}>Produtos</Title>
          </Body>
          <Right style={{marginRight: 6}}>
            <Button transparent>
              <Icon name='camera' style={[theme.menuIcon]} />
            </Button>
          </Right>
        </Header>
        <Header searchBar rounded>
          <Item>
            <Icon name="ios-search" style={styles.searchIcon}/>
            <Input placeholder="Buscar" style={styles.searchBar}/>
            <PopupMenu actions={this.actions}></PopupMenu>
          </Item>
          <Button transparent onPress={() => {}}>
            <Text>Buscar</Text>
          </Button>
        </Header>
        <Content
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => this.load(true)} />
          }
        >
          {!refreshing && error && !providers.length &&
            <ErrorMessage error={error} />
          }
          <List dataArray={providers} renderRow={provider =>
            <ListItem key={provider.id}>
              <Body>
                <Card style={styles.card}>
                  <CardItem>
                    <Body style={styles.bodyListItem}>
                      <Grid>
                        <Row style={styles.rowTitle}><Text style={styles.title}>54534 - Produto X </Text></Row>
                        <Row style={styles.rowContent}>
                          <Col style={styles.colContent}>
                            <Text style={styles.subTitle}>Estoque</Text>
                            <Text style={styles.products} >200</Text>
                          </Col>
                          <Col style={styles.colContent}>
                            <Text style={styles.subTitle}>Dias sem venda</Text>
                            <Text style={styles.products}>1</Text>
                          </Col>
                        </Row>
                        <Row style={styles.rowPlusButton}><Button transparent small onPress={() => this.details(provider)}><Icon name="ios-add-circle" style={{color: '#555'}}/></Button></Row>
                      </Grid>
                    </Body>
                  </CardItem>
                </Card>
              </Body>
            </ListItem>
          }
          />
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F2F2F2'
  },
  card: {
    width: 330,
    marginRight: 50
  },
  title: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: 'center'
  },
  searchBar: {
    paddingBottom: 5
  },
  searchIcon: {
    paddingTop: 5
  },
  iconCamera: {
    color: '#222'
  },
  bodyListItem:{
    justifyContent: 'space-between',
    flexDirection: 'column',
    alignItems: 'center',
    marginRight: 30
  },
  products: {
    fontWeight: 'bold',
  },
  note: {
    color: '#6600fc'
  },
  subTitle: {
    textAlign: 'center',
    color: '#6600fc',
    fontWeight: 'bold',
    marginBottom: 5
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
    width: 350
  },
  rowPlusButton: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    width: 350
  }
});

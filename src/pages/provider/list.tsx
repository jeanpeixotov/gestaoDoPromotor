import { Body, Button, Container, Content, Header, Icon, Left, List, ListItem, Right, Text, Title, Card, CardItem } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import * as React from 'react';
import { RefreshControl, StyleSheet } from 'react-native';
import { NavigationDrawerScreenOptions } from 'react-navigation';

import { BaseComponent, IStateBase } from '../../components/base';
import { ErrorMessage } from '../../components/errorMessage';
import { IProvider } from '../../interfaces/provider';
import { toast } from '../../providers/toast';
import * as services from '../../services';
import { ProviderService } from '../../services/models/provider';
import { theme } from '../../theme';

interface IState extends IStateBase {
  refreshing: boolean;
  providers: IProvider[];
  error?: any;
}

export default class ProviderListPage extends BaseComponent<IState> {
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
    this.navigate('ProviderDetails', { provider });
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
            <Button transparent onPress={() => this.openDrawer()}>
              <Icon name='menu' style={theme.menuIcon}/>
            </Button>
          </Left>
          <Body>
            <Title style={theme.headerTitle}>Fornecedores</Title>
          </Body>
          <Right />
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
                        <Row style={styles.rowTitle}><Text style={styles.title}>Assaí</Text></Row>
                        <Row style={styles.rowContent}>
                          <Col style={styles.colContent}>
                            <Text style={styles.subTitle}>Produtos na loja</Text>
                            <Text style={styles.products} >200</Text>
                          </Col>
                          <Col style={styles.colContent}>
                            <Text style={styles.subTitle}>Produtos em estoque</Text>
                            <Text style={styles.products} >187</Text>
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
    width: 200,
    textAlign: 'center'
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
    width: 350,
    marginLeft: 15
  },
  rowPlusButton: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    width: 350
  }
});

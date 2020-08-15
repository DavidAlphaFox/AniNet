import React from 'react';
import {
  HashRouter as Router,
  Route
} from 'react-router-dom'
import './App.css';
import NetPage from './NetPage'
import Header from './Header'
import { NetItem } from './datatypes';

type CardProps = {
  item: NetItem
}

class Card extends React.Component<CardProps, object> {
  render() {
    let item = this.props.item
    return (
      <a href={"#/network/"+item.name}>
      <div className="card">
        <img className="titleImg" src={item.title_img} alt={item.name}></img>
        <p className="name">{item.name}</p>
      </div>
      </a>
    )
  }
}

type CardsProps = {
  items: Array<NetItem>
}

class Cards extends React.Component<CardsProps, object> {
  render() {
    let items = this.props.items
    return (
      <div className="cards">
        {items.map(item => (
          <Card key={item.name} item={item}/>
        ))}
      </div>
    )
  }
}

type HomeProps = {
  items: Array<NetItem>
}

class Home extends React.Component<HomeProps, object> {
  render() {
    let items = this.props.items
    return (
      <div className="App">
        <Header title="ACG人物关系可视化"/>
        <div className="contents">
          <div className="container">
            <Cards items={items}/>
          </div>
        </div>
      </div>
    )
  }
}

type AppProps = {}
type AppState = {
  error: Error | null,
  isLoaded: boolean,
  items: Array<NetItem>
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props)
    this.state = {
      error: null,
      isLoaded: false,
      items: []
    }
  }

  componentDidMount() {
    fetch("networks.json")
      .then(res => res.json())
      .then((data) => {
        this.setState({
          isLoaded: true,
          items: data
        })
      },
      (error) => {
        this.setState({
          isLoaded: true,
          error
        })
      })
  }

  render() {
    const { error, isLoaded, items } = this.state
    if (error) {
      return <div>Error: {error.message}</div>
    } else if (!isLoaded) {
      return <div>Loading...</div>
    } else {
      return (
        <Router basename="/">
          <Route key="home" exact path="/" component={() => <Home items={items}/>} />
          {items.map(item => (
            <Route key={item.name} path={"/network/"+item.name}
                   component={() => <NetPage item={item}/>} />
          ))}
        </Router>
      );
    }
  }
}

export default App;

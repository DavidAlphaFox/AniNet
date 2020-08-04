import React from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'

import './NetView.css'
import Header from './Header'
import { exportToJson } from './utils'
import NetView from './NetView'
import {NetItem, ItemInfo} from './datatypes'


function buildFileSelector(parent: React.Component) {
  const fileSelector = document.createElement('input');
  fileSelector.setAttribute('type', 'file');
  fileSelector.setAttribute('multiple', 'multiple');
  fileSelector.setAttribute('accept', '.json')
  fileSelector.addEventListener('change', (event) => {
    const target = event.target as HTMLInputElement
    let file: File = (target.files as FileList)[0]
    let reader = new FileReader()
    reader.onload = () => {
      parent.setState({'data': JSON.parse(reader.result as string)})
    }
    if (file !== undefined) {
      reader.readAsText(file)
    }
  })
  return fileSelector;
}

type UploadBtnProps = {
  parent: NetPage,
}

type UploadBtnState = {
  fileSelector: HTMLInputElement,
}

class UploadBtn extends React.Component<UploadBtnProps, UploadBtnState> {
  componentDidMount(){
    this.setState({
      fileSelector: buildFileSelector(this.props.parent)
    })
  }
  
  handleFileSelect = (e: React.MouseEvent) => {
    e.preventDefault();
    this.state.fileSelector.click();
  }
  
  render(){
    return <button onClick={this.handleFileSelect}>Upload JSON</button>
  }
}

type ToolBarProps = {
  parent: NetPage
}


class ToolBar extends React.Component<ToolBarProps, object> {
  render() {
    let parent = this.props.parent
    return (
      <div className="toolbar">
        <div className="rightside">
          <UploadBtn parent={parent}/>
          <button onClick={() => {exportToJson(parent.state.data, "export.json")}}>Download JSON</button>
        </div>
      </div>
    )
  }
}


type NetPageProps = {
  item: NetItem
}

type NetPageState = {
  error: null | Error,
  isLoaded: boolean,
  data: ItemInfo | null,
}


class NetPage extends React.Component<NetPageProps, NetPageState> {
  constructor(props: NetPageProps) {
    super(props)
    this.state = {
      error: null,
      isLoaded: false,
      data: null,
    }
  }

  componentDidMount() {
    let item = this.props.item
    let url = "data/" + item.data
    fetch(url)
      .then(res => res.json())
      .then((data) => {
        this.setState({
          isLoaded: true,
          data: data
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
    let item = this.props.item
    const { error, isLoaded, data } = this.state
    if (error) {
      return <div>Error: {error.message}</div>
    } else if (!isLoaded) {
      return <div>Loading...</div>
    } else {
      return (
        <div>
          <Header title={item.name}/>
          <div className="container">
          <ToolBar parent={this}/>
          <Tabs>
            <TabList>
              <Tab>网络视图</Tab>
              <Tab>编辑</Tab>
            </TabList>
            <TabPanel>
              <NetView data={data as ItemInfo}/>
            </TabPanel>
            <TabPanel>
              Table
            </TabPanel>
          </Tabs>
          </div>
        </div>
      )
    }
  }
}

export default NetPage

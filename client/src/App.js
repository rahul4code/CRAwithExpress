import './App.css';
import React, { Component } from 'react'
import axios from 'axios';
import { Button, Row, Col, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import Select from 'react-select'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      countryList: [],
      countryId: '',
      countryName: '',
      rank: '',
      flag: '',
      loaded: false,
      textData: 'No Data',
      modal: false,
      country: '',
      newRank: '',
      validBorder: '1px solid red',
      continentName: '',
      continentId: '',
      cotinentList: []
    }
    this.handleChangeSelect = this.handleChangeSelect.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.toggle = this.toggle.bind(this)
    this.onFileChangeHandler = this.onFileChangeHandler.bind(this)
    this.handleChangeContinent = this.handleChangeContinent.bind(this)
  }

  componentDidMount() {
    fetch("http://localhost:8080/api/getAllCountries")
      .then((response) => response.json())
      .then((data) => this.setState({ countryList: data }));

      fetch("http://localhost:8080/api/getAllContinent")
      .then((response)=>response.json())
      .then((data)=>{
        let finalContinent=[];
        data.map(item=>{
          let obj={label:item,value:item}
          finalContinent.push(obj)
        })
        this.setState({cotinentList:finalContinent})
      })
  }

  toggle() {
    this.setState({
      modal: !this.state.modal,
      fade: !this.state.fade
    });
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
    if (event.target.name === "country") {
      event.target.value.length > 3 ?
        this.setState({ validBorder: '2px solid green' }) : this.setState({ validBorder: '2px solid red' })
    }
  }

  onSubmit() {
    if(this.state.continentName!=="")
    {
      if (this.state.country.length > 3) {
        let isnum = /^\d+$/.test(this.state.newRank);
        if (isnum) {
          const formData = new FormData();
          formData.append('file', this.state.selectedFile);
          if (formData) {
            if(this.state.selectedFile.size<4096000)
            {
              alert("Working")
              let data={"result":"haha","formData":"formData"};
              console.log(formData,"formData")
              fetch("http://localhost:8080/api/addCountry", 
              {
                method: 'POST',
                body: JSON.stringify(data),
              }).then(res => {
                  console.log(res.data);
                  alert("Country Added successfully.")
                })
            }
            else
            {
              alert("File should be less than 4 mb")
            }
          }
        }
      }
    }
    else
    {
      alert("Select continent !")
    }
    
    console.log(this.state, "All Value")
  }

  handleChangeSelect(value, event) {
    this.setState({
      countryName: value.label,
      countryId: value.id,
      textData: 'Loading ...'
    }, () => {
      fetch(`http://localhost:8080/api/getCountry/${this.state.countryName}`)
        .then((response) => response.json())
        .then((data) => {
          this.setState({ rank: data.rank })
          this.setState({ flag: data.flag })
        });
      setTimeout(() => {
        this.setState({ loaded: true })
      }, 2000)
    });
  }

  handleChangeContinent(value, event) {
    this.setState({
      continentName: value.label,
      continentId: value.id
    })
  }

  onFileChangeHandler = (e) => {
    e.preventDefault();
    this.setState({
      selectedFile: e.target.files[0]
    });
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src='https://yt3.ggpht.com/a/AATXAJyBCMA0DR_j4aZlS1SpoF40Triz7fpkM4nybQ=s900-c-k-c0xffffffff-no-rj-mo' className="App-logo" alt="logo" />
        </header>
        <Row>
          <Col sm={2}> </Col>
          <Col sm={8}>
            <Select
              value={{ label: this.state.countryName, value: this.state.countryId }}
              name="country"
              options={this.state.countryList}
              onChange={(value, event) => this.handleChangeSelect(value, event)}
            />
          </Col >
          <Col sm={2}>
            <Button color="warning" onClick={this.toggle}>Add Country</Button>
          </Col >
        </Row>
        <br />
        {this.state.loaded ? <div>
          <img src={this.state.flag} className="country-image" alt="logo" />
          <h4 style={{ fontSize: '16px' }}>Selected Country : <span style={{ color: 'green' }}>{this.state.countryName}</span></h4>
          <h4 style={{ fontSize: '16px' }}>Rank : <span style={{ color: 'green', display: 'inline' }}>{this.state.rank}</span></h4>
        </div> : <div>
          <span >{this.state.textData}</span>
        </div>}

        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Add Country</ModalHeader>
          <ModalBody>
            <Form>

              <FormGroup>
                <Label for="exampleSelect">Select Continent</Label>
                <Select
                  value={{ label: this.state.continentName, value: this.state.continentId }}
                  name="continent"
                  options={this.state.cotinentList}
                  onChange={(value, event) => this.handleChangeContinent(value, event)}
                />

              </FormGroup>
              <FormGroup>
                <Label for="exampleName">Name</Label>
                <Input type="country" style={{ border: this.state.validBorder }} name="country" onChange={(ev) => { this.handleChange(ev) }}
                  value={this.country}
                  id="exampleName" placeholder="Enter Country Name" />
              </FormGroup>
              <FormGroup>
                <Label for="exampleRank" >Rank</Label>
                <Input type="number" name="newRank"
                  value={this.newRank}
                  onChange={(ev) => { this.handleChange(ev) }} id="rank" placeholder="Enter Rank" />
              </FormGroup>
              <br />
              <FormGroup>
                <Label for="exampleFile">File</Label>
                <Input type="file" name="file" id="exampleFile" onChange={this.onFileChangeHandler} />
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.onSubmit}>Submit</Button>{' '}
            <Button color="secondary" onClick={this.toggle}>Close</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }

}


export default App;

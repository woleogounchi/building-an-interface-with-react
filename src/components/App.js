// Libraries
import React, { Component } from 'react'
import {without} from 'lodash'

// Styling
import '../css/App.css'

// Components
import AddAppointments from './AddAppointments'
import ListAppointments from './ListAppointments'
import SearchAppointments from './SearchAppointments'


class App extends Component {
  // The constructor is where you initialize things in OOP
  // eslint-disable-next-line no-useless-constructor
  constructor() {
    // super() allows you to get data from the parent 
    // component and also to use the 'this' keyword
    super()
    this.state = {
      myName: 'Wole',
      myAppointments:[],
      formDisplay: false,
      orderBy: 'PetName',
      orderDir: 'asc',
      lastIndex: 0
    }
    this.deleteAppointment = this.deleteAppointment.bind(this)
    this.toggleForm = this.toggleForm.bind(this)
    this.addAppointment = this.addAppointment.bind(this)
  }

  toggleForm() {
    this.setState({
      formDisplay: this.state.formDisplay
    })
  }

  addAppointment(apt) {
    // store the current appoitments list into the tempApts var
    let tempApts = this.state.myAppointments
    // set the new appoitment index value to the last/previous index in the list + 1
    apt.aptId = this.state.lastIndex
    // add the new appointment to the beginning of the appointments list
    tempApts.unshift(apt)
    this.setState({
      myAppointments: tempApts,
      lastIndex: this.state.lastIndex + 1
    })
  }

  deleteAppointment(apt) {
    let tempApts = this.state.myAppointments;
    tempApts = without(tempApts, apt);

    this.setState({
      myAppointments: tempApts
    })
  }
  
  componentDidMount() {
    fetch('./data.json')
      .then(response => response.json())
      .then(result => {
        const apts = result.map(item => {
          item.aptId = this.state.lastIndex
          this.setState({ lastIndex: this.state.lastIndex + 1 })
          return item
        })
        this.setState({
          myAppointments: apts
        })
      })
  }

  render() {

    let order
    let filteredApts = this.state.myAppointments
    if (this.state.orderDir === 'asc') {
      order = 1
    } else {
      order = -1
    }

    filteredApts.sort((a, b) => {
      if (a[this.state.orderBy].toLowerCase() < 
      b[this.state.orderBy].toLowerCase()) {
        return -1 * order
      } else {
        return 1 * order
      }
    })

    return (
      <main className="page bg-white" id="petratings">
        <div className="container">
          <div className="row">
            <div className="col-md-12 bg-white">
              <div className="container">
                <AddAppointments
                  formDisplay={this.state.formDisplay}
                  toggleForm={this.toggleForm}
                  addAppointment={this.addAppointment}
                />
                <SearchAppointments />
                <ListAppointments 
                  appointments={filteredApts} 
                  deleteAppointment={this.deleteAppointment} 
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }
}

export default App;

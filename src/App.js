import React, {useState} from 'react';
//StyleSheets
import './App.css';
//Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
//JQuery
import $ from 'jquery';

//Event Data
import eventData from './data/eventData.json';
import Badge from 'react-bootstrap/Badge';

function App() {
  //Sets JSON Data to State
  const [data, setData] = useState(eventData);
  const [order, setOrder] = useState("ASC");
  //Filter States
  const [normalEvents, setNormalEvents] = useState(false);
  const [warningEvents, setWarningEvents] = useState(false);
  const [errorEvents, setErrorEvents] = useState(false);
  //Modal States
  const [modalShow, setModalShow] = useState(false);
  //Adds Even to Modal When CLicked
  const [modalEvent, setModalEvent] = useState('');

  //Sorts Colums of Table
  const sorting = (col) =>{
    if(order == "ASC"){
      const sorted = [...data].sort((a,b)=>
        a[col].toLowerCase() > b[col].toLowerCase() ? 1 : -1
      );
      setData(sorted);
      if(col == 'created'){
        $("#dateHead").html("Date  &#8681;");
      }else{
        $("#subjectHead").html("Subject  &#8681;");
      }
      setOrder("DSC")
    }
    if (order === "DSC"){
      const sorted = [...data].sort((a,b)=>
        a[col].toLowerCase() < b[col].toLowerCase() ? 1 : -1
      );
      setData(sorted);
      if(col == 'created'){
        $("#dateHead").html("Date &#8679;");
      }else{
        $("#subjectHead").html("Subject  &#8679;");
      }
      setOrder("ASC");
    }
  };

  //Sets Color of Columns
  function eventColor(type){
    var variantColor;
  
     if(type ==  1){
       variantColor = 'success'
     }else if(type ==  2){
      variantColor = 'warning'
     }else{
      variantColor = 'danger'
     }
     return "table-"+variantColor;
    }
  //Function that Creates the Modal Popup
  function EventModal(props){
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {props.event.subject}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <body>
            {props.event.body}
          </body>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }

  //Counts Each type of Event for Display
  function eventTypeCount(type){
    var count = 0;
    eventData.filter(event => event.type == type).map(eventType=> count++)
    return count
  }
//Adds or removes events from display given event type
  function filterEvents(eventType){
    var comparrisonBool;
    if(eventType == 1){
      comparrisonBool = normalEvents
    }else if(eventType == 2){
      comparrisonBool = warningEvents
    }else{
      comparrisonBool = errorEvents
    }
    if(comparrisonBool == false){
      const dataFiltertedOut = [...data].filter(event => event.type != eventType);
      setData(dataFiltertedOut);
      if(eventType == 1){
        setNormalEvents(true)
      }else if(eventType == 2){
        setWarningEvents(true)
      }else{
        setErrorEvents(true)
      }
    }else{
      const dataFiltertedBack = eventData.filter(event => event.type == eventType);
      setData(data => [...data,...dataFiltertedBack]);
      if(eventType == 1){
        setNormalEvents(false)
      }else if(eventType == 2){
        setWarningEvents(false)
      }else{
        setErrorEvents(false)
      }
      console.log(normalEvents)
    }
  }

  return (
      <div>
        <Navbar  bg="primary" variant="dark">
          <Container>
            <Navbar.Brand>SKU Ninja</Navbar.Brand>
          </Container>
      </Navbar>
      <br></br>
      <Container>
        <div className='header center'>
          <h1>Event Logger</h1>
          <br></br>
          <Row>
            <Col><Button variant={normalEvents ? 'outline-success' : 'success' } onClick={() => filterEvents(1)}>Normal  <Badge bg='dark' pill>{eventTypeCount(1)}</Badge></Button></Col>
            <Col><Button variant={warningEvents ? 'outline-warning' : 'warning' } onClick={() => filterEvents(2)}>Warning  <Badge bg='dark' pill>{eventTypeCount(2)}</Badge></Button></Col>
            <Col><Button variant={errorEvents ? 'outline-danger' : 'danger' } onClick={() => filterEvents(3)}>Error  <Badge bg='dark' pill>{eventTypeCount(3)}</Badge></Button></Col>
          </Row>
        </div>
        <Table striped bordered hover className='tableStyle'>
          <thead>
            <tr>
              <th onClick={()=> sorting('created')} id='dateHead'>Date &#8679;</th>
              <th onClick={()=> sorting('subject')} id='subjectHead'>Subject   &#8679;</th>
            </tr>
          </thead>
          <tbody>
            {data.map((event,index)=>
              <tr key={index} class={eventColor(event.type)} onClick={() => {setModalShow(true); setModalEvent(event)}}>
                <td>{event.created}</td>
                <td>{event.subject}</td>
              </tr>
            )}
            <EventModal show={modalShow} onHide={() => setModalShow(false)} event={modalEvent}/>
          </tbody>
        </Table>
      </Container>
      </div>
  );
}

export default App;

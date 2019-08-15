// ES6
// ES5 var React = require('react');
// var Component = React.Component;
import React, { Component } from 'react';
import Button from '../../../Common/Btns/Buttons';
import Campo from '../../../Common/Campo/Campo';
import { paxios } from '../../../../Utilities';
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import './prd.css'
/*
  module.exports = class Login .....
*/
export default class DetailUpdate extends Component {
  _isMounted = false;
  constructor() {
    super();
    //definición del estado inicial
    this.state = {
      nomProd:'',
      precioProd:'',
      imagen:'',
      id:0,
      esda:'',
      error: false,
      things:[],
    };
    //Para el autobinding
    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.onSaveBtnClick = this.onSaveBtnClick.bind(this);
    this.addNotification = this.addNotification.bind(this);
    this.notificationDOMRef = React.createRef();
  }


  addNotification() {
    this.notificationDOMRef.current.addNotification({
      title: "Notificacion",
      message: "Producto Modificado!",
      type: "success",
      insert: "top",
      container: "bottom-right",
      animationIn: ["animated", "fadeIn"],
      animationOut: ["animated", "fadeOut"],
      dismiss: { duration: 2000 },
      dismissable: { click: true }
    });
  }
  addNotification2() {
    this.notificationDOMRef.current.addNotification({
      title: "Notificacion",
      message: "Producto Eliminado!",
      type: "success",
      insert: "top",
      container: "bottom-right",
      animationIn: ["animated", "fadeIn"],
      animationOut: ["animated", "fadeOut"],
      dismiss: { duration: 2000 },
      dismissable: { click: true }
    });
  }

  componentDidMount() {
    this._isMounted = true;
    const { match: {params}} = this.props;
    this.getDataFromDb(params.id);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  getDataFromDb=(id2)=>{

  fetch('http://localhost/TheCorsair/detalle.php',{
            method:'POST',
            header:{
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            body:JSON.stringify({
                // we will pass our input data to server
                id:id2,
            })
            
        })
        .then((response) => response.json())
        .then((responseJson)=>{
          console.log(responseJson);
          if (this._isMounted) {
          this.setState({
            things:responseJson
          })
          const { things } = this.state;
          console.log(things);
          this.state.things.map((dat)=>{
            this.setState({
              nomProd:dat.nomProd,
              precioProd:dat.precioProd,
              imagen:dat.imagen,
              id:dat.codProd
            })
          })
        }
        })
        .catch((error)=>{
        console.error(error);
    });
}

onChangeHandler(e){
  const {name, value} = e.target;
  //validar
  this.setState({...this.state,[name]:value});
}
  onSaveBtnClick(e) {

    fetch('http://localhost/TheCorsair/updateProd.php', {
      method: 'post',
      header: {
        'Accept': 'application/json',
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        // we will pass our input data to server
        id:this.state.id,
        nomProd:this.state.nomProd,
        precioProd:this.state.precioProd,
        imagen:this.state.imagen
      })

    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson === 'Data Matched') {
          this.addNotification();
          window.setTimeout(() => {
            this.props.history.push("/mantenimiento");
         }, 500)
        }
        else {
          alert(responseJson);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  eliminar = () => {
    fetch('http://localhost/TheCorsair/deleteProd.php', {
      method: 'post',
      header: {
        'Accept': 'application/json',
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        // we will pass our input data to server
        codProd: this.state.id,
      })

    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson === 'Data Matched') {
          this.addNotification2();
          window.setTimeout(() => {
            this.props.history.push("/mantenimiento");
         }, 500)
        }
        else {
          alert(responseJson);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }


  render(){
    return (
      <section>
      <h1>Modificar Producto </h1>
      <ReactNotification ref={this.notificationDOMRef} />
        <section className="main fix640 overr234 top1">
        <Campo
            caption="Nombre Producto"
            value={this.state.nomProd}
            name="nomProd"
            onChange={this.onChangeHandler}
          />
          <Campo
            caption="Precio"
            value={this.state.precioProd}
            name="precioProd"
            onChange={this.onChangeHandler}
          />
          <Campo
           caption="Imagen"
           value={this.state.imagen}
           name="imagen"
           onChange={this.onChangeHandler}
          />
          {(this.state.error && true)?(<div className="error">{this.state.error}</div>):null}
          <section className="action">
              <Button
                caption="Modificar Producto"
                onClick={this.onSaveBtnClick}
                customClass="primary"
              />
              <br></br>
              <Button
                caption="Eliminar Producto"
                onClick={this.eliminar}
                customClass="secundary"
              />
          </section>
        </section>
      </section>
    );
  }
}

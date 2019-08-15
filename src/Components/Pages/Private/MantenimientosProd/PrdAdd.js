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
export default class PrdAdd extends Component{
  constructor(){
    super();
    //definición del estado inicial
    this.state = {
      tipo:1,
      ex:'http://localhost/thecorsair/images/',
      nomProd:'',
      precioProd:'',
      imagen:'',
      error:false
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
      message: "Producto Agregado!",
      type: "success",
      insert: "top",
      container: "bottom-right",
      animationIn: ["animated", "fadeIn"],
      animationOut: ["animated", "fadeOut"],
      dismiss: { duration: 2000 },
      dismissable: { click: true }
    });
  }

  onChangeHandler(e){
    const {name, value} = e.target;
    //validar
    this.setState({...this.state,[name]:value});
  }
  onSaveBtnClick(e){
    if (!this.state.nomProd.length > 0) {
      alert('Llene todos los campos');
      return;
    }
    if (!this.state.precioProd.length > 0) {
      alert('Llene todos los campos');
      return;
    }
    if (!this.state.imagen.length > 0) {
      alert('Llene todos los campos');
      return;
    }
    fetch('http://localhost/TheCorsair/insertProd.php', {
      method: 'post',
      header: {
        'Accept': 'application/json',
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        tipo:this.state.tipo,
        nomProd:this.state.nomProd,
        precioProd:this.state.precioProd,
        imagen:this.state.ex+this.state.imagen
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

  render(){
    return (
      <section>
          <h1>Agregar Producto</h1>
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
          
          <div className="cmb">
          <legend className="legendari">Tipo</legend>
          <select className="tipo2" name="tipo" value={this.state.tipo}
           onChange={this.onChangeHandler}>
            <option value="1">Calientes</option>
              <option value="2">FriaslFrozen</option>
              <option value="3">Extras</option>
              <option value="4">Turbulentas</option>
              <option value="5">Reposteria</option>
          </select>
          </div>
         
          {(this.state.error && true)?(<div className="error">{this.state.error}</div>):null}
          <section className="action">
              <Button
                caption="Crear Producto"
                onClick={this.onSaveBtnClick}
                customClass="primary"
              />
          </section>
        </section>
      </section>
    );
  }
}

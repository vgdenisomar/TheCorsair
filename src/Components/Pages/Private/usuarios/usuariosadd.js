// ES6
// ES5 var React = require('react');
// var Component = React.Component;
import React, { Component } from 'react';
import Button from '../../../Common/Btns/Buttons';
import Campo from '../../../Common/Campo/Campo';
import { paxios } from '../../../../Utilities';
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import '../MantenimientosProd/prd.css'
/*
  module.exports = class Login .....
*/
export default class PrdAdd extends Component{
  constructor(){
    super();
    //definición del estado inicial
    this.state = {
      ex:'http://localhost/thecorsair/images/',
      nameUser:'',
      emailUser:'',
      passwordUser:'',
      tipo:2,
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
    console.log(this.state.tipo)
  }
  onSaveBtnClick(e){
    if (!this.state.nameUser.length > 0) {
      alert('Llene todos los campos');
      return;
    }
    if (!this.state.emailUser.length > 0) {
      alert('Llene todos los campos');
      return;
    }
    if (!this.state.passwordUser.length > 0) {
      alert('Llene todos los campos');
      return;
    }
    fetch('http://localhost/TheCorsair/insertUser.php', {
      method: 'post',
      header: {
        'Accept': 'application/json',
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        // we will pass our input data to server
        nameUser:this.state.nameUser,
        emailUser:this.state.emailUser,
        passwordUser:this.state.passwordUser,
        tipo:this.state.tipo
      })

    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson === 'Data Matched') {
          this.addNotification();
          window.setTimeout(() => {
            this.props.history.push("/usuarios");
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
          <h1>Agregar Usuario</h1>
          <ReactNotification ref={this.notificationDOMRef} />
        <section className="main fix640 overr234 top1">
        <Campo
            caption="Nombre"
            value={this.state.nameUser}
            name="nameUser"
            onChange={this.onChangeHandler}
          />
          <Campo
            caption="Correo Electronico"
            value={this.state.emailUser}
            name="emailUser"
            onChange={this.onChangeHandler}
          />
          <Campo
           caption="Contraseña"
           value={this.state.passwordUser}
           name="passwordUser"
           type="password"
           onChange={this.onChangeHandler}
          />
          <div className="cmb">
              <legend>Tipo</legend>
          <select name="tipo" value={this.state.tipo}
           onChange={this.onChangeHandler}>
            <option value="2">Usuario</option>
              <option value="1">Administrador</option>

          </select>
          </div>
          {(this.state.error && true)?(<div className="error">{this.state.error}</div>):null}
          <section className="action">
              <Button
                caption="Crear Usuario"
                onClick={this.onSaveBtnClick}
                customClass="primary"
              />
          </section>
        </section>
      </section>
    );
  }
}

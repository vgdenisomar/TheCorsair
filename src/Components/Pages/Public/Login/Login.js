// ES6
// ES5 var React = require('react');
// var Component = React.Component;
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { naxios } from '../../../../Utilities';
import logo from '../../../../images/logo1.png'

import './login.css'

import Button from '../../../Common/Btns/Buttons';
import Campo from '../../../Common/Campo/Campo';
import { IoIosPersonAdd, IoIosConstruct, IoIosPerson } from 'react-icons/io';

/*
  module.exports = class Login .....
*/
export default class Login extends Component{
  constructor(){
    super();
    //definición del estado inicial
    this.state = {
      email:'',
      source:[],
      password:'',
      redirect:false,
      error:null
    };
    //Para el autobinding
    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.onSiginBtnClick = this.onSiginBtnClick.bind(this);
  }

  onChangeHandler(e){
    const {name, value} = e.target;
    //validar
    this.setState({...this.state,[name]:value});
  }
  onSiginBtnClick(e){
    console.log(this.state);
    const {name, email, password} = this.state;
    localStorage.setItem("email",email);
    if (!this.state.email.length > 0) {
      alert('Llene todos los campos');
      return;
    }
    if (!this.state.password.length > 0) {
      alert('Llene todos los campos');
      return;
    }

    fetch('http://localhost/TheCorsair/sesion.php', {
      method: 'post',
      header: {
        'Accept': 'application/json',
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        // we will pass our input data to server
        email: email,
        password: password,
        lon: this.long,
        lat: this.lat
      })

    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson) {
          console.log(responseJson);
          this.props.setAuth("",responseJson);
          this.setState({redirect:true});
          this.setState(
            {
              source:responseJson,
              loading: false
            }
          )
        }
        else {
          this.setState(
            {
              loading: false
            }
          )
          alert("Credenciales Invalidas");
        }
      })
      .catch((error) => {
        console.error(error)
      });
  }

  render(){
    console.log(this.props);
    if(this.state.source.admin==1)
    {
      if(this.state.redirect){
        return (
          <Redirect
            to={(this.props.location.state) ? this.props.location.state.from.pathname : '/mantenimiento'}
          />
        );
    }
  }
    else{
      if(this.state.redirect){
        return (
          <Redirect
            to={(this.props.location.state) ? this.props.location.state.from.pathname : '/productos'}
          />
        );
    }
    
    }
    return (
      <section className="ed">
        <h1 className="back">Login
        </h1>
        <img className='logo' src={logo}></img>
        <section className="main fix640">
         <Campo
          caption="Correo Electrónico"
          value={this.state.email}
          name="email"
          css="log"
          onChange={this.onChangeHandler}
         />
          <Campo
            caption="Contraseña"
            type="password"
            value={this.state.password}
            name="password"
            css="log"
            onChange={this.onChangeHandler}
          />
          { (this.state.error && true)? (<div className="error">{this.state.error}</div>):null}
          <section className="action">
              <Button
                caption="Iniciar Sesión"
                onClick={this.onSiginBtnClick}
                customClass="primary"
              />
          </section>
        </section>
      </section>
    );
  }
}

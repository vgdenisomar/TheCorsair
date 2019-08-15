import React, { Component } from 'react';
import '../products/products.css'
import {Link} from 'react-router-dom';
import { IoIosAdd,IoIosCart, IoIosSync, IoMdAddCircle } from 'react-icons/io';
import { paxios } from '../../../../Utilities';
import {MdDelete } from "react-icons/md";
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";

/*
  module.exports = class Login .....
*/
export default class Login extends Component{

  constructor(){
    super();
    this.state={
      things:[],
      subtotal:0,
      isv:0,
      total:0,
      hasMore:true,
      page:1,
      intervalIsSet: false,
      itemsToLoad:10
    }
    this.addNotification = this.addNotification.bind(this);
    this.notificationDOMRef = React.createRef();
  }

  
  addNotification() {
    this.notificationDOMRef.current.addNotification({
      title: "Notificacion",
      message: "Pedido realizado!",
      type: "success",
      insert: "top",
      container: "bottom-right",
      animationIn: ["animated", "fadeIn"],
      animationOut: ["animated", "fadeOut"],
      dismiss: { duration: 2000 },
      dismissable: { click: true }
    });
  }
  
    
  add2Notification() {
    this.notificationDOMRef.current.addNotification({
      title: "Notificacion",
      message: "Un producto eliminado!",
      type: "success",
      insert: "top",
      container: "bottom-right",
      animationIn: ["animated", "fadeIn"],
      animationOut: ["animated", "fadeOut"],
      dismiss: { duration: 2000 },
      dismissable: { click: true }
    });
  }

  errorNotification() {
    this.notificationDOMRef.current.addNotification({
      title: "Notificacion",
      message: "Carrito de compras vacio!",
      type: "danger",
      insert: "top",
      container: "bottom-right",
      animationIn: ["animated", "fadeIn"],
      animationOut: ["animated", "fadeOut"],
      dismiss: { duration: 2000 },
      dismissable: { click: true }
    });
  }

  componentDidMount() {
    this.getDataFromDb();
    if (!this.state.intervalIsSet) {
      let interval = setInterval(this.getDataFromDb, 1000);
      this.setState({ intervalIsSet: interval });
    }
  }

  componentWillUnmount() {
    if (this.state.intervalIsSet) {
      clearInterval(this.state.intervalIsSet);
      this.setState({ intervalIsSet: null });
    }
  }
  getDataFromDb = () => {
    {
      fetch('http://sustento.000webhostapp.com/obtenerCar.php',{
        method:'post',
        header:{
            'Accept': 'application/json',
            'Content-type': 'application/json'
        },
        body:JSON.stringify({
            // we will pass our input data to server
            codCliente: localStorage.getItem("id")
        })
        
    })
    .then((response) => response.json())
    .then((responseJson)=>{
                  this.setState(
                    {
                      things : responseJson,
                      loading:false
                    },
                  )
                  const { things } = this.state;
                  var a=0,b=0,c=0,d=0;
                  things.map((dat)=>{
                    b=parseInt(dat.precioOfProd)*parseInt(dat.cant);
                    a+=(b);
                    c=parseFloat(a*0.15).toFixed(2); 
                    d=(parseFloat(a) + parseFloat(c)).toFixed(2);
                    this.setState({
                      subtotal:a,
                      isv:c,
                      total:d
                    })
                  })
                 })
                 .catch((error)=> {
                   this.setState({error,loading:false})
                   console.log(error);
                 })  
                }
  };

  pedido=()=>{
    if(this.state.total==0)
    {
      this.errorNotification();
    }
    else{
      paxios.post(`/api/pedidos`)
      .then(({ data }) => {
        console.log("Enviado");
        this.setState({
          subtotal:0,
          isv:0,
          total:0
        })
        this.addNotification();
        window.setTimeout(() => {
            this.props.history.push("/productos");
         }, 1000)
      })
      .catch((error) => {
        console.log(error);
        this.setState({ error: "Error al crear nuevo Thing" });
      })
    }
    
  }

  delete=(codProd)=>{
    console.log(codProd);
    paxios.delete(`/api/car/${codProd}`)
    .then(({ data }) => {
      this.add2Notification();
      console.log("eliminado");
    })
    .catch((error) => {
      console.log(error);
      this.setState({ error: "Error al crear nuevo Thing" });
    })
  }

  render(){
    const { things } = this.state;
      return (
        <section>
          <h1>Sustento
          <Link className="linke" to="detailcar">
            <button className="buttonpagar" onClick={this.pedido}>Hacer pedido</button>
          </Link>
          </h1>
          <ReactNotification ref={this.notificationDOMRef} />
          <section className="overr2">
            <div className="thingItem_man2">
              <span>Nombre</span>
              <span>Cantidad</span>
              <span>Precio</span>
              <span></span>
            </div>
          {things.length <= 0
          ? 'Seleccione un producto para realizar su compra'
          : things.map((dat)=> (
              <div className="thingItem_man" key={dat._id}>
                <span className="spandetail"> {dat.nombre_Product}</span>
                <span className=""> {dat.total}</span>
                <span className=""> {dat.precio}</span>
                <MdDelete onClick={this.delete.bind(this,dat.codProd)} size="2em"/>
              </div>
            ))}
            <div className="thingItem_man2">
                <span> Sub Total:</span>
                <span> {this.state.subtotal} </span>
           </div>

           <div className="thingItem_man2">
                <span> ISV (15%):</span>
                <span> {this.state.isv} </span>
           </div>

           <div className="thingItem_man3">
                <span>Total a Pagar:</span>
                <span> {this.state.total} </span>
           </div>

          </section>

        </section>
      );
}
}

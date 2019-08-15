import React, { Component } from 'react';
import '../products/products.css'
import { Link } from 'react-router-dom';
import { IoIosCloseCircleOutline, IoIosInformationCircleOutline, IoIosSync, IoMdAddCircle } from 'react-icons/io';
import { paxios } from '../../../../Utilities';
import Button from '../../../Common/Btns/Buttons';
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";

import '../../../../index.css'
/*
  module.exports = class Login .....
*/
export default class Login extends Component {


    constructor() {
        super();
        this.state = {
            token: '',
            things: [],
            subtotal:0,
            isv:0,
            total:0,
            hasMore: true,
            page: 1,
            intervalIsSet: false,
            itemsToLoad: 10
        }
        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.addNotification = this.addNotification.bind(this);
        this.notificationDOMRef = React.createRef();
    }

    addNotification() {
        this.notificationDOMRef.current.addNotification({
          title: "Notificacion",
          message: "Pago realizado!",
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
          message: "Codigo invalido!",
          type: "danger",
          insert: "top",
          container: "bottom-right",
          animationIn: ["animated", "fadeIn"],
          animationOut: ["animated", "fadeOut"],
          dismiss: { duration: 2000 },
          dismissable: { click: true }
        });
      }

    onChangeHandler(e) {
        const { name, value } = e.target;
        //validar
        this.setState({ ...this.state, [name]: value });
    }
    componentDidMount() {
        this.getDataFromDb();
        if (!this.state.intervalIsSet) {
            let interval = setInterval(this.getDataFromDb, 2000);
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
        const { match: { params } } = this.props;
        const uri = `/api/pedidos/detalle/${params.id}`;
        paxios.get(uri)
            .then(
                ({ data }) => {
                    console.log(data);
                    this.setState(
                        {
                            things: data
                        }
                    )
                        const { things } = this.state;
                        var a=0,b=0,c=0,d=0;
                        things.map((dat)=>{
                          b=parseInt(dat.precio)*parseInt(dat.total);
                          a+=b;
                          c=parseFloat(a*0.15).toFixed(2); 
                          d=(parseFloat(a) + parseFloat(c)).toFixed(2);
                          this.setState({
                            subtotal:a,
                            isv:c,
                            total:d
                          })
                        })    
                })
    };

    pagar = () => {
        const { token } = this.state;
        const { match: { params } } = this.props;
        const id = params.id;
        fetch('http://sustento.000webhostapp.com/comprobar2.php', {
            method: 'post',
            header: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                codigo: token,
                secret: "HS4OI2GFLJ54EJ7X"
            })

        })
        .then((response) => response.json())
        .then((responseJson) => {
          if (responseJson === 'Data Matched') {

            paxios.put(`/api/pedidos/pagar`, { id })
            .then(({ data }) => {
                console.log("Pagado");
                this.addNotification();
                window.setTimeout(() => {
                    this.props.history.push("/entregar");
                 }, 1000)
                

            })
            .catch((error) => {
                console.log(error);
                this.setState({ error: "Error al crear nuevo Thing" });
            })
          }
          else{
            this.errorNotification();
              console.log("error");
          }
        })
        .catch((error)=>{
        console.error(error);
        
    })

}

    render() {
        const { things } = this.state;
        return (
            <section>
                <h1>Factura</h1>
                <ReactNotification ref={this.notificationDOMRef} />
                <section className="main fix640" className="overr2">
                <div className="thingItem_man2">
                            <span>Nombre</span>
                            <span>Cantidad</span>
                            <span>Precio</span>  
                            </div> 
                    {things.length <= 0
                        ? 'Cargando'                    
                        : things.map((dat) => (
                            <div className="thingItem_man" key={dat._id}>
                                <span>{dat.nombre_Product}</span>
                                <span>{dat.total}</span>
                                <span>{dat.precio}</span>
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

                            <div className="thingItem_man2">
                                <span>Total a Pagar:</span>
                                <span> {this.state.total} </span>
                            </div>
                        
                    <input onChange={this.onChangeHandler} value={this.state.token} className="codigo" name="token" maxLength="6" placeholder="Codigo"></input>
                    <Button
                        caption="Pagar"
                        onClick={this.pagar}
                        customClass="primary"
                    />
                </section>
            </section>
        );
    }
}

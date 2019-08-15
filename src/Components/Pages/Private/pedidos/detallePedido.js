import React, { Component } from 'react';
import '../products/products.css'
import { Link } from 'react-router-dom';
import { IoIosCloseCircleOutline, IoIosInformationCircleOutline, IoIosSync, IoMdAddCircle } from 'react-icons/io';
import { paxios } from '../../../../Utilities';
/*
  module.exports = class Login .....
*/
export default class Login extends Component{

  
  constructor() {
    super();
    this.state = {
      things: [],
      hasMore: true,
      page: 1,
      intervalIsSet: false,
      itemsToLoad: 10
    }
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
    const { match: {params}} = this.props;
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
        })
  };

    render(){
        const { things } = this.state;
        return (
          <section>
            <h1>Sustento</h1>
            <section className="overr2">
            <div className="thingItem_man2">
              <span>Nombre</span>
              <span>Cantidad</span>
              <span></span>
            </div>
          {things.length <= 0
            ? 'Cargando'
            : things.map((dat) => (
              <div className="thingItem_man" key={dat._id}>
              <span>{dat.nombre_Product}</span>
              <span>{dat.total}</span>
              <span></span>
            </div>

            ))}
        </section>
          </section>
        );
}
}
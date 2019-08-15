import React, { Component } from 'react';
import '../products/products.css'
import { Link } from 'react-router-dom';
import { IoIosCloseCircleOutline, IoIosArrowForward, IoIosCheckmarkCircleOutline, IoMdAddCircle } from 'react-icons/io';
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
    const uri = `/api/pedidos/entregar`;
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
          {things.length <= 0
            ? 'No tiene ningun pedido'
            : things.map((dat) => (
              <div className="thingItem_man" key={dat._id}>
              <span>Entregar a: {dat.name}</span>
              <span className="updateThing">
                <Link to={`/pagar/${dat._id}`}>
                  <IoIosArrowForward size="2em"/>
                </Link>
              </span>
            </div>


            ))}
        </section>
          </section>
        );
}
}

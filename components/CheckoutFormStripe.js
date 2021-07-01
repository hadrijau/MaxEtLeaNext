import React, {useContext, useEffect, useRef, useState} from "react";
import {CardElement, useStripe, useElements, Elements} from "@stripe/react-stripe-js";
import axios from "axios";
import {ListGroup, Row, Spinner} from 'react-bootstrap'
import styles from './CheckoutFormStripe.module.css'
import {loadStripe} from "@stripe/stripe-js/pure";
import styled from "@emotion/styled";
import {Formik} from "formik";
import {v4} from "uuid";
import {useMutation} from "@apollo/client";
import gql from "graphql-tag";
import {AppContext} from "./context/AppContext";
import {useRouter} from 'next/router';
import {PayPalButton} from "react-paypal-button-v2";
import ReactDOM from 'react-dom'
import Head from "next/head";
import {useDispatch} from "react-redux";
import {getCart, setMauvaisCart} from "../store/actions/commandes";
import query from "apollo-cache-inmemory/lib/fragmentMatcherIntrospectionQuery";
import Link from "next/link";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

const CHECKOUT_MUTATION = gql`
mutation CHECKOUT_MUTATION( $input: CheckoutInput! ) {
  checkout(input: $input) {
    clientMutationId
    order {
      id
      orderKey
      refunds {
        nodes {
          amount
        }
      }
      status
    }
    result
    redirect
  }
}
`;

const WooCommerce = new WooCommerceRestApi({
  url: 'https://maxandlea.fr',
  consumerKey: 'ck_9e4d330373ed9a52a684ec88434271aa37652603',
  consumerSecret: 'cs_a0272dea628e462d7288a10226cfa3e1f4ffcaff',
  version: 'wc/v3'
}); 

const createOrderWoo = async () => {

  let dataClientCart = JSON.parse(localStorage.getItem('livraison'));
  let cartClientCommande = JSON.parse(localStorage.getItem('commande-cart'));

  var line_items_array = [];
  if(cartClientCommande && cartClientCommande.products){
    cartClientCommande.products.forEach( product => {
      var temp_obj = {product_id: product.productId, quantity: product.qty};
      line_items_array.push(temp_obj);
    });
  }
  console.log(dataClientCart);
  const data = {
    payment_method: moyenPaiement,
    payment_method_title: moyenPaiement,
    set_paid: true,
    billing: {
      first_name: dataClientCart.prenom,
      last_name: dataClientCart.nom,
      address_1: dataClientCart.adresseFacturation,
      address_2: "",
      city: dataClientCart.villeFacturation,
      state: "",
      postcode: dataClientCart.codePostalFacturation,
      country: dataClientCart.pays,
      email: dataClientCart.email,
      phone: dataClientCart.phone
    },
    shipping: {
      first_name: dataClientCart.prenom,
      last_name: dataClientCart.nom,
      address_1: dataClientCart.adresseLivraison,
      address_2: "",
      city: dataClientCart.villeLivraison,
      state: "",
      postcode: dataClientCart.codePostalLivraison,
      country: dataClientCart.pays
    },
    line_items: line_items_array,
    shipping_lines: [
      {
        method_id: "flat_rate",
        method_title: "Flat Rate",
        total: dataClientCart.prixLivraison.toString()
      }
    ]
  };
 

  WooCommerce.post("orders", data)
  .then((response) => {
    console.log(response.data);
  })
  .catch((error) => {
    console.log(error.response.data);
  });
}

const CheckoutFormStripe = ({
                              price,
                              onSuccessfulCheckout,
                              adress,
                              codePostal,
                              email,
                              ville,
                              prenom,
                              nom,
                              pays,
  donneesClient,
  loaded,
                              paysFacturation,
  phone,
  totalPrice2,
  prixLivraison,
  remerciement
                            }) => {
  const [isProcessing, setProcessingTo] = useState(false);

  const [checkoutData, setCheckoutData] = useState({})

  const [visaClicked, setVisaClicked] = useState(false);
  const [paypalClicked, setPaypalClicked] = useState(false);

  console.log(price)
  const  [
    cart, setCart,
    commandeCart, setCommandeCart,
    adresseFacturation, setAdresseFacturation,
    total, setTotal,
    sousTotal, setSousTotal,
    expedition, setExpedition,
    adresseLivraison, setAdresseLivraison,
    codePostalFacturation, setcodePostalFacturation,
    codePostalLivraison, setCodePostalLivraison,
    villeFacturation, setVilleFacturation,
    villeLivraison, setVilleLivraison
  ] = useContext(AppContext)


  let moyenPaiement;
  if (visaClicked) {
    moyenPaiement = 'Carte de Paiement'
  }

  if (paypalClicked) {
    moyenPaiement = 'Paypal'
  }


  const dispatch = useDispatch();


  const router = useRouter()
  //############    PAYPAL #############//

  console.log(totalPrice2)

  const [succeeded, setSucceeded] = useState(false);
  const [paypalErrorMessage, setPaypalErrorMessage] = useState("");
  const [orderID, setOrderID] = useState(false);
  const [billingDetails, setBillingDetails] = useState("");

  const createOrder = (data, actions) => {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: {
              // charge users $499 per order
              value: 499,
            },
          },
        ],
        // remove the applicaiton_context object if you need your users to add a shipping address
        application_context: {
          shipping_preference: "NO_SHIPPING",
        },
      })
      .then((orderID) => {
        setOrderID(orderID);
        return orderID;
      });
  };

  const onApprove = (data, actions) => {
    return actions.order.capture().then(function (details) {
      const {payer} = details;
      setBillingDetails(payer);
      setSucceeded(true);
    }).catch(err=> setPaypalErrorMessage("Something went wrong."));
  };

  const Paypal = () => {
    const paypal = useRef();
    useEffect(() => {
      window.paypal.Buttons({
        createOrder : (data, actions, err) => {
          return actions.order.create({
            intent: "CAPTURE",
            purchase_units: [
              {
                description: 'articles',
                amount: {
                  currency: "EUR",
                  value: totalPrice2
                }
              }
            ]
          })
        },
        onApprove: async (data, actions) => {
          const order = await actions.order.capture();
          if (order.status === 'COMPLETED') {
            let dataClientCart = JSON.parse(localStorage.getItem('livraison'));
            let cartClientCommande = JSON.parse(localStorage.getItem('commande-cart'));

            var line_items_array = [];
            if(cartClientCommande && cartClientCommande.products){
              cartClientCommande.products.forEach( product => {
                var temp_obj = {product_id: product.productId, quantity: product.qty};
                line_items_array.push(temp_obj);
              });
            }
            console.log(dataClientCart);
            const data = {
              payment_method: moyenPaiement,
              payment_method_title: moyenPaiement,
              set_paid: true,
              billing: {
                first_name: dataClientCart.prenom,
                last_name: dataClientCart.nom,
                address_1: dataClientCart.adresseFacturation,
                address_2: "",
                city: dataClientCart.villeFacturation,
                state: "",
                postcode: dataClientCart.codePostalFacturation,
                country: dataClientCart.pays,
                email: dataClientCart.email,
                phone: dataClientCart.phone
              },
              shipping: {
                first_name: dataClientCart.prenom,
                last_name: dataClientCart.nom,
                address_1: dataClientCart.adresseLivraison,
                address_2: "",
                city: dataClientCart.villeLivraison,
                state: "",
                postcode: dataClientCart.codePostalLivraison,
                country: dataClientCart.pays
              },
              line_items: line_items_array,
              shipping_lines: [
                {
                  method_id: "flat_rate",
                  method_title: "Flat Rate",
                  total: dataClientCart.prixLivraison.toString()
                }
              ]
            };
          

            WooCommerce.post("orders", data)
            .then((response) => {
              console.log(response.data);
            })
            .catch((error) => {
              console.log(error.response.data);
            });
            localStorage.removeItem('woo-next-cart')
            localStorage.setItem('moyenPaiement', moyenPaiement);
            await router.push({
              pathname: '/remerciement',
            })
            window.location.reload()
          }
          console.log(order)
        },
        onError: (err) => {
          console.log(err)
        }
      }).render(paypal.current)
    }, [])

    return (
      <div>
        <div ref={paypal}></div>
      </div>
    )
  }


  console.log('cart', cart)


  let totalPrice1 = 0;
  if (cart) {
    for (let data in cart.products) {
      totalPrice1 += parseFloat(cart.products[data].totalPrice)
    }
  }


  if (cart.products.length === 2) {
    totalPrice1 = totalPrice1 * 0.90
  }

  if (cart.products.length === 3) {
    totalPrice1 = totalPrice1 * 0.85
  }





  //##############   STRIPE #############//

  const [ checkout, { data: checkoutResponse, loading: checkoutLoading, error: checkoutError1 } ] = useMutation( CHECKOUT_MUTATION, {
    variables: {
      input: checkoutData
    },
    onCompleted: () => {
      console.log( 'completed CHECKOUT_MUTATION' );
    },
    onError: ( error ) => {
      console.log('y a erreur')
      if ( error ) {
        setRequestError( error.graphQLErrors[ 0 ].message );
      }
    }
  } );

  console.log(isProcessing)
  const stripe = useStripe();
  const elements = useElements();

  const [checkoutError, setCheckoutError] = useState('')

  const CardElementContainer = styled.div`
  height: 40px;
  display: flex;
  width: 100%;
  align-items: center;
  & .StripeElement {
    width: 100%;
    padding: 15px;
  }
`;

  const iframeStyles = {
    base: {
      color: 'black',
      fontSize: "16px",
      iconColor: "lightgrey",
      "::placeholder": {
        color: "lightgrey"
      }
    },
    invalid: {
      iconColor: "#FFC7EE",
      color: "#FFC7EE"
    },
    complete: {
      iconColor: "#cbf4c9"
    }
  };

  const cardElementOpts = {
    iconStyle: "solid",
    style: iframeStyles,
    hidePostalCode: true
  };

  const onSuccessfullCheckout = () => {
    router.push('/remerciement')
  }

  return (

    <PayPalScriptProvider options= {{"client-id": process.env.PAYPAL_CLIENT_ID }}>
    <div>
      <Head >
        <title>CheckoutStripe</title>
      </Head>
      <div className={styles.paymentMethods}>
        <div className={visaClicked ? styles.visaContainerClicked : styles.visaContainer} onClick={() => {
          setPaypalClicked(false)
          setVisaClicked(true)
        }}>
          <img src={'/visa.png'} alt="" className={visaClicked ? styles.visaImgClicked : styles.visaImg}/>
        </div>
        <div className={paypalClicked ? styles.paypalContainerClicked : styles.paypalContainer} onClick={() => {
          setVisaClicked(false)
          setPaypalClicked(true)
        }}>
          <img src={'/paypal.png'} alt="" className={paypalClicked ? styles.paypalImgClicked : styles.paypalImg}/>
        </div>
      </div>

      {isProcessing && <Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>}

      {visaClicked && (
        <Formik
          initialValues={{email: '', cardnumber: ''}}
          onSubmit={async values => {

            const checkoutData = {
              clientMutationId: v4(),

              billing: {
                firstName: prenom,
                lastName: nom,
                address1: adresseFacturation,
                city: villeFacturation,
                country: pays,
                postcode: codePostalFacturation,
                email: email,
                phone: phone,
              },
              shipping: {
                firstName: prenom,
                lastName: nom,
                address1: adress,
                city: ville,
                country: pays,
                postcode: codePostal,
                email: email,
                phone: phone,
              },
              shipToDifferentAddress: false,
              isPaid: false,
              transactionId: "hjkhjkhsdsdiui"
            }
            setCheckoutData(checkoutData)

            console.log(checkoutData)

            const billingDetails = {
              name: values.email,
              address: {
                city: ville,
                line1: adress,
                postal_code: codePostal
              }
            };

            setProcessingTo(true);

              const {data: clientSecret} = await axios.post("/api/payment_intents", {
                amount: totalPrice2 * 100
              }).then(() => {
                let dataClientCart = JSON.parse(localStorage.getItem('livraison'));
                let cartClientCommande = JSON.parse(localStorage.getItem('commande-cart'));

                var line_items_array = [];
                if(cartClientCommande && cartClientCommande.products){
                  cartClientCommande.products.forEach( product => {
                    var temp_obj = {product_id: product.productId, quantity: product.qty};
                    line_items_array.push(temp_obj);
                  });
                }
                console.log(dataClientCart);
                const data = {
                  payment_method: moyenPaiement,
                  payment_method_title: moyenPaiement,
                  set_paid: true,
                  billing: {
                    first_name: dataClientCart.prenom,
                    last_name: dataClientCart.nom,
                    address_1: dataClientCart.adresseFacturation,
                    address_2: "",
                    city: dataClientCart.villeFacturation,
                    state: "",
                    postcode: dataClientCart.codePostalFacturation,
                    country: dataClientCart.pays,
                    email: dataClientCart.email,
                    phone: dataClientCart.phone
                  },
                  shipping: {
                    first_name: dataClientCart.prenom,
                    last_name: dataClientCart.nom,
                    address_1: dataClientCart.adresseLivraison,
                    address_2: "",
                    city: dataClientCart.villeLivraison,
                    state: "",
                    postcode: dataClientCart.codePostalLivraison,
                    country: dataClientCart.pays
                  },
                  line_items: line_items_array,
                  shipping_lines: [
                    {
                      method_id: "flat_rate",
                      method_title: "Flat Rate",
                      total: dataClientCart.prixLivraison.toString()
                    }
                  ]
                };
              

                WooCommerce.post("orders", data)
                .then((response) => {
                  console.log(response.data);
                })
                .catch((error) => {
                  console.log(error.response.data);
                });
                setProcessingTo(false)
                localStorage.removeItem('woo-next-cart')
                localStorage.setItem('moyenPaiement', moyenPaiement);
                //router.push('/remerciement').then(() => window.location.reload())
              })



            const cardElement = elements.getElement(CardElement);

            const paymentMethodReq = await stripe.createPaymentMethod({
              type: "card",
              card: cardElement,
              billing_details: billingDetails
            });

            const confirmedCardPayment = await stripe.confirmCardPayment(clientSecret, {
              payment_method: paymentMethodReq.paymentMethod.id
            })


            console.log('wola', paymentMethodReq)
            console.log('wola2', confirmedCardPayment)

            if (paymentMethodReq.error) {
               setCheckoutError(paymentMethodReq.error.message);
               setProcessingTo(false);
             }
            console.log(checkoutError)
          }}
        >
          {props => (
            <form onSubmit={(e) => {e.preventDefault()}}>
              <Row className="rowCheckout">
                <input
                  name="name"
                  type="text"
                  placeholder="Nom du porteur de la carte"
                  required
                  value={props.values.email}
                  onChange={props.handleChange('email')}
                  className={styles.inputName}
                />
              </Row>
              <Row className="rowCheckout">
                <div className={styles.CardElementContainer}>
                  <CardElementContainer>
                    <CardElement
                      options={cardElementOpts}
                      onChange={props.handleChange('cardnumber')}
                    />
                  </CardElementContainer>
                </div>
              </Row>
              <Row>
                {/* TIP always disable your submit button while processing payments */}
                <button className={styles.payButton} type="submit" onClick={props.handleSubmit}>
                  Commandez
                </button>
              </Row>
            </form>
          )}


        </Formik>
      )}


      {(paypalClicked) ? (
        <div >
          <ListGroup.Item>
            <PayPalButtons
              style={{
                color: "blue",
                shape: "pill",
                label: "pay",
                tagline: false,
                layout: "horizontal",
              }}
              createOrder={createOrder}
              onApprove={onApprove}
            /><Paypal />
          </ListGroup.Item>
        </div>
      ) : null}
    </div>
    </PayPalScriptProvider>
  );
};

export default CheckoutFormStripe;

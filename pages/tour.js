import React, {useContext, useState} from 'react';
import ReactPlayer from 'react-player'
import Header from "../components/Header";
import Link from 'next/link';
import Footer from "../components/Footer";
import Engagement from "../components/Engagement";
import Garanties from "../components/GarantiesMaxEtLea";
import HeaderPlayboard from "../components/HeaderPlayboard";
import AvisClients from "../components/AvisClients";
import * as product from "../products";
import {AppContext} from "../components/context/AppContext";
import {faDotCircle} from "@fortawesome/free-solid-svg-icons";
import Head from 'next/head'
import HeaderTour from "../components/HeaderTour";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronRight, faGrinStars} from "@fortawesome/free-solid-svg-icons";
import Recommendation from "../components/Recommendation";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import QualiteDansLesDetails from "../components/QualiteDansLesDetails";
import Collapsible from "react-collapsible";
import {useTranslation} from "react-i18next";
import ItemsCarousel from "react-items-carousel";
import {set} from "react-ga";
import Slider from "react-slick";
import styles from "../components/AvisClients.module.css";
import TourQualite from "../components/TourQualite";

const icon = React.createElement('i', { className: 'far fa-question-circle' }, "");
const title1 = React.createElement('p', {}, "La PlayBoard s'abime-t-elle avec le temps ?");
const faqHeader1 = React.createElement('div', {className: 'faqHeaderContainer' }, [icon,title1]);
const title2 = React.createElement('p', {}, "A partir de quel âge mon enfant peut-il commencer à jouer avec ?");
const faqHeader2 = React.createElement('div', {className: 'faqHeaderContainer' }, [icon,title2]);
const title3 = React.createElement('p', {}, "Jusqu'à quel âge la PlayBoard est-elle recommandée ?");
const faqHeader3 = React.createElement('div', {className: 'faqHeaderContainer' }, [icon,title3]);
const title4 = React.createElement('p', {}, "Je n’ai pas reçu mes E-Books OFFERTS avec ma commande ? ");
const faqHeader4 = React.createElement('div', {className: 'faqHeaderContainer' }, [icon,title4]);
const title5 = React.createElement('p', {}, "Comment récupérer mon sac de rangement OFFERT ?");
const faqHeader5 = React.createElement('div', {className: 'faqHeaderContainer' }, [icon,title5]);
const title6 = React.createElement('p', {}, "En combien de temps vais-je recevoir ma PlayBoard ?");
const faqHeader6 = React.createElement('div', {className: 'faqHeaderContainer' }, [icon,title6]);
const title7 = React.createElement('p', {}, "Si je vis hors Europe, comment puis-je acquérir la PlayBoard ?");
const faqHeader7 = React.createElement('div', {className: 'faqHeaderContainer' }, [icon,title7]);
const title8 = React.createElement('p', {}, "J’ai une question ou une remarque ?");
const faqHeader8 = React.createElement('div', {className: 'faqHeaderContainer' }, [icon,title8]);


const TourScreen = props => {

  const [cart, setCart] = useContext(AppContext);
  const products = product.products

  const getFloatVal = (string) => {
    let floatValue = string.match(/[+-]?\d+(\.\d+)?/g)[0];
    return (null !== floatValue) ? parseFloat(parseFloat(floatValue).toFixed(2)): '';
  };

  const addFirstProduct = (product) => {
    let productPrice = getFloatVal(product.price)

    let newCart = {
      products: [],
      totalProductCount: 1,
      totalProductsPrice: productPrice
    }

    const newProduct = createNewProduct(product, productPrice, 1)
    newCart.products.push(newProduct);
    localStorage.setItem('woo-next-cart', JSON.stringify(newCart));
    console.log('newCart', newCart)
    return newCart

  };

  const createNewProduct = (product, productPrice, qty) => {
    return {
      productId: product.id,
      name: product.name,
      price: productPrice,
      qty: qty,
      image: product.image,
      totalPrice: parseFloat((productPrice * qty).toFixed(2))
    }
  };


  const updateCart = (existingCart, product, qtyToBeAdded, newQty = false) => {
    const updatedProducts = getUpdatedProducts(existingCart.products, products[1], qtyToBeAdded, newQty);
    const addPrice = (total, item) => {

      total.totalPrice = item.totalPrice;
      total.qty += item.qty;
      console.log('total', total)
      console.log('item', item)
      console.log(total)
      return total;
    }

    // Loop through the updated product array and add the totalPrice of each item to get the totalPrice
    let total = updatedProducts.reduce(addPrice, {totalPrice: 0, qty: 0})

    const updatedCart = {
      products: updatedProducts,
      totalProductCount: parseInt(total.qty),
      totalProductsPrice: parseFloat(total.totalPrice)
    }

    localStorage.setItem('woo-next-cart', JSON.stringify(updatedCart))
    return updatedCart
  };





  /**
   * Get updated products array
   *
   * @param existingProductsInCart
   * @param product
   * @param qtyToBeAdded
   * @param newQty
   * @returns {*}
   */


  const getUpdatedProducts = (existingProductsInCart, product, qtyToBeAdded, newQty=false) => {
    const productExistsIndex = isProductInCart(existingProductsInCart, products[1].id);

    if (-1 < productExistsIndex) {
      let updatedProducts = existingProductsInCart;
      let updatedProduct = updatedProducts[productExistsIndex];

      updatedProduct.qty = (newQty) ? parseInt(newQty) : parseInt(updatedProduct.qty + qtyToBeAdded)
      updatedProduct.totalPrice = parseFloat(updatedProduct.price * updatedProduct.qty).toFixed(2);
      return updatedProducts;
    } else {
      let productPrice = parseFloat(product.price);
      const newProduct = createNewProduct(product, productPrice, qtyToBeAdded)
      existingProductsInCart.push(newProduct);
      return existingProductsInCart
    }
  };

  const isProductInCart = (existingProductsInCart, productId) => {
    const returnItemThatExists = (item, index) => {
      if (productId === item.productId) {
        return item;
      }
    };

    const newArray = existingProductsInCart.filter(returnItemThatExists)

    return existingProductsInCart.indexOf(newArray[0]);
  };


  const handleAddToCart = () => {
    if (process.browser) {
      let existingCart = localStorage.getItem('woo-next-cart');
      console.log('clicked')
      console.log('existingCart', existingCart)
      if (existingCart!=null) {
        existingCart = JSON.parse(existingCart)
        const qtyToBeAdded = 1
        const updatedCart = updateCart(existingCart, products[1], qtyToBeAdded);
        setCart(updatedCart)
      } else {
        const newCart = addFirstProduct(products[1]);
        setCart(newCart)
      }
    }
  }


  const { t, i18n } = useTranslation();

  const [children, setChildren] = useState([
    <div>
      <img src={'/xylophoneImg.jpg'} alt='photoXylo'/>
  </div>,
    <div>
      <img src={'/xylophoneImg.jpg'} alt='photoXylo'/>
    </div>,
    <div>
      <img src={'/xylophoneImg.jpg'} alt='photoXylo'/>
    </div>
  ])
  const [activeItemIndex, setActiveItemIndex] = useState(0)

  const changeActiveItem = (activeItemIndex) => set(activeItemIndex);

  var settings = {
    dots: false,
    infinite: true,
    autoplay: true,
    speed: 1500,
    slidesToShow: 1,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      },
    ]
  };

  return (
    <div>
      <Head>
        <title>Max And Lea - Tour Arc En Ciel</title>
        <link
          rel="stylesheet"
          type="text/css"
          charset="UTF-8"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
        />
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
        />
      </Head>
      <HeaderTour />

      <div className="container1000">
        <div className="imgCouverture">
          <div className="playboard-title-container">
            <h1 className="playboard-title">La Tour Arc En Ciel</h1>
          </div>
          <div className="playboard-paragraph-container">
            <p className="playboard-paragraph">{t("Playboard1")}</p>
          </div>
          <div className="voir-offre" onClick={handleAddToCart}>
            <Link href="javascript:void(0)"><h3 className="voir-offre-title">Ajouter au panier</h3></Link>
          </div>
          <div className="slider-container">
            <Slider {...settings}>
              <div>
                <img src={'/tour1.jpg'} alt=""/>
              </div>
              <div>
                <img src={'/tour2.jpg'} alt=""/>
              </div>
              <div>
                <img src={'/tour3.jpg'} alt=""/>
              </div>
              <div>
                <img src={'/tour4.jpg'} alt=""/>
              </div>
              <div>
                <img src={'/tour5.jpg'} alt=""/>
              </div>
              <div>
                <img src={'/tour6.jpg'} alt=""/>
              </div>
            </Slider>
          </div>

        </div>
      </div>
      <div className="mainContainer pensee-container">
        <div className="container1000">
          <div className="img-bebe-container">
            <img src={"/bebeIcone.png"} alt="" className="img-bebe"/>
          </div>
          <div className="pensee-paragraph-container">
            <p className="pensee-paragraph">Un jouet ludique qui aide au développement psychomoteur de l'enfant</p>
          </div>

          <div className="icone-container1">
            <div className="row">

              <div className="col icone-mini-container">
                <img src={'/creativite.png'} alt=""/>
                <p className="xyloPara"><span>Améliorer son habilité</span><br/>Avec ses cercles de différentes tailles votre enfant s'amusera à les empiler et travaillera ainsi sa coordination et sa gestuelle</p>
              </div>

              <div className="col icone-mini-container">
                <img src={'/habilite.png'} alt=""/>
                <p className="xyloPara"><span>Travailler sa motricité </span><br/>Des exercices d'empilage de différentes tailles couplés aux couleurs aideront votre petit à améliorer sa motricité fine et ses réflexes oeil-main</p>
              </div>

              <div className="col icone-mini-container">
                <img src={'/motricite.png'} alt=""/>
                <p className="xyloPara"><span>Développer sa Créativité</span><br/>D'innombrables façons de jouer lui permettront d'affiner sa curiosité et renforcer sa créativité</p>
              </div>
            </div>

            <div className="row">

              <div className="col icone-mini-container">
                <img src={'/concentration.png'} alt=""/>
                <p className="xyloPara"><span>Aiguiser sa concentration</span><br/>Votre enfant jouera des heures à empiler et inverser l'ordre des cercles et des couleurs, et sans s'en rendre compte améliorera grandement sa concentration</p>
              </div>

              <div className="col icone-mini-container">
                <img src={'/apprendre.png'} alt=""/>
                <p className="xyloPara"><span>Apprendre en jouant</span><br/>Il n'y a pas d'apprentissage sans plaisir. La tour Arc-en-ciel a donc été pensée pour jouer et s'amusant. L'apprentissage devient donc un jeu !</p>
              </div>

              <div className="col icone-mini-container">
                <img src={'/autonomie.png'} alt=""/>
                <p className="xyloPara"><span>Développer l'autonomie</span><br/>En apprenant à jouer seul et en construisant ses propres scénarios, votre petit améliorera son autonomie, sa concentration et sa créativité.</p>
              </div>

            </div>
          </div>
        </div>
      </div>



      <div className="container1000">
        <div className="image-recap-container">
          <img src={'/tourArc.jpg'} alt="" className="image-recap"/>
        </div>
      </div>

      <div className="container1000">
        <div className="huitEnUnContainerText">
          <p className="huitEnUnBigText">4 en 1</p>
          <p className="huitEnUnText">L'outil d'éveil et d'apprentissage le plus complet du marché</p>
        </div>
      </div>


      <div className="container1000">
        <div className="containerIcones2">
          <div className="row">

            <div className="col miniIconeContainer2">
              <FontAwesomeIcon icon={faDotCircle} color="#35A936" className="anneauxImg"/>
              <h5>ANNEAUX</h5>
              <p>Des formes simples à empiler pour travailler sa motricité et apprendre à organiser</p>
            </div>


            <div className="col miniIconeContainer2">
              <img src={'/couleur.png'} alt=""/>
              <h5>COULEURS</h5>
              <p>Affiner sa mémoire des couleurs et développer ses aptitudes visuelles et mentales</p>
            </div>


            <div className="col miniIconeContainer2">
              <img src={'/degrade.png'} alt=""/>
              <h5>COORDINATION</h5>
              <p>Empiler différentes formes géométriques pour travailler la coordination et la motricité</p>
            </div>

            <div className="col miniIconeContainer2">
              <FontAwesomeIcon icon={faGrinStars} color="#E72C59" className="eveilImg"/>
              <h5>EVEIL</h5>
              <p>Votre enfant prendra plaisir à jouer des heures entières et développera son imagination et sa créativité</p>
            </div>

          </div>
        </div>
      </div>

      <div className="container1000">
        <div className="clientSatisfait">
          <h5>6867 clients déjà satisfaits</h5>
        </div>
      </div>

      <div className="container1000">
        <div>
          <AvisClients/>
        </div>
      </div>

      <div className="container1000">
        <Garanties/>
      </div>

      <div className="container1000">
        <Engagement/>
      </div>

      <div className="container1000">
        <TourQualite />
      </div>

      <Footer/>
    </div>
  )
};

export default TourScreen;

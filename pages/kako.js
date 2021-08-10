import React, { useContext, useState } from 'react';
import ReactPlayer from 'react-player'
import Header from "../components/Header";
import Link from 'next/link';
import Footer from "../components/Footer";
import Engagement from "../components/Engagement";
import Garanties from "../components/GarantiesMaxEtLea";
import HeaderPlayboard from "../components/HeaderPlayboard";
import AvisClients from "../components/AvisClients";
import * as product from "../products";
import { AppContext } from "../components/context/AppContext";
import { faDotCircle } from "@fortawesome/free-solid-svg-icons";
import Head from 'next/head'
import HeaderKako from "../components/HeaderKako";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faGrinStars } from "@fortawesome/free-solid-svg-icons";
import Recommendation from "../components/Recommendation";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import QualiteDansLesDetails from "../components/QualiteDansLesDetails";
import Collapsible from "react-collapsible";
import { useTranslation } from "react-i18next";
import ItemsCarousel from "react-items-carousel";
import { set } from "react-ga";
import Slider from "react-slick";
import CountClients from "../components/CountClients";
import styles from "../components/AvisClients.module.css";
import TourQualite from "../components/TourQualite";

const icon = React.createElement('i', { className: 'far fa-question-circle' }, "");
const title1 = React.createElement('p', {}, "La PlayBoard s'abime-t-elle avec le temps ?");
const faqHeader1 = React.createElement('div', { className: 'faqHeaderContainer' }, [icon, title1]);
const title2 = React.createElement('p', {}, "A partir de quel âge mon enfant peut-il commencer à jouer avec ?");
const faqHeader2 = React.createElement('div', { className: 'faqHeaderContainer' }, [icon, title2]);
const title3 = React.createElement('p', {}, "Jusqu'à quel âge la PlayBoard est-elle recommandée ?");
const faqHeader3 = React.createElement('div', { className: 'faqHeaderContainer' }, [icon, title3]);
const title4 = React.createElement('p', {}, "Je n’ai pas reçu mes E-Books OFFERTS avec ma commande ? ");
const faqHeader4 = React.createElement('div', { className: 'faqHeaderContainer' }, [icon, title4]);
const title5 = React.createElement('p', {}, "Comment récupérer mon sac de rangement OFFERT ?");
const faqHeader5 = React.createElement('div', { className: 'faqHeaderContainer' }, [icon, title5]);
const title6 = React.createElement('p', {}, "En combien de temps vais-je recevoir ma PlayBoard ?");
const faqHeader6 = React.createElement('div', { className: 'faqHeaderContainer' }, [icon, title6]);
const title7 = React.createElement('p', {}, "Si je vis hors Europe, comment puis-je acquérir la PlayBoard ?");
const faqHeader7 = React.createElement('div', { className: 'faqHeaderContainer' }, [icon, title7]);
const title8 = React.createElement('p', {}, "J’ai une question ou une remarque ?");
const faqHeader8 = React.createElement('div', { className: 'faqHeaderContainer' }, [icon, title8]);


const TourScreen = props => {

  const [cart, setCart] = useContext(AppContext);
  const products = product.products

  const getFloatVal = (string) => {
    let floatValue = string.match(/[+-]?\d+(\.\d+)?/g)[0];
    return (null !== floatValue) ? parseFloat(parseFloat(floatValue).toFixed(2)) : '';
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
    const updatedProducts = getUpdatedProducts(existingCart.products, products[4], qtyToBeAdded, newQty);
    const addPrice = (total, item) => {

      total.totalPrice = item.totalPrice;
      total.qty += item.qty;
      return total;
    }

    // Loop through the updated product array and add the totalPrice of each item to get the totalPrice
    let total = updatedProducts.reduce(addPrice, { totalPrice: 0, qty: 0 })

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


  const getUpdatedProducts = (existingProductsInCart, product, qtyToBeAdded, newQty = false) => {
    const productExistsIndex = isProductInCart(existingProductsInCart, products[4].id);

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
      if (existingCart != null) {
        existingCart = JSON.parse(existingCart)
        const qtyToBeAdded = 1
        const updatedCart = updateCart(existingCart, products[4], qtyToBeAdded);
        setCart(updatedCart)
      } else {
        const newCart = addFirstProduct(products[4]);
        setCart(newCart)
      }
    }
  }


  const { t, i18n } = useTranslation();

  const [children, setChildren] = useState([
    <div>
      <img src={'/xylophoneImg.jpg'} alt='photoXylo' />
    </div>,
    <div>
      <img src={'/xylophoneImg.jpg'} alt='photoXylo' />
    </div>,
    <div>
      <img src={'/xylophoneImg.jpg'} alt='photoXylo' />
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
        <title>Max And Lea - Livre Kako</title>
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
      <HeaderKako />

      <div className="container1000">
        <div className="imgCouverture">
          <div className="playboard-title-container">
            <h1 className="playboard-title">Livre Kako</h1>
          </div>
          <div className="playboard-paragraph-container">
            <p className="playboard-paragraph">Livre avec 8 histoires</p>
          </div>
          <div className="voir-offre" onClick={handleAddToCart}>
            <Link href="javascript:void(0)"><h3 className="voir-offre-title">Ajouter au panier</h3></Link>
          </div>
          <div className="slider-container">
            <Slider {...settings}>
              <div>
                <img src={'/kako.png'} alt="" />
              </div>
            </Slider>
          </div>

        </div>
      </div>
      <div className="mainContainer pensee-container">
        <div className="container1000">
          <div className="img-bebe-container">
            <img src={"/bebeIcone.png"} alt="" className="img-bebe" />
          </div>
          <div className="pensee-paragraph-container">
            <p className="pensee-paragraph">Suivez l'histoire de Kako le petit Koala au travers de 8 Contes</p>
          </div>

          <div className="icone-container1">
            <div className="row">
              <div className="col icone-mini-container">
                <img src={'/creativite.png'} alt="" />
                <p className="xyloPara"><span>Kako glisse sur la girafe</span></p>
              </div>
              <div className="col icone-mini-container">
                <img src={'/habilite.png'} alt="" />
                <p className="xyloPara"><span>Kako encourage son ami le Kangourou</span></p>
              </div>
              <div className="col icone-mini-container">
                <img src={'/motricite.png'} alt="" />
                <p className="xyloPara"><span>Kako vole sur le dos d’un Hibou</span></p>
              </div>
              <div className="col icone-mini-container">
                <img src={'/motricite.png'} alt="" />
                <p className="xyloPara"><span>Kako joue avec son ami le panda</span></p>
              </div>
            </div>
            <div className="row">
              <div className="col icone-mini-container">
                <img src={'/creativite.png'} alt="" />
                <p className="xyloPara"><span>Kako rencontre un lion</span></p>
              </div>
              <div className="col icone-mini-container">
                <img src={'/habilite.png'} alt="" />
                <p className="xyloPara"><span>Kako piqué par Jojo le hérisson</span></p>
              </div>
              <div className="col icone-mini-container">
                <img src={'/motricite.png'} alt="" />
                <p className="xyloPara"><span>Kako sur le dos d’un Dauphin</span></p>
              </div>
              <div className="col icone-mini-container">
                <img src={'/motricite.png'} alt="" />
                <p className="xyloPara"><span>Kako rencontre une Grenouille</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container1000">
        <CountClients />
      </div>

      <div className="container1000">
        <div>
          <AvisClients />
        </div>
      </div>

      <div className="mainContainer garantiesContainer">
        <div className="container1000">
          <Garanties />
        </div>
      </div>

      <div className="container1000">
        <Engagement />
      </div>

      <div className="container1000">
        <div className="faqContainer">
          <h5>QUESTIONS FRÉQUENTES</h5>
          <div className="row">
            <div className="col">
              <Collapsible trigger={faqHeader1}>
                <p>
                  La PlayBoard est conçue à base de hêtre, un bois solide et résistant. L’ensemble de ses pièces sont parfaitement peintes, ce qui leur donne une durée de vie de plusieurs dizaines d’années en restant intactes.
                </p>
              </Collapsible>
              <Collapsible trigger={faqHeader2}>
                <p>
                  La PlayBoard est certifiée CE à partir de 12 mois. Les études montrent qu’à partir de 7 mois le jeune enfant commence à prendre des jouets dans ses mains et dès 10 mois sa motricité fine se développe. Il peut donc commencer à jouer avec sa tablette très tôt. Nous recommandons toujours qu’un adulte surveille le jeune enfant pendant qu’il joue pour éviter tout risque.
                </p>
              </Collapsible>
              <Collapsible trigger={faqHeader3}>
                <p>
                  Nous recommandons la PlayBoard jusqu’à 6 ans, mais il n’est pas rare de voir des enfants de plus de 6 ans continuer à l’utiliser car elle leur sert à apprendre le calcul.
                </p>
              </Collapsible>
              <Collapsible trigger={faqHeader4}>
                <p>
                  Lors de l’achat de votre PlayBoard, un e-mail contenant les liens pour télécharger vos E-books vous est automatiquement envoyé par e-mail. Cet email est peut parfois se retrouver dans vos spams. Si vous ne le trouvez pas, n’hésitez pas à nous contacter à <a href="mailto:contact@maxandlea.com">contact@maxandlea.com</a> ou via <a href="https://maxandlea.com/fr/contact/" target="_blank" rel="noopener">notre formulaire</a>, nous vous le renverrons avec plaisir.
                </p>
              </Collapsible>
            </div>
            <div className="col">
              <Collapsible trigger={faqHeader5}>
                <p>
                  Le sac de rangement est inséré dans l’emballage de votre PlayBoard, vous le découvrirez donc lors de la reception de votre commande.
                </p>
              </Collapsible>
              <Collapsible trigger={faqHeader6}>
                <p>
                  La PlayBoard est envoyée depuis notre entrepôt situé à Evreux (France <img src={'/internet9.webp'} />).
                  Pour une livraison en France (y compris Monaco) nos délais sont de 3 à 5 jours ouvrés (livraison Standard à domicile ou en Point Mondial Relay), et 2 à 3 jours ouvrés en livraison Express.

                  Pour le reste de l’Europe, nos délais de livraison sont de 5 à 7 jours ouvrés en livraison Standard et 3 à 5 jours en livraison Express.
                </p>
              </Collapsible>
              <Collapsible trigger={faqHeader7}>
                <p>Max &amp; Lea livre toute l’Europe (y compris Suisse et Royaume Uni), les Etats Unis et le Canada. En dehors de ces zones géographiques nous vous invitons à nous contacter directement par email à <a href="mailto:contact@maxandlea.com">contact@maxandlea.com</a> ou via le <a href="https://maxandlea.com/fr/contact/" target="_blank" rel="noopener">formulaire de contact</a>.</p>
              </Collapsible>
              <Collapsible trigger={faqHeader8}>
                <p>Notre service client est à votre écoute du Lundi au Samedi de 9h à 19h heure Française. Nous nous ferons un plaisir de vous répondre très rapidement (Notre délais moyen de réponse est de 45 minutes). Nous sommes joignable par email à <a href="mailto:contact@maxandlea.com">contact@maxandlea.com</a> ou via le <a href="https://maxandlea.com/fr/contact/" target="_blank" rel="noopener">formulaire de contact</a>.</p>
              </Collapsible>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
};

export default TourScreen;

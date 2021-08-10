import React, {useEffect, useState, useContext} from 'react';
import { Nav } from 'react-bootstrap';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { useTranslation } from 'react-i18next';
import {AppContext} from "./context/AppContext";
import i18next from "i18next";
import CardHover from "./CardHover";
import Link from 'next/link';
import {useDispatch, useSelector} from "react-redux";
import {getDrapeau} from "../store/actions/drapeau";
import {faShoppingBasket} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Header = (props) => {


  const { t, i18n } = useTranslation();

  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();

  const lang = i18next.language;
  const [cart, setCart] = useContext(AppContext);
  const [codePromo, setCodePromo] = useState('')
  useEffect(() => {
    if ( process.browser) {
      let cartData = localStorage.getItem('livraison');
      const trueData = JSON.parse(cartData);
      let codePromoData = localStorage.getItem('promoCode');
      const promoCodeData = JSON.parse(codePromoData)
      setCodePromo(promoCodeData)
    }
  }, []);
  let sumPanier = 0;
  let totalPrice2 = 0
  let qtyTotale = 0
  if (cart) {
    for (let data in cart.products) {
      sumPanier += parseFloat(cart.products[data].totalPrice)
      qtyTotale += parseFloat(cart.products[data].qty)
    }
  }



  let playboardReducPrice = 0
  let playboardInCart = []
  if (cart) {
    const playboard = cart.products.filter(obj => {
      return obj.productId === '3163'
    })
    if (playboard.length !== 0) {
      playboardInCart = playboard
      playboardReducPrice = playboard[0].qty * 20
    }
  }

  let tourReducPrice = 0
  let tourInCart = []
  if (cart) {
    const tour = cart.products.filter(obj => {
      return obj.productId === '4527'
    })
    if (tour.length !== 0) {
      tourInCart = tour
      tourReducPrice = tour[0].qty * 7
    }
  }


  let xyloReducPrice = 0
  let xyloInCart = []
  if (cart) {
    const xylo = cart.products.filter(obj => {
      return obj.productId === '4535'
    })
    if (xylo.length !== 0) {
      xyloInCart = xylo
      xyloReducPrice = xylo[0].qty * 9
    }
  }

  let ebookInCart = []
  if (cart) {
    const ebook = cart.products.filter(obj => {
      return obj.productId === 'hdkfhdhfdjjJ'
    })
    if (ebook.length !== 0) {
      ebookInCart = ebook
    }
  }

  //On enlève les ebooks de la qty totale
  if (ebookInCart.length!==0) {
    qtyTotale = qtyTotale - ebookInCart.length
  }

  let discountPanier = 0;
  if (qtyTotale === 2) {
    discountPanier = (sumPanier * 0.10).toFixed(2)
  } else if (qtyTotale === 3) {
    discountPanier = (sumPanier * 0.15).toFixed(2)
  } else if (qtyTotale >= 4) {
    discountPanier = (sumPanier * 0.20).toFixed(2)
  }


  let totalPriceIntermediaire = sumPanier - discountPanier
  const reducCodePromo = totalPriceIntermediaire * (1/codePromo?.amount)

  let totalPrice1 = sumPanier - discountPanier - reducCodePromo

  console.log("total", totalPrice1)
  console.log('sum', sumPanier)
  console.log('discount', discountPanier)
  console.log('reduc', reducCodePromo)
  console.log('inter', totalPriceIntermediaire)
  let user = '';

  useEffect(() => {
    if (localStorage.getItem('userName')) {
      user = localStorage.getItem('userName');
    }
  })

  const drapeau = useSelector(state => state.drapeau.drapeau)

  const productCount = (null !== cart && Object.keys(cart).length) ? cart.totalProductCount : '';


  const [anchorEl, setAnchorEl] = React.useState(null);

  /*useEffect(() => {
    window.addEventListener("click", (event){
      var isClickInsideElement = ignoreClickOnMeElement.contains(event.target);
    });
  });*/

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseOutside = () => {
    i18n.changeLanguage(lang).then(() => setAnchorEl(null))
  };

  const handleClose = (lang) => {
    i18n.changeLanguage(lang).then(() => setAnchorEl(null))
    if (lang === 'fr') {
      dispatch(getDrapeau('/flagfr.png'))
    } if (lang === 'en') {
      dispatch(getDrapeau('/flagen.png'))
    } if (lang === 'es') {
      dispatch(getDrapeau('/flages.png'))
    } if (lang === 'al') {
      dispatch(getDrapeau('/flagal.png'))
    }
  };

  const renderCart = () => {
    return <CardHover />
  }

  return (
    <div className="stickyHeader">
      <div className="freeContainer">
        <h1 className="freeLivraison">Livraison GRATUITE en Europe (3-5 jours) à partir de 30€ d'achat</h1>
      </div>
        <nav className="containerHeader">
          <div className="drapeauContainer">
            <p className="langue">{lang}</p>
            <img src={drapeau} alt="drapeau français" className="drapeauImg" onClick={handleClick}/>
          </div>
          <Nav className="navBar">
            <div className="imgContainer">
              <Link href="/">
                <img src={'/logogrand.webp'} alt="" className="imgNavbar"/>
              </Link>
            </div>

            <div className="linksContainer">
              <Link href="/">Home</Link>
              <Link href="/about">{t("Footer.1")}</Link>
              <Link href="/contact">{t("Footer.4")}</Link>
              <Link href="/blogs">{t("Footer.3")}</Link>
            </div>

            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleCloseOutside}
            >
              <MenuItem onClick={() => handleClose('en')}><img src={'/flagen.png'} alt=""/></MenuItem>
              <MenuItem onClick={() => handleClose('es')}><img src={'/flages.png'} alt=""/></MenuItem>
              <MenuItem onClick={() => handleClose('al')}><img src={'/flagal.png'} className="drapeauAllemand" alt=""/></MenuItem>
              <MenuItem onClick={() => handleClose('fr')}><img src={'/flagfr.png'} alt=""/></MenuItem>

            </Menu>
            <div className="accountShopping" onMouseOver={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
              <Link href="/cart">
                <Nav.Link>

                  <div className="cartWrap">
                    <div className="productsCountContainer">
                      <div className="productCountInnerContainer">{productCount ? <span className="productCountText">{productCount}</span> : <span className="productCountText">0</span>}</div>
                    </div>
                    <div className="flex">
                      <div className='productPrice'>
                      {totalPrice1 ? <span className="totalPriceSpan">{totalPrice1.toFixed(2)} €</span> : <span className="totalPriceSpan">0, 00 €</span>}
                      </div>
                      <FontAwesomeIcon icon={faShoppingBasket} className="shoppingCart"/>
                    </div>
                  </div>
                </Nav.Link>

              </Link>
              {open && renderCart()}
            </div>
          </Nav>
        </nav>
    </div>
  )
}

export default Header;

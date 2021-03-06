import React, { useContext } from 'react';
import Header from "../../components/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { Card, Col, Container, Row } from "react-bootstrap";
import Link from "next/link";
import Footer from "../../components/Footer";
import { AppContext } from "../../components/context/AppContext";
import * as product from "../../products";
import i18next from "i18next";
import { useTranslation } from "react-i18next";
import Head from "next/head";
import { useRouter } from "next/router";

const MusiquesEtJeunesEnfants = () => {

  const router = useRouter();

  const [cart, setCart] = useContext(AppContext);
  const products = product.products

  const lang = i18next.language;

  const { t, i18n } = useTranslation();

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
    console.log('newCart', newCart)
    return newCart

  };

  const createNewProduct = (product, productPrice, qty) => {
    return {
      productId: product.id,
      oldPrice: product.priceAugmente,
      name: product.name,
      price: productPrice,
      qty: qty,
      image: product.image,
      slug: product.slug,
      totalPrice: parseFloat((productPrice * qty).toFixed(2))
    }
  };


  const updateCart = (existingCart, product, qtyToBeAdded, newQty = false) => {
    const updatedProducts = getUpdatedProducts(existingCart.products, products[0], qtyToBeAdded, newQty);
    const addPrice = (total, item) => {

      total.totalPrice = item.totalPrice;
      total.qty += item.qty;
      console.log('total', total)
      console.log('item', item)
      console.log(total)
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
    const productExistsIndex = isProductInCart(existingProductsInCart, products[0].id);

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
      if (existingCart != null) {
        existingCart = JSON.parse(existingCart)
        const qtyToBeAdded = 1
        const updatedCart = updateCart(existingCart, products[0], qtyToBeAdded);
        setCart(updatedCart)
      } else {
        const newCart = addFirstProduct(products[0]);
        setCart(newCart)
      }
    }
  }

  return (
    <div className='jeuContainer'>
      <Head>
        <title>Max And Lea - Blog - {t("MusiqueJeunes.1")}</title>
      </Head>
      <Header />
      <div className="img-blog-container musique-top">
      </div>

      <div className="container1000">
        <div className="date-container">
          <FontAwesomeIcon icon={faCalendar} className="calendar" />
          <p className="date-text">{t("MusiqueJeunes.0")}</p>
        </div>

        <h1 style={{ textAlign: 'center' }}>{t("MusiqueJeunes.1")}</h1>
        <hr />
        <div className="introduction">
          <p>{t("MusiqueJeunes.2")}</p>
        </div>
        <hr />

        <div className="row">
          <div className="col-sm-6">
            <p>{t("MusiqueJeunes.3")}

              <ul>
                <li><span style={{ fontWeight: 'bold' }}>{t("MusiqueJeunes.4")}</span><br></br>{t("MusiqueJeunes.5")}</li>
                <li><span style={{ fontWeight: 'bold' }}>{t("MusiqueJeunes.6")}</span><br></br>{t("MusiqueJeunes.7")}</li>
                <li><span style={{ fontWeight: 'bold' }}>{t("MusiqueJeunes.8")}</span><br></br>{t("MusiqueJeunes.9")}</li>
                <li><span style={{ fontWeight: 'bold' }}>{t("MusiqueJeunes.10")}</span><br></br>{t("MusiqueJeunes.11")}</li>
                <li><span style={{ fontWeight: 'bold' }}>{t("MusiqueJeunes.12")}</span><br></br>{t("MusiqueJeunes.13")}</li>
              </ul>
            </p>
          </div>
          <div className="col-sm-6">
            <img src={'/saxophone-child.webp'} alt="" className="enfants-souriant-blog" />
          </div>
        </div>

        <div className="description-blog">
          <p>{t("MusiqueJeunes.14")}<a href="https://www.harmony-project.org/" target="_blank">Harmony Project </a>{t("MusiqueJeunes.15")}</p>
        </div>

        <div className="img-blog2-container">
          <img src={'/music-bebe.webp'} alt="" className="img-blog2" />
        </div>

        <div className="conseilMaxEtLea">
          <h4>{t("MusiqueJeunes.16")}</h4>

          <div className="conseilTitre">
            <img src="/triangle.svg" alt="" className='titre-img' />
            <h5>{t("MusiqueJeunes.17")}</h5>
          </div>
          <div className="conseildescription">
            <p>{t("MusiqueJeunes.18")}</p>
          </div>

          <div className="conseilTitre">
            <img src="/carre.svg" alt="" className='titre-img' />
            <h5>{t("MusiqueJeunes.19")}</h5>
          </div>
          <div className="conseildescription">
            <p>{t("MusiqueJeunes.20")}</p>
          </div>

          <div className="conseilTitre">
            <img src="/etoile.svg" alt="" className='titre-img' />
            <h5>{t("MusiqueJeunes.21")}</h5>
          </div>
          <div className="conseildescription">
            <p>{t("MusiqueJeunes.22")}</p>
          </div>

          <div className="conseilTitre">
            <img src="/cercle.svg" alt="" className='titre-img' />
            <h5>{t("MusiqueJeunes.23")}</h5>
          </div>
          <div className="conseildescription">
            <p>{t("MusiqueJeunes.24")}<a href="/xylophone"> {t("MusiqueJeunes.25")} </a>{t("MusiqueJeunes.26")}</p>
          </div>

          <div className="conseilTitre">
            <img src="/triangle.svg" alt="" className='titre-img' />
            <h5>{t("MusiqueJeunes.27")}</h5>
          </div>
          <div className="conseildescription">
            <p>{t("MusiqueJeunes.28")}</p>
          </div>
        </div>

        <div className="img-blog2-container">
          <img src={'/xylo-Facing.webp'} alt="" className="img-blog2" />
        </div>
      </div>

        <div className="aimez-aussi" style={{marginTop:"0px"}}>
          <h2>{t("Blogs.19")}</h2>
          <Container>
            <Row className="row-card">
              <Col sm={4} md={4} lg={4} xl={4} className="col-card">
                <Card className="card-list-container">
                  <Link href='/blogs/PourquoiLesEnfantsJouent'>
                    <Card.Img src={'/Playboard-Angelique-Kosinski.webp'} variant="top" className="math-image" />
                  </Link>
                  <Card.Body className="card-body">
                    <Card.Title className="card-title">{t("Blogs.5")}</Card.Title>
                    <Link href='/blogs/PourquoiLesEnfantsJouent'>
                      <a className="read-more-button" >{t("Blogs.2")}</a>
                    </Link>
                  </Card.Body>
                </Card>
              </Col>

              <Col sm={4} md={4} lg={4} xl={4} className="col-card">
                <Card className="card-list-container">
                  <Link href='/xylo'>
                    <Card.Img src={products[0].image} variant="top" className="math-image" />
                  </Link>
                  <Card.Body className="card-body">
                    <Card.Title className="card-title card-no-margin">{t("products.xylo")}<br/>
                      <div className='playboard-card'>
                        <p className='prix-playboard-card-cross'>{products[0].priceAugmente}</p>
                        <p className='prix-playboard-card-true'>{products[0].price}</p>
                      </div>
                    </Card.Title>
                    <div onClick={() => {
                    handleAddToCart()
                    router.push('/checkout')
                  }}>
                      <a className="read-more-button">{t("products.cart")}</a>
                    </div>
                  </Card.Body>
                </Card>
              </Col>

              <Col sm={4} md={4} lg={4} xl={4} className="col-card">
                <Card className="card-list-container">
                  <Link href='/blogs/ConcilierTravailEtEducation'>
                    <Card.Img src={'/child-fun-family.webp'} variant="top" className="math-image" />
                  </Link>
                  <Card.Body className="card-body">
                    <Card.Title className="card-title">{t("Blogs.9")}</Card.Title>
                    <Link href='/blogs/ConcilierTravailEtEducation'>
                      <a className="read-more-button" >{t("Blogs.2")}</a>
                    </Link>
                  </Card.Body>
                </Card>
              </Col>

            </Row>
          </Container>
        </div>

      <Footer />

    </div>
  );
};

export default MusiquesEtJeunesEnfants;

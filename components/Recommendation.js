import React from 'react';
import Slider from "react-slick";
import {useTranslation} from "react-i18next";

const Recommendation = () => {


  const settingsRecommandations = {
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplaySpeed: 3000,
  };

  const { t, i18n } = useTranslation();
  return (
    <div className="row">
      <div className="col recommendationCol distributeurs">
        <p className="distributionP">{t("Recommendation.1")}</p>
        <Slider {...settingsRecommandations}>
          <div>
            <img src={'/amazon-prime.webp'} alt=""/>
            <p>{t("Recommendation.2")} : <b>4.9</b>/5</p>
          </div>
          <div>
            <img src={'/etsy.webp'} alt=""/>
            <p>{t("Recommendation.2")} : <b>4.9</b>/5</p>
          </div>
          <div>
            <img src={'/apesanteur.webp'} alt=""/>
          </div>
          <div>
            <img src={'/neminemo.webp'} alt=""/>
          </div>
          <div>
            <img src={'/trait-union.webp'} alt=""/>
          </div>
        </Slider>
      </div>
      <div className="col recommendationCol clients">
        <p className="distributionP">{t("Recommendation.3")}</p>
        <Slider {...settingsRecommandations}>
          <div>
            <a target="_blank" href='https://fr.trustpilot.com/review/maxandlea.com'>
              <img src={'/trustpilot.webp'} alt=""/>
              <p>{t("Recommendation.2")} : <b>4.9</b>/5</p>
            </a>
          </div>
          <div>
            <a target="_blank" href='https://www.google.com/search?biw=2559&bih=1222&ei=MdKIX5WlLsvIaNvaq6AF&q=Max+%26+Lea+review&oq=Max+%26+Lea+review&gs_lcp=CgZwc3ktYWIQAzIICAAQBxAFEB5QxThYxThgvjtoAnAAeACAAWSIAWSSAQMwLjGYAQCgAQGqAQdnd3Mtd2l6wAEB&sclient=psy-ab&ved=0ahUKEwjVgb_K17fsAhVLJBoKHVvtClQQ4dUDCA0&uact=5'>
              <img src={'/Google-Reviews.webp'} alt=""/>
              <p>{t("Recommendation.2")} : <b>4.9</b>/5</p>
            </a>
          </div>
        </Slider>
      </div>
    </div>
  );
};

export default Recommendation;

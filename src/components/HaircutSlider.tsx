import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "../css/HaircutSlider.css";

const images = [
  "/assets/images/pic1.jpeg",
  "/assets/images/pic2.png",
  "/assets/images/pic3.png",
  "/assets/images/pic4.png",
  "/assets/images/pic5.png",
];

const Slider = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="slider-container">
      <motion.img
        key={images[index]}
        src={images[index]}
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 1 }}
        className="slider-image"
      />
      <div className="slider-overlay">
        <p className="slider-text">תמונות מהיום</p>
      </div>
    </div>
  );
};

export default Slider;

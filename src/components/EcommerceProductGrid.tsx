// import React, { useState } from "react";
// import { Star } from "lucide-react";

// // Sample Mocha products
// const products = [
//   {
//     id: 1,
//     name: "Mocha Blend Coffee",
//     price: 15,
//     rating: 4.5,
//     image: "/assets/images/product1.jpg",
//   },
//   {
//     id: 2,
//     name: "Premium Mocha Beans",
//     price: 22,
//     rating: 5,
//     image: "/assets/images/product1.jpg",
//   },
//   {
//     id: 3,
//     name: "Mocha Coffee Powder",
//     price: 18,
//     rating: 4,
//     image: "/assets/images/product1.jpg",
//   },
//   {
//     id: 4,
//     name: "Dark Mocha Espresso",
//     price: 25,
//     rating: 4.8,
//     image: "/assets/images/product1.jpg",
//   },
// ];

// const ProductGrid: React.FC = () => {
//   const [maxPrice, setMaxPrice] = useState<number>(30);
//   const [minRating, setMinRating] = useState<number>(0);

//   // Filter products
//   const filteredProducts = products.filter(
//     (product) => product.price <= maxPrice && product.rating >= minRating
//   );

//   return (
//     <div className="p-4 max-w-4xl mx-auto">
//       {/* Filter Bar */}
//       <div className="flex items-center justify-between mb-4 gap-4">
//         <div className="w-1/2">
//           <label className="block text-sm font-medium">
//             Max Price: ${maxPrice}
//           </label>
//           <input
//             type="range"
//             min={0}
//             max={50}
//             step={5}
//             value={maxPrice}
//             onChange={(e) => setMaxPrice(Number(e.target.value))}
//             className="w-full"
//           />
//         </div>
//         <div className="w-1/2">
//           <label className="block text-sm font-medium">Minimum Rating</label>
//           <div className="flex gap-2">
//             {[1, 2, 3, 4, 5].map((star) => (
//               <button
//                 key={star}
//                 className={`p-2 border rounded ${
//                   minRating === star
//                     ? "bg-blue-500 text-white"
//                     : "bg-white border-gray-300"
//                 }`}
//                 onClick={() => setMinRating(star)}
//               >
//                 <Star
//                   className={`h-4 w-4 ${
//                     star <= minRating ? "text-yellow-500" : "text-gray-400"
//                   }`}
//                 />
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Product Grid */}
//       <div className="grid grid-cols-2 gap-4">
//         {filteredProducts.map((product) => (
//           <div key={product.id} className="p-2 border rounded-lg shadow-md">
//             <img
//               src={product.image}
//               alt={product.name}
//               className="w-full h-40 object-cover rounded-lg"
//             />
//             <div className="p-2">
//               <h3 className="text-lg font-semibold">{product.name}</h3>
//               <p className="text-gray-600">${product.price}</p>
//               <div className="flex items-center gap-1 text-yellow-500">
//                 {[...Array(5)].map((_, i) => (
//                   <Star
//                     key={i}
//                     className={`h-4 w-4 ${
//                       i < product.rating ? "fill-current" : "text-gray-300"
//                     }`}
//                   />
//                 ))}
//               </div>
//               <button className="mt-2 w-full bg-blue-500 text-white p-2 rounded">
//                 Add to Cart
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ProductGrid;

import React, { useState } from "react";
import { Star } from "lucide-react";
import "../css/ProductGrid.css";

// Sample Mocha products
const products = [
  {
    id: 1,
    name: "Mocha Blend Coffee",
    price: 15,
    rating: 4.5,
    image: "/assets/images/product1.jpg",
  },
  {
    id: 2,
    name: "Premium Mocha Beans",
    price: 22,
    rating: 5,
    image: "/assets/images/product2.jpg",
  },
  {
    id: 3,
    name: "Mocha Coffee Powder",
    price: 18,
    rating: 4,
    image: "/assets/images/product3.jpg",
  },
  {
    id: 4,
    name: "Dark Mocha Espresso",
    price: 25,
    rating: 4.8,
    image: "/assets/images/product4.webp",
  },
  {
    id: 5,
    name: "Dark Mocha Espresso",
    price: 25,
    rating: 4.8,
    image: "/assets/images/product5.jpg",
  },
  {
    id: 6,
    name: "Dark Mocha Espresso",
    price: 25,
    rating: 4.8,
    image: "/assets/images/product6.jpg",
  },
  {
    id: 7,
    name: "Dark Mocha Espresso",
    price: 25,
    rating: 4.8,
    image: "/assets/images/product7.jpg",
  },
  {
    id: 8,
    name: "Dark Mocha Espresso",
    price: 25,
    rating: 4.8,
    image: "/assets/images/product8.jpg",
  },
];

const ProductGrid: React.FC = () => {
  const [maxPrice, setMaxPrice] = useState<number>(30);
  const [minRating, setMinRating] = useState<number>(0);

  // Filter products
  const filteredProducts = products.filter(
    (product) => product.price <= maxPrice && product.rating >= minRating
  );

  return (
    <div className="product-grid-container">
      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="filter-item">
          <label>₪ מקס׳ מחיר {maxPrice}</label>
          <input
            type="range"
            min={0}
            max={50}
            step={5}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          />
        </div>
        <div className="filter-item">
          <label>רייטינג</label>
          <div className="rating-filter">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                className={`star-button ${minRating === star ? "active" : ""}`}
                onClick={() => setMinRating(star)}
              >
                <Star
                  className={`star-icon ${
                    star <= minRating ? "filled" : "empty"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="product-grid">
        {filteredProducts.map((product) => (
          <div key={product.id} className="product-card">
            <img
              src={product.image}
              alt={product.name}
              className="product-image"
            />
            <div className="product-info">
              <h3>{product.name}</h3>
              <p>₪{product.price}</p>
              <div className="rating-display">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`star-icon ${
                      i < product.rating ? "filled" : "empty"
                    }`}
                  />
                ))}
              </div>
              <button className="add-to-cart">לרכישת המוצר</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;

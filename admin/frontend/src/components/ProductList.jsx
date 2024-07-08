import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "bulma/css/bulma.min.css";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products: ", error);
    }
  };

  const handleDeleteClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const resp = await axios.delete(`http://localhost:5000/products/${selectedProduct.uuid}`);
      console.log(resp);
      if (resp.status === 200) {
        await getProducts();
        setIsModalOpen(false);
        setSelectedProduct(null);
      } else {
        alert('Failed to delete');
      }
    } catch (error) {
      console.error("Error deleting product: ", error);
    }
  };

  return (
    <div>
      <h1 className="title">Products</h1>
      <h2 className="subtitle">List of Products</h2>
      <Link to="/products/add" className="button is-primary mb-2">
        Add New
      </Link>
      <table className="table is-striped is-fullwidth">
        <thead>
          <tr>
            <th>No</th>
            <th>Image</th>
            <th>Product Name</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Created By</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={product.uuid}>
              <td>{index + 1}</td>
              <td>
                {product.image && (
                  <img
                    src={`http://localhost:5000${product.image}`}
                    alt={product.name}
                    style={{ width: "100px", height: "100px", objectFit: "cover" }}
                  />
                )}
              </td>
              <td>{product.name}</td>
              <td>{product.price}</td>
              <td>{product.stock}</td>
              <td>{product.user.name}</td>
              <td>
                <Link
                  to={`/products/edit/${product.uuid}`}
                  className="button is-small is-info mr-1"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDeleteClick(product)}
                  className="button is-small is-danger"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className={`modal ${isModalOpen ? "is-active" : ""}`}>
          <div className="modal-background"></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">Confirm Delete</p>
              <button
                className="delete"
                aria-label="close"
                onClick={() => setIsModalOpen(false)}
              ></button>
            </header>
            <section className="modal-card-body">
              <p>Are you sure you want to delete this product?</p>
              <p><strong>{selectedProduct && selectedProduct.name}</strong></p>
            </section>
            <footer className="modal-card-foot">
              <button className="button is-danger" onClick={confirmDelete}>Delete</button>
              <button className="button" onClick={() => setIsModalOpen(false)}>Cancel</button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;

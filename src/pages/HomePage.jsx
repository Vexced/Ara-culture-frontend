import React, { useEffect, useState } from 'react';
import { Carousel, Card, Row, Col, Typography, Spin, message } from 'antd';
import axios from '../api/axios'; // usa tu instancia con token
import MainLayout from '../components/MainLayout';
import { Link } from 'react-router-dom';

const { Title } = Typography;
const { Meta } = Card;

const categoriesOrder = ['Ropa', 'Accesorios', 'Joyería', 'Calzado'];

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
  async function fetchProducts() {
    try {
      setLoading(true);
      const res = await axios.get('/products'); // ya incluye baseURL
      setProducts(res.data.content); // content porque el backend devuelve Page<Product>
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      message.error('Error cargando productos');
    } finally {
      setLoading(false);
    }
  }
  fetchProducts();
}, []);

  // Filtrar productos nuevos y populares para el carrusel
  const newAndPopular = products.filter((p) => p.newArrival || p.popular);

  // Agrupar productos por categoría
  const groupedByCategory = categoriesOrder.reduce((acc, category) => {
    acc[category] = products.filter((p) => p.category === category);
    return acc;
  }, {});

  if (loading) return <Spin style={{ display: 'block', margin: '50px auto' }} size="large" />;

  if (error) return <div>Error: {error}</div>;

  return (
    <>
      {/* Carrusel */}
      <Carousel autoplay>
        {newAndPopular.map((product) => (
          <div key={product.id}>
            <Link to={`/product/${product.id}`}>
              <div
                style={{
                  height: 300,
                  color: '#fff',
                  lineHeight: '300px',
                  textAlign: 'center',
                  background: `url(${product.imageUrl}) center center / cover no-repeat`,
                }}
              >
                <h2 style={{ background: 'rgba(0,0,0,0.5)', display: 'inline-block', padding: '0 20px' }}>
                  {product.name} - ${product.price}
                </h2>
              </div>
            </Link>
          </div>
        ))}
      </Carousel>

      {/* Listado por categorías */}
      {categoriesOrder.map((category) => (
        <div key={category} style={{ marginTop: 40 }}>
          <Title level={3}>{category}</Title>
          <Row gutter={[16, 16]}>
            {groupedByCategory[category].length === 0 && <p>No hay productos en esta categoría.</p>}
            {groupedByCategory[category].map((product) => (
              <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
                <Link to={`/product/${product.id}`}>
                  <Card
                    hoverable
                    cover={<img alt={product.name} src={product.imageUrl} style={{ height: 200, objectFit: 'cover' }} />}
                  >
                    <Meta title={product.name} description={`$${product.price}`} />
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        </div>
      ))}
</>
  );
}

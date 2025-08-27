/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Image, Typography, Button, message, Space } from 'antd';
import axios from '../api/axios';
import MainLayout from '../components/MainLayout';
import { AuthContext } from '../context/AuthContext';

const { Title, Paragraph } = Typography;

export default function ProductPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const res = await axios.get(`/products/${productId}`);
        setProduct(res.data);
      } catch (error) {
        message.error('Error cargando producto');
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [productId]);

  if (loading) return <div style={{ textAlign: 'center', marginTop: 50 }}>Cargando...</div>;

  if (!product) return <div>Producto no encontrado</div>;

  // Funciones para manejar botones
  // ... dentro de ProductPage.jsx
const addToCart = async () => {
  try {
    await axios.post(`/user/cart/${product.id}?quantity=1`);
    message.success('Producto agregado al carrito');
  } catch {
    message.error('Debes iniciar sesión');
  }
};

const addToFavorites = async () => {
  try {
    await axios.post(`/user/favorites/${product.id}`);
    message.success('Producto agregado a favoritos');
  } catch {
    message.error('Debes iniciar sesión');
  }
};

  const buyNow = () => {
    // Guardar el producto en sesión o contexto para pagar
    // Aquí simplemente navegamos a carrito para simplificar
    message.info('Redirigiendo a pago...');
    navigate('/cart');
  };

  return (
    <>
      <Row gutter={32}>
        <Col xs={24} md={12}>
          <Image src={product.imageUrl} alt={product.name} />
        </Col>
        <Col xs={24} md={12}>
          <Title>{product.name}</Title>
          <Title level={3} style={{ color: '#1890ff' }}>${product.price}</Title>
          <Paragraph>{product.description}</Paragraph>

          <Space size="middle" style={{ marginTop: 20 }}>
            <Button type="primary" onClick={addToCart}>
              Agregar al carrito
            </Button>
            <Button onClick={addToFavorites}>Guardar en favoritos</Button>
            <Button type="ghost" danger onClick={buyNow}>
              Comprar ahora
            </Button>
          </Space>
        </Col>
      </Row>
    </>
  );
}

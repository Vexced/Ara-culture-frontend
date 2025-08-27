/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useContext } from 'react';
import { List, Button, Typography, Image, InputNumber, message, Row, Col } from 'antd';
import axios from '../api/axios';
import MainLayout from '../components/MainLayout';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

export default function CartPage() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Traer carrito
  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/user/cart', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(res.data);
    } catch (error) {
      message.error('Error cargando carrito');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Cambiar cantidad
  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    setUpdating(true);
    try {
      await axios.put(
        `/user/cart/${productId}`,
        { quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchCart();
    } catch {
      message.error('Error actualizando cantidad');
    } finally {
      setUpdating(false);
    }
  };

  // Eliminar producto
  const removeItem = async (productId) => {
    setUpdating(true);
    try {
      await axios.delete(`/user/cart/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchCart();
    } catch {
      message.error('Error eliminando producto');
    } finally {
      setUpdating(false);
    }
  };

  // Total
  const total = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      message.warning('El carrito está vacío');
      return;
    }
    navigate('/checkout'); // página de pago que harás después
  };

  return (
    <>
      <Title level={2}>Carrito de compras</Title>

      <List
        loading={loading || updating}
        dataSource={cartItems}
        locale={{ emptyText: 'El carrito está vacío' }}
        renderItem={({ product, quantity }) => (
          <List.Item
            actions={[
              <InputNumber
                min={1}
                value={quantity}
                onChange={(value) => updateQuantity(product.id, value)}
              />,
              <Button danger onClick={() => removeItem(product.id)}>
                Eliminar
              </Button>,
            ]}
          >
            <List.Item.Meta
              avatar={<Image width={80} src={product.imageUrl} />}
              title={product.name}
              description={`Precio unitario: $${product.price}`}
            />
            <div style={{ fontWeight: 'bold' }}>
              Subtotal: ${product.price * quantity}
            </div>
          </List.Item>
        )}
      />

      <Row justify="end" style={{ marginTop: 20 }}>
        <Col>
          <Title level={3}>Total: ${total}</Title>
          <Button
            type="primary"
            onClick={handleCheckout}
            disabled={cartItems.length === 0}
          >
            Pagar
          </Button>
        </Col>
      </Row>
    </>
  );
}

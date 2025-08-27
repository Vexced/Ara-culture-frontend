/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Form, Input, Button, message, Typography } from 'antd';
import axios from '../api/axios';
import MainLayout from '../components/MainLayout';

const { Title } = Typography;

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await axios.post('/user/orders/checkout', {
        receiverName: values.receiverName,
        shippingAddress: values.shippingAddress,
      });
      message.success('Pago realizado y pedido creado');
      window.location.href = '/profile'; // muestra pedidos
    } catch (e) {
      message.error('No se pudo procesar el pago');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <Title level={2}>Pago</Title>
      <Form layout="vertical" onFinish={onFinish} style={{ maxWidth: 500 }}>
        <Form.Item label="Nombre del receptor" name="receiverName" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Dirección de envío" name="shippingAddress" rules={[{ required: true }]}>
          <Input.TextArea rows={3} />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Pagar (simulado)
        </Button>
      </Form>
    </MainLayout>
  );
}

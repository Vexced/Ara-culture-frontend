import React, { useState } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';

const { Title } = Typography;

export default function PasswordRecoveryPage() {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);

    try {
      // Aquí llamarías a tu backend para enviar email de recuperación
      // Ejemplo:
      // await axios.post('http://localhost:8080/api/auth/recover-password', { email: values.email });

      // Como no hay backend aún, simulamos:
      await new Promise((resolve) => setTimeout(resolve, 1000));

      message.success(
        'Si el correo existe en nuestra base, recibirás un email para recuperar tu contraseña.'
      );
    } catch (error) {
      message.error('Error enviando el email de recuperación.');
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: 'auto',
        marginTop: 100,
        padding: 20,
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        borderRadius: 6,
      }}
    >
      <Title level={2} style={{ textAlign: 'center' }}>
        Recuperar contraseña
      </Title>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Correo electrónico"
          name="email"
          rules={[
            { required: true, message: 'Por favor ingresa tu correo electrónico' },
            { type: 'email', message: 'Correo inválido' },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Enviar enlace de recuperación
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

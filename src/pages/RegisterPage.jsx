import React, { useState } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const { Title } = Typography;

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await axios.post('http://localhost:8080/api/auth/register', values);
      message.success('Registro exitoso. Por favor inicia sesión.');
      navigate('/login');
    } catch (error) {
      console.error('Error en registro:', error.response?.data || error.message);
      message.error('Error en el registro: ' + (error.response?.data?.message || error.message));
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
        Registro
      </Title>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Usuario"
          name="username"
          rules={[{ required: true, message: 'Por favor ingresa un usuario' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Correo electrónico"
          name="email"
          rules={[
            { required: true, message: 'Por favor ingresa un correo' },
            { type: 'email', message: 'Correo inválido' },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Nombre"
          name="firstName"
          rules={[{ required: true, message: 'Por favor ingresa tu nombre' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Apellido"
          name="lastName"
          rules={[{ required: true, message: 'Por favor ingresa tu apellido' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Dirección"
          name="address"
          rules={[{ required: true, message: 'Por favor ingresa una dirección' }]}
        >
          <Input.TextArea rows={2} />
        </Form.Item>

        <Form.Item
          label="Contraseña"
          name="password"
          rules={[{ required: true, message: 'Por favor ingresa una contraseña' }]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="Confirmar contraseña"
          name="confirm"
          dependencies={['password']}
          hasFeedback
          rules={[
            { required: true, message: 'Por favor confirma tu contraseña' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Las contraseñas no coinciden'));
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Registrarse
          </Button>
        </Form.Item>

        <Form.Item style={{ textAlign: 'center' }}>
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </Form.Item>
      </Form>
    </div>
  );
}

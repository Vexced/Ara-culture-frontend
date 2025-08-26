import React, { useState } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const { Title } = Typography;

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8080/api/auth/login', values);
      localStorage.setItem('token', res.data.jwtToken);
      message.success('Login exitoso');
      navigate('/');
    } catch (error) {
      message.error('Error en login: ' + (error.response?.data?.message || error.message));
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
        Iniciar Sesión
      </Title>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Usuario"
          name="username"
          rules={[{ required: true, message: 'Por favor ingresa tu usuario' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Contraseña"
          name="password"
          rules={[{ required: true, message: 'Por favor ingresa tu contraseña' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Entrar
          </Button>
        </Form.Item>

        <Form.Item style={{ textAlign: 'center' }}>
          ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
        </Form.Item>

        <Form.Item style={{ textAlign: 'right' }}>
          <Link to="/recover-password">¿Olvidaste tu contraseña?</Link>
        </Form.Item>
      
      </Form>
      
    </div>
  );
}

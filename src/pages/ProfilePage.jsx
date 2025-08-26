import React, { useEffect, useState, useContext } from 'react';
import {
  Typography,
  Tabs,
  Form,
  Input,
  Button,
  List,
  Card,
  message,
  Modal,
  Spin,
} from 'antd';
import axios from '../api/axios';
import MainLayout from '../components/MainLayout';
import { AuthContext } from '../context/AuthContext';

const { Title } = Typography;
const { TabPane } = Tabs;

function ProfilePage() {
  const { token, user, setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  // Pedidos y favoritos
  const [orders, setOrders] = useState([]);
  const [favorites, setFavorites] = useState([]);

  // Editar info usuario
  const [editForm] = Form.useForm();

  // Cambiar contraseña
  const [passwordForm] = Form.useForm();
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [ordersRes, favoritesRes] = await Promise.all([
          axios.get('/user/orders', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('/user/favorites', { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setOrders(ordersRes.data);
        setFavorites(favoritesRes.data);

        // Rellenar form con info actual
        editForm.setFieldsValue({
          firstName: user?.firstName,
          lastName: user?.lastName,
          username: user?.username,
          address: user?.address,
          email: user?.email,
        });
      } catch (error) {
        message.error('Error cargando datos del perfil');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [token, user, editForm]);

  // Guardar cambios de info usuario
  const onEditFinish = async (values) => {
    try {
      await axios.put('/user/profile', values, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success('Información actualizada');
      setUser((prev) => ({ ...prev, ...values }));
    } catch {
      message.error('Error actualizando información');
    }
  };

  // Cambiar contraseña
  const onPasswordFinish = async (values) => {
    setPasswordLoading(true);
    try {
      await axios.post(
        '/user/change-password',
        {
          oldPassword: values.oldPassword,
          newPassword: values.newPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success('Contraseña cambiada con éxito');
      setPasswordModalVisible(false);
      passwordForm.resetFields();
    } catch {
      message.error('Error cambiando la contraseña');
    }
    setPasswordLoading(false);
  };

  if (loading) return <Spin style={{ marginTop: 100 }} size="large" />;

  return (
    <>
      <Title level={2}>Perfil de Usuario</Title>

      <Tabs defaultActiveKey="1" type="card">
        {/* Información */}
        <TabPane tab="Información" key="1">
          <Form
            layout="vertical"
            form={editForm}
            onFinish={onEditFinish}
            style={{ maxWidth: 600 }}
          >
            <Form.Item label="Nombre" name="firstName" rules={[{ required: true }]}>
              <Input />
            </Form.Item>

            <Form.Item label="Apellido" name="lastName" rules={[{ required: true }]}>
              <Input />
            </Form.Item>

            <Form.Item label="Usuario" name="username" rules={[{ required: true }]}>
              <Input disabled />
            </Form.Item>

            <Form.Item label="Correo" name="email" rules={[{ required: true, type: 'email' }]}>
              <Input disabled />
            </Form.Item>

            <Form.Item label="Dirección" name="address" rules={[{ required: true }]}>
              <Input.TextArea rows={3} />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Guardar cambios
              </Button>
            </Form.Item>
          </Form>
        </TabPane>

        {/* Pedidos */}
        <TabPane tab="Pedidos" key="2">
          <List
            grid={{ gutter: 16, column: 1 }}
            dataSource={orders}
            locale={{ emptyText: 'No hay pedidos' }}
            renderItem={(order) => (
              <List.Item key={order.id}>
                <Card title={`Pedido #${order.id} - Estado: ${order.status}`}>
                  <ul>
                    {order.items.map((item) => (
                      <li key={item.product.id}>
                        {item.product.name} x {item.quantity} = ${item.product.price * item.quantity}
                      </li>
                    ))}
                  </ul>
                  <p>
                    <strong>Total: </strong>${order.total}
                  </p>
                </Card>
              </List.Item>
            )}
          />
        </TabPane>

        {/* Favoritos */}
        <TabPane tab="Favoritos" key="3">
          <List
            grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4 }}
            dataSource={favorites}
            locale={{ emptyText: 'No hay favoritos' }}
            renderItem={(product) => (
              <List.Item key={product.id}>
                <Card
                  hoverable
                  cover={<img alt={product.name} src={product.imageUrl} style={{ height: 200, objectFit: 'cover' }} />}
                >
                  <Card.Meta title={product.name} description={`$${product.price}`} />
                </Card>
              </List.Item>
            )}
          />
        </TabPane>

        {/* Configuración de cuenta */}
        <TabPane tab="Configuración" key="4">
          <Button type="primary" onClick={() => setPasswordModalVisible(true)}>
            Cambiar contraseña
          </Button>
          <Modal
            title="Cambiar contraseña"
            visible={passwordModalVisible}
            onCancel={() => setPasswordModalVisible(false)}
            footer={null}
          >
            <Form layout="vertical" form={passwordForm} onFinish={onPasswordFinish}>
              <Form.Item
                label="Contraseña actual"
                name="oldPassword"
                rules={[{ required: true, message: 'Ingresa tu contraseña actual' }]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                label="Nueva contraseña"
                name="newPassword"
                rules={[{ required: true, message: 'Ingresa una nueva contraseña' }]}
                hasFeedback
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                label="Confirmar nueva contraseña"
                name="confirmPassword"
                dependencies={['newPassword']}
                hasFeedback
                rules={[
                  { required: true, message: 'Confirma tu nueva contraseña' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject('Las contraseñas no coinciden');
                    },
                  }),
                ]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={passwordLoading}>
                  Cambiar contraseña
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </TabPane>
      </Tabs>
    </>
  );
}
export default ProfilePage;

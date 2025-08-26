import React, { useEffect, useState, useContext } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  message,
  Popconfirm,
  Typography,
} from 'antd';
import axios from '../api/axios';
import MainLayout from '../components/MainLayout';
import { AuthContext } from '../context/AuthContext';

const { Title } = Typography;
const { Option } = Select;

const PAGE_SIZE = 10;

export default function AdminProductsPage() {
  const { token } = useContext(AuthContext);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();

  // Paginación (puedes agregar control si quieres)
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/products', {
        headers: { Authorization: `Bearer ${token}` },
        params: { size: 1000 }, // traer todos, o adapta paginado
      });
      setProducts(res.data);
    } catch (error) {
      message.error('Error cargando productos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Abrir modal para nuevo producto o editar
  const openModal = (product = null) => {
    setEditingProduct(product);
    if (product) {
      form.setFieldsValue(product);
    } else {
      form.resetFields();
    }
    setModalVisible(true);
  };

  // Guardar producto nuevo o editar
  const onFinish = async (values) => {
    try {
      if (editingProduct) {
        // Actualizar
        await axios.put(`/products/${editingProduct.id}`, values, {
          headers: { Authorization: `Bearer ${token}` },
        });
        message.success('Producto actualizado');
      } else {
        // Nuevo
        await axios.post('/products', values, {
          headers: { Authorization: `Bearer ${token}` },
        });
        message.success('Producto creado');
      }
      setModalVisible(false);
      fetchProducts();
    } catch (error) {
      message.error('Error guardando producto');
    }
  };

  // Eliminar producto
  const deleteProduct = async (id) => {
    try {
      await axios.delete(`/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success('Producto eliminado');
      fetchProducts();
    } catch {
      message.error('Error eliminando producto');
    }
  };

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Precio',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `$${price}`,
    },
    {
      title: 'Categoría',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Descripción',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => openModal(record)}>
            Editar
          </Button>
          <Popconfirm
            title="¿Eliminar producto?"
            onConfirm={() => deleteProduct(record.id)}
            okText="Sí"
            cancelText="No"
          >
            <Button type="link" danger>
              Eliminar
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <>
      <Title level={2}>Administrar Productos</Title>
      <Button type="primary" style={{ marginBottom: 16 }} onClick={() => openModal()}>
        Añadir nuevo producto
      </Button>

      <Table
        dataSource={products}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: PAGE_SIZE }}
      />

      <Modal
        visible={modalVisible}
        title={editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
        onCancel={() => setModalVisible(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ price: 0 }}>
          <Form.Item
            label="Nombre"
            name="name"
            rules={[{ required: true, message: 'Ingresa el nombre del producto' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Precio"
            name="price"
            rules={[{ required: true, message: 'Ingresa el precio' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="Categoría"
            name="category"
            rules={[{ required: true, message: 'Selecciona la categoría' }]}
          >
            <Select placeholder="Selecciona categoría">
              <Option value="Ropa">Ropa</Option>
              <Option value="Accesorios">Accesorios</Option>
              <Option value="Joyería">Joyería</Option>
              <Option value="Calzado">Calzado</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Descripción" name="description">
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item
            label="URL imagen"
            name="imageUrl"
            rules={[{ required: true, message: 'Ingresa la URL de la imagen' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {editingProduct ? 'Actualizar' : 'Crear'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

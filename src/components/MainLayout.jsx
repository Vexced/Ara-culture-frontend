import React, { useState, useContext } from 'react';
import { Layout, Menu, Avatar, Badge, Dropdown } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const { Header, Sider, Content, Footer } = Layout;

const categories = ['Ropa', 'Accesorios', 'Joyería', 'Calzado'];

function MainLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const { user, logout } = useContext(AuthContext);

  const toggle = () => setCollapsed(!collapsed);

  // roles del usuario
  const roles = user?.roles || [];
  const isAdmin = roles.includes('ROLE_ADMIN') || roles.includes('ADMIN');

  // Ejemplo carrito: aquí deberías conectar con un CartContext o estado real
  const cartItemCount = 0;

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" onClick={() => navigate('/profile')}>
        Perfil
      </Menu.Item>
      <Menu.Item key="logout" onClick={handleLogout}>
        Cerrar sesión
      </Menu.Item>
    </Menu>
  );

  const cartDropdown = (
    <div style={{ padding: 10, width: 250 }}>
      <p><b>Carrito</b></p>
      {cartItemCount === 0 ? (
        <p>Tu carrito está vacío</p>
      ) : (
        <>
          <p>Producto 1 - Cantidad: 2</p>
          <p>Producto 2 - Cantidad: 1</p>
        </>
      )}
      <Link to="/cart">Ver carrito</Link>
    </div>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} trigger={null}>
        <div className="logo" style={{ color: 'white', padding: '16px', fontSize: 18 }}>
          {collapsed ? 'AC' : 'Ara Culture'}
        </div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['home']}>
          <Menu.Item key="home">
            <Link to="/">Inicio</Link>
          </Menu.Item>
          {categories.map((cat) => (
            <Menu.Item key={cat}>
              <Link to={`/category/${cat}`}>{cat}</Link>
            </Menu.Item>
          ))}

          {isAdmin && (
            <Menu.Item key="admin">
              <Link to="/admin/products">Admin Productos</Link>
            </Menu.Item>
          )}

          <Menu.Item key="info" style={{ marginTop: 'auto' }}>
            Info Ara Culture
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout>
        <Header
          style={{
            padding: '0 16px',
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {collapsed ? (
            <MenuUnfoldOutlined onClick={toggle} style={{ fontSize: 20 }} />
          ) : (
            <MenuFoldOutlined onClick={toggle} style={{ fontSize: 20 }} />
          )}

          <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
            <Dropdown overlay={cartDropdown} placement="bottomRight" trigger={['hover']}>
              <Badge count={cartItemCount} size="small">
                <ShoppingCartOutlined style={{ fontSize: 24, cursor: 'pointer' }} />
              </Badge>
            </Dropdown>

            <Dropdown overlay={userMenu} placement="bottomRight" trigger={['click']}>
              {user?.photoUrl ? (
                <Avatar src={user.photoUrl} style={{ cursor: 'pointer' }} />
              ) : (
                <Avatar icon={<UserOutlined />} style={{ cursor: 'pointer' }} />
              )}
            </Dropdown>
          </div>
        </Header>

        <Content style={{ margin: '16px' }}>{children}</Content>

        <Footer style={{ textAlign: 'center' }}>
          Ara Culture ©{new Date().getFullYear()} Created by Axel Uriel
        </Footer>
      </Layout>
    </Layout>
  );
}

export default MainLayout;

import React, { useEffect, useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { List, Pagination, Typography, Spin, message } from 'antd';
import axios from '../api/axios';
import MainLayout from '../components/MainLayout';

const { Title } = Typography;

const PAGE_SIZE = 8;

export default function CategoryPage() {
  const { categoryName } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Página actual en query string ?page=1 por ejemplo
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

 useEffect(() => {
  async function fetchProducts() {
    try {
      setLoading(true);
      const res = await axios.get('/products', {
        params: {
          category: categoryName, // asegúrate de que categoryName coincide con DB
          page: currentPage - 1,  // Spring Data Pageable es 0-indexed
          size: PAGE_SIZE,
        },
      });

      // Siempre usar content porque tu backend devuelve Page<Product>
      setProducts(res.data.content || []);
      setTotal(res.data.totalElements || 0);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      message.error('Error cargando productos');
    } finally {
      setLoading(false);
    }
  }
  fetchProducts();
}, [categoryName, currentPage]);


  const onPageChange = (page) => {
    setSearchParams({ page });
  };

  if (loading) return <Spin style={{ display: 'block', margin: '50px auto' }} size="large" />;

  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <Title level={2}>Categoría: {categoryName}</Title>

      <List
        grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4 }}
        dataSource={products}
        renderItem={(product) => (
          <List.Item key={product.id}>
            <Link to={`/product/${product.id}`}>
              <div style={{ border: '1px solid #eee', padding: 8, borderRadius: 6 }}>
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 4 }}
                />
                <h3>{product.name}</h3>
                <p>${product.price}</p>
              </div>
            </Link>
          </List.Item>
        )}
      />

      <Pagination
        current={currentPage}
        pageSize={PAGE_SIZE}
        total={total}
        onChange={onPageChange}
        style={{ textAlign: 'center', marginTop: 20 }}
      />
    </>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav style={{ padding: '1rem', backgroundColor: '#007bff', color: 'white' }}>
      <Link to="/" style={{ marginRight: '1rem', color: 'white' }}>Главная</Link>
      <Link to="/categories" style={{ marginRight: '1rem', color: 'white' }}>Категории</Link>
      <Link to="/products" style={{ marginRight: '1rem', color: 'white' }}>Товары</Link>
      <Link to="/sales" style={{ marginRight: '1rem', color: 'white' }}>Продажи</Link>
      <Link to="/expenses" style={{ color: 'white' }}>Затраты</Link>
    </nav>
  );
}

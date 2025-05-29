import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  where,
  Timestamp,
} from 'firebase/firestore';

function App() {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');

  const [products, setProducts] = useState([]);
  const [newProductName, setNewProductName] = useState('');
  const [newProductQuantity, setNewProductQuantity] = useState(1);
  const [newProductCategory, setNewProductCategory] = useState('');
  const [newPurchasePrice, setNewPurchasePrice] = useState('');
  const [newSalePrice, setNewSalePrice] = useState('');

  const [sales, setSales] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));

  useEffect(() => {
    const fetchCategories = async () => {
      const q = query(collection(db, 'categories'), orderBy('name'));
      const snapshot = await getDocs(q);
      setCategories(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      const q = query(collection(db, 'products'));
      const snapshot = await getDocs(q);
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchProducts();
  }, []);

  const addCategory = async () => {
    if (!newCategoryName.trim()) return alert('Введите имя категории');
    const docRef = await addDoc(collection(db, 'categories'), { name: newCategoryName.trim() });
    setCategories([...categories, { id: docRef.id, name: newCategoryName.trim() }]);
    setNewCategoryName('');
  };

  const addProduct = async () => {
    if (
      !newProductName.trim() ||
      !newProductCategory ||
      !newPurchasePrice ||
      !newSalePrice
    ) {
      return alert('Заполните все поля товара');
    }

    const purchasePriceNum = parseFloat(newPurchasePrice);
    const salePriceNum = parseFloat(newSalePrice);
    const quantityNum = Number(newProductQuantity);

    const docRef = await addDoc(collection(db, 'products'), {
      name: newProductName.trim(),
      quantity: quantityNum,
      category: newProductCategory,
      purchasePrice: purchasePriceNum,
      salePrice: salePriceNum,
    });

    setProducts([
      ...products,
      {
        id: docRef.id,
        name: newProductName.trim(),
        quantity: quantityNum,
        category: newProductCategory,
        purchasePrice: purchasePriceNum,
        salePrice: salePriceNum,
      },
    ]);

    setNewProductName('');
    setNewProductQuantity(1);
    setNewProductCategory('');
    setNewPurchasePrice('');
    setNewSalePrice('');
  };

  const addSale = async (productId, quantitySold) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const quantityNum = Number(quantitySold);
    if (quantityNum <= 0 || quantityNum > product.quantity) {
      alert('Неверное количество продажи');
      return;
    }

    await addDoc(collection(db, 'sales'), {
      productId,
      productName: product.name,
      quantity: quantityNum,
      purchasePrice: product.purchasePrice,
      salePrice: product.salePrice,
      date: Timestamp.fromDate(new Date(selectedDate)),
    });

    const updatedProducts = products.map(p =>
      p.id === productId ? { ...p, quantity: p.quantity - quantityNum } : p
    );
    setProducts(updatedProducts);
  };

  useEffect(() => {
    const fetchSales = async () => {
      const start = new Date(selectedDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(selectedDate);
      end.setHours(23, 59, 59, 999);

      const q = query(
        collection(db, 'sales'),
        where('date', '>=', Timestamp.fromDate(start)),
        where('date', '<=', Timestamp.fromDate(end))
      );
      const snapshot = await getDocs(q);
      setSales(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchSales();
  }, [selectedDate]);

  const totalQuantitySold = sales.reduce((sum, s) => sum + s.quantity, 0);
  const totalRevenue = sales.reduce((sum, s) => sum + s.salePrice * s.quantity, 0);
  const totalCost = sales.reduce((sum, s) => sum + s.purchasePrice * s.quantity, 0);
  const totalProfit = totalRevenue - totalCost;

  // Форматируем цену с тенге
  const formatPrice = (value) => {
    return value.toLocaleString('ru-RU', { style: 'currency', currency: 'KZT', minimumFractionDigits: 0 });
  };

  // Добавим базовые стили
  const styles = {
    container: {
      maxWidth: 900,
      margin: '20px auto',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      backgroundColor: '#f9f9f9',
      padding: 20,
      borderRadius: 10,
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    },
    section: {
      marginBottom: 30,
      backgroundColor: '#fff',
      padding: 20,
      borderRadius: 8,
      boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
    },
    title: {
      marginBottom: 15,
      color: '#222',
      borderBottom: '2px solid #4caf50',
      paddingBottom: 5,
    },
    input: {
      padding: '8px 10px',
      marginRight: 10,
      borderRadius: 5,
      border: '1px solid #ccc',
      fontSize: 14,
      minWidth: 150,
    },
    select: {
      padding: '8px 10px',
      marginRight: 10,
      borderRadius: 5,
      border: '1px solid #ccc',
      fontSize: 14,
      minWidth: 160,
    },
    button: {
      backgroundColor: '#4caf50',
      color: '#fff',
      border: 'none',
      borderRadius: 5,
      padding: '8px 16px',
      fontSize: 14,
      cursor: 'pointer',
      transition: 'background-color 0.3s',
    },
    buttonDisabled: {
      backgroundColor: '#9e9e9e',
      cursor: 'not-allowed',
    },
    productItem: {
      padding: 10,
      borderBottom: '1px solid #eee',
    },
    saleInput: {
      width: 120,
      marginRight: 10,
      padding: '6px 8px',
      borderRadius: 5,
      border: '1px solid #ccc',
      fontSize: 14,
    },
    summary: {
      marginTop: 20,
      padding: 15,
      backgroundColor: '#e8f5e9',
      borderRadius: 8,
      border: '1px solid #4caf50',
      color: '#2e7d32',
    },
  };

  return (
    <div style={styles.container}>
      <section style={styles.section}>
        <h2 style={styles.title}>Категории</h2>
        <input
          style={styles.input}
          value={newCategoryName}
          onChange={e => setNewCategoryName(e.target.value)}
          placeholder="Новая категория"
        />
        <button style={styles.button} onClick={addCategory}>
          Добавить категорию
        </button>
        <ul>
          {categories.map(cat => (
            <li key={cat.id}>{cat.name}</li>
          ))}
        </ul>
      </section>

      <section style={styles.section}>
        <h2 style={styles.title}>Добавить товар</h2>
        <input
          style={styles.input}
          value={newProductName}
          onChange={e => setNewProductName(e.target.value)}
          placeholder="Название товара"
        />
        <input
          style={styles.input}
          type="number"
          min="1"
          value={newProductQuantity}
          onChange={e => setNewProductQuantity(e.target.value)}
          placeholder="Количество"
        />
        <select
          style={styles.select}
          value={newProductCategory}
          onChange={e => setNewProductCategory(e.target.value)}
        >
          <option value="">Выберите категорию</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
        <input
          style={styles.input}
          type="number"
          min="0"
          step="0.01"
          value={newPurchasePrice}
          onChange={e => setNewPurchasePrice(e.target.value)}
          placeholder="Цена закупки (₸)"
        />
        <input
          style={styles.input}
          type="number"
          min="0"
          step="0.01"
          value={newSalePrice}
          onChange={e => setNewSalePrice(e.target.value)}
          placeholder="Цена продажи (₸)"
        />
        <button style={styles.button} onClick={addProduct}>
          Добавить товар
        </button>
      </section>

      <section style={styles.section}>
        <h2 style={styles.title}>Товары</h2>
        {products.length === 0 && <p>Товары отсутствуют</p>}
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          {products.map(prod => (
            <li key={prod.id} style={styles.productItem}>
              <b>{prod.name}</b> — {prod.quantity} шт — категория: {prod.category} <br />
              Закупка: {formatPrice(prod.purchasePrice * prod.quantity)} |{' '}
              Продажа: {formatPrice(prod.salePrice * prod.quantity)} |{' '}
              Прибыль: {formatPrice((prod.salePrice - prod.purchasePrice) * prod.quantity)}
              <br />
              <input
                id={`saleQty-${prod.id}`}
                style={styles.saleInput}
                type="number"
                min="1"
                max={prod.quantity}
                placeholder="Кол-во для продажи"
              />
              <button
                style={{
                  ...styles.button,
                  ...(prod.quantity === 0 ? styles.buttonDisabled : {}),
                }}
                onClick={() => {
                  const input = document.getElementById(`saleQty-${prod.id}`);
                  addSale(prod.id, input.value);
                  input.value = '';
                }}
                disabled={prod.quantity === 0}
              >
                Продать
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section style={styles.section}>
        <h2 style={styles.title}>Продажи по дате</h2>
        <input
          style={styles.input}
          type="date"
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
        />
        <ul>
          {sales.map(sale => (
            <li key={sale.id}>
              {sale.productName} — {sale.quantity} шт — {formatPrice(sale.salePrice * sale.quantity)}
            </li>
          ))}
        </ul>
        <div style={styles.summary}>
          <p>Всего продано: {totalQuantitySold} шт</p>
          <p>Общая выручка: {formatPrice(totalRevenue)}</p>
          <p>Общие затраты: {formatPrice(totalCost)}</p>
          <p>Общая прибыль: {formatPrice(totalProfit)}</p>
        </div>
      </section>
    </div>
  );
}

export default App;

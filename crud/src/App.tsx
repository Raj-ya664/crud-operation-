// src/App.tsx
import React, { useEffect, useState } from 'react';

function App() {
  const [items, setItems] = useState<{ id: number; name: string }[]>([]);
  const [newItem, setNewItem] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  // Fetch all items from backend
  useEffect(() => {
    fetch('http://localhost:5000/items')
      .then(res => res.json())
      .then(data => setItems(data));
  }, []);

  // Add new item
  const handleAdd = async () => {
    if (!newItem.trim()) return;
    const res = await fetch('http://localhost:5000/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newItem })
    });
    const item = await res.json();
    setItems([...items, item]);
    setNewItem('');
  };

  // Delete itemhttp://localhost:5173/
  const handleDelete = async (id: number) => {
    await fetch(`http://localhost:5000/items/${id}`, { method: 'DELETE' });
    setItems(items.filter(item => item.id !== id));
  };

  // Start editing an item
  const handleEdit = (item: { id: number; name: string }) => {
    setEditId(item.id);
    setEditValue(item.name);
  };

  // Update item
  const handleUpdate = async (id: number) => {
    if (!editValue.trim()) return;
    const res = await fetch(`http://localhost:5000/items/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editValue })
    });
    const updated = await res.json();
    setItems(items.map(item => item.id === id ? updated : item));
    setEditId(null);
    setEditValue('');
  };

  // Cancel editing
  const handleCancel = () => {
    setEditId(null);
    setEditValue('');
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', textAlign: 'center' }}>
      <h1>Items</h1>
      <input
        value={newItem}
        onChange={e => setNewItem(e.target.value)}
        placeholder="Add new item"
      />
      <button onClick={handleAdd} style={{ marginLeft: 8 }}>Add</button>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {items.map(item => (
          <li key={item.id} style={{ margin: '8px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {editId === item.id ? (
              <>
                <input
                  value={editValue}
                  onChange={e => setEditValue(e.target.value)}
                  style={{ marginRight: 8 }}
                />
                <button onClick={() => handleUpdate(item.id)} style={{ marginRight: 4 }}>Save</button>
                <button onClick={handleCancel}>Cancel</button>
              </>
            ) : (
              <>
                <span>{item.name}</span>
                <button onClick={() => handleEdit(item)} style={{ marginLeft: 8, marginRight: 4 }}>Edit</button>
                <button onClick={() => handleDelete(item.id)} style={{ marginLeft: 4 }}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
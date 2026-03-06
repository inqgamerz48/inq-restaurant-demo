'use client';
import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Save, LogOut, Plus, Edit2, Trash2 } from 'lucide-react';

type Tab = 'menu' | 'reservations' | 'testimonials' | 'hours';

export default function AdminDashboard() {
    const [token, setToken] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [activeTab, setActiveTab] = useState<Tab>('menu');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    const [menuItems, setMenuItems] = useState<any[]>([]);
    const [reservations, setReservations] = useState<any[]>([]);
    const [testimonials, setTestimonials] = useState<any[]>([]);
    const [hours, setHours] = useState<any[]>([]);
    
    const [showModal, setShowModal] = useState(false);
    const [editItem, setEditItem] = useState<any>(null);
    const [modalType, setModalType] = useState('');

    const API = '';

    const fetchData = async () => {
        setLoading(true);
        try {
            const [menuRes, resRes, testiRes, hoursRes] = await Promise.all([
                fetch('/api/menu'),
                fetch('/api/reservations'),
                fetch('/api/testimonials'),
                fetch('/api/hours')
            ]);
            setMenuItems(await menuRes.json());
            setReservations(await resRes.json());
            setTestimonials(await testiRes.json());
            setHours(await hoursRes.json());
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchReservations = async (authToken: string) => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/admin/reservations', {
                headers: { 'Authorization': `Bearer ${authToken}` }
            });
            if (!res.ok) throw new Error('Invalid Admin Token');
            const data = await res.json();
            setReservations(data);
            setIsAuthenticated(true);
            setToken(authToken);
            localStorage.setItem('adminToken', authToken);
            await fetchData();
        } catch (err: any) {
            setError(err.message);
            setIsAuthenticated(false);
            localStorage.removeItem('adminToken');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const savedToken = localStorage.getItem('adminToken');
        if (savedToken) fetchReservations(savedToken);
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        fetchReservations(token);
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        setIsAuthenticated(false);
        setToken('');
    };

    const updateStatus = async (id: number, status: string) => {
        try {
            const res = await fetch(`/api/reservations/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                setReservations(prev => prev.map(r => r.id === id ? { ...r, status } : r));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const openModal = (type: string, item: any = null) => {
        setModalType(type);
        setEditItem(item);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditItem(null);
        setModalType('');
    };

    const handleSave = async (e: React.FormEvent<any>) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const data = Object.fromEntries(new FormData(form));
        
        const endpoint = modalType;
        const method = editItem ? 'PUT' : 'POST';
        const url = editItem ? `/api/${endpoint}/${editItem.id}` : `/api/${endpoint}`;
        
        try {
            await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            closeModal();
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (type: string, id: number) => {
        if (!confirm('Delete this item?')) return;
        try {
            await fetch(`/api/${type}/${id}`, { method: 'DELETE' });
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-brand-bg text-brand-cream flex items-center justify-center font-sans tracking-wide">
                <form onSubmit={handleLogin} className="bg-brand-surface border border-brand-border p-10 w-full max-w-md shadow-2xl">
                    <h1 className="font-display text-4xl mb-2 text-brand-gold text-center">Ember & Ash</h1>
                    <p className="text-center text-brand-muted text-sm tracking-[0.2em] uppercase mb-8">Admin Portal</p>

                    {error && <div className="mb-4 text-brand-red text-sm text-center bg-brand-red/10 p-2 border border-brand-red/30">{error}</div>}

                    <div className="mb-6">
                        <label className="block text-xs uppercase tracking-widest text-brand-muted mb-2">Access Token</label>
                        <input
                            type="password"
                            value={token}
                            onChange={e => setToken(e.target.value)}
                            className="w-full bg-brand-bg border border-brand-border text-brand-cream p-3 focus:outline-none focus:border-brand-gold font-mono"
                            placeholder="Enter secure token..."
                            required
                        />
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-brand-gold text-brand-bg font-bold py-3 uppercase tracking-widest text-sm hover:bg-brand-gold2 transition-colors">
                        {loading ? 'Authenticating...' : 'Enter Console'}
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-bg text-brand-cream font-sans">
            <header className="bg-brand-surface border-b border-brand-border px-8 py-5 flex justify-between items-center sticky top-0 z-50">
                <div>
                    <h1 className="font-display text-2xl text-brand-gold m-0 leading-none">Ember & Ash</h1>
                    <span className="text-[0.65rem] uppercase tracking-[0.3em] text-brand-muted block mt-1">Management Console</span>
                </div>
                <button onClick={handleLogout} className="flex items-center gap-2 text-xs uppercase tracking-widest text-brand-muted hover:text-brand-red transition-colors">
                    <LogOut size={14} /> Disconnect
                </button>
            </header>

            <div className="tabs flex bg-brand-surface border-b border-brand-border">
                {(['menu', 'reservations', 'testimonials', 'hours'] as Tab[]).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-4 text-sm uppercase tracking-widest transition-colors ${
                            activeTab === tab 
                            ? 'text-brand-gold border-b-2 border-brand-gold' 
                            : 'text-brand-muted hover:text-brand-cream'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <main className="p-8 max-w-7xl mx-auto">
                {activeTab === 'menu' && (
                    <>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-light tracking-wide">Menu Items</h2>
                            <button onClick={() => openModal('menu')} className="flex items-center gap-2 bg-brand-gold text-brand-bg px-4 py-2 text-sm font-bold uppercase tracking-widest">
                                <Plus size={16} /> Add Item
                            </button>
                        </div>
                        <div className="grid gap-4">
                            {menuItems.map(item => (
                                <div key={item.id} className="bg-brand-surface border border-brand-border p-4 flex items-center gap-4">
                                    <img src={item.imageUrl} alt={item.name} className="w-16 h-12 object-cover rounded" />
                                    <div className="flex-1">
                                        <div className="font-medium">{item.name}</div>
                                        <div className="text-sm text-brand-muted">{item.category} · {item.price}</div>
                                    </div>
                                    <span className="px-2 py-1 bg-brand-gold/20 text-brand-gold text-xs">{item.tag}</span>
                                    <button onClick={() => openModal('menu', item)} className="p-2 text-brand-muted hover:text-brand-gold"><Edit2 size={16} /></button>
                                    <button onClick={() => handleDelete('menu', item.id)} className="p-2 text-brand-muted hover:text-brand-red"><Trash2 size={16} /></button>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {activeTab === 'reservations' && (
                    <>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-light tracking-wide">Reservations</h2>
                            <div className="text-sm text-brand-muted bg-brand-surface px-4 py-2 border border-brand-border">
                                Pending: <span className="text-brand-gold font-bold">{reservations.filter(r => r.status === 'pending').length}</span>
                            </div>
                        </div>
                        <div className="bg-brand-surface border border-brand-border overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="border-b border-brand-border bg-brand-bg/50">
                                    <tr>
                                        <th className="py-3 px-4 text-xs uppercase tracking-widest text-brand-muted">Guest</th>
                                        <th className="py-3 px-4 text-xs uppercase tracking-widest text-brand-muted">Date</th>
                                        <th className="py-3 px-4 text-xs uppercase tracking-widest text-brand-muted">Time</th>
                                        <th className="py-3 px-4 text-xs uppercase tracking-widest text-brand-muted">Guests</th>
                                        <th className="py-3 px-4 text-xs uppercase tracking-widest text-brand-muted">Status</th>
                                        <th className="py-3 px-4 text-xs uppercase tracking-widest text-brand-muted text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reservations.map(res => (
                                        <tr key={res.id} className="border-b border-brand-border/50">
                                            <td className="py-3 px-4">{res.name}<br/><span className="text-xs text-brand-muted">{res.email}</span></td>
                                            <td className="py-3 px-4">{res.date}</td>
                                            <td className="py-3 px-4 text-brand-gold">{res.time}</td>
                                            <td className="py-3 px-4 text-center">{res.guests}</td>
                                            <td className="py-3 px-4">
                                                <span className={`px-2 py-1 rounded-full text-xs ${
                                                    res.status === 'confirmed' ? 'bg-green-900/20 text-green-400' :
                                                    res.status === 'cancelled' ? 'bg-red-900/20 text-brand-red' :
                                                    'bg-yellow-900/20 text-brand-gold'
                                                }`}>{res.status}</span>
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                <button onClick={() => updateStatus(res.id, 'confirmed')} className="p-1 text-brand-muted hover:text-green-400"><CheckCircle size={18} /></button>
                                                <button onClick={() => updateStatus(res.id, 'cancelled')} className="p-1 text-brand-muted hover:text-brand-red ml-2"><XCircle size={18} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                {activeTab === 'testimonials' && (
                    <>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-light tracking-wide">Testimonials</h2>
                            <button onClick={() => openModal('testimonials')} className="flex items-center gap-2 bg-brand-gold text-brand-bg px-4 py-2 text-sm font-bold uppercase tracking-widest">
                                <Plus size={16} /> Add Testimonial
                            </button>
                        </div>
                        <div className="grid gap-4">
                            {testimonials.map(t => (
                                <div key={t.id} className="bg-brand-surface border border-brand-border p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <div className="font-medium">{t.name}</div>
                                            <div className="text-xs text-brand-muted">{t.role}</div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-1 rounded-full text-xs ${t.active ? 'bg-green-900/20 text-green-400' : 'bg-gray-800 text-gray-400'}`}>
                                                {t.active ? 'Active' : 'Inactive'}
                                            </span>
                                            <button onClick={() => openModal('testimonials', t)} className="p-1 text-brand-muted hover:text-brand-gold"><Edit2 size={16} /></button>
                                            <button onClick={() => handleDelete('testimonials', t.id)} className="p-1 text-brand-muted hover:text-brand-red"><Trash2 size={16} /></button>
                                        </div>
                                    </div>
                                    <div className="text-sm text-brand-muted">{'★'.repeat(t.rating)}</div>
                                    <div className="mt-2 text-sm">{t.text}</div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {activeTab === 'hours' && (
                    <>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-light tracking-wide">Opening Hours</h2>
                            <button onClick={() => openModal('hours')} className="flex items-center gap-2 bg-brand-gold text-brand-bg px-4 py-2 text-sm font-bold uppercase tracking-widest">
                                <Plus size={16} /> Add Hours
                            </button>
                        </div>
                        <div className="grid gap-4">
                            {hours.map(h => (
                                <div key={h.id} className="bg-brand-surface border border-brand-border p-4 flex items-center justify-between">
                                    <div>
                                        <div className="font-medium">{h.dayRange}</div>
                                        <div className="text-brand-gold">{h.time}</div>
                                        <div className="text-xs text-brand-muted">{h.note}</div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => openModal('hours', h)} className="p-2 text-brand-muted hover:text-brand-gold"><Edit2 size={16} /></button>
                                        <button onClick={() => handleDelete('hours', h.id)} className="p-2 text-brand-muted hover:text-brand-red"><Trash2 size={16} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </main>

            {showModal && (
                <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={closeModal}>
                    <div className="bg-brand-surface border border-brand-border p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <h3 className="text-xl font-light mb-4 text-brand-gold">
                            {editItem ? 'Edit' : 'Add'} {modalType}
                        </h3>
                        <form onSubmit={handleSave}>
                            {modalType === 'menu' && (
                                <>
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div><label className="block text-xs uppercase text-brand-muted mb-1">Name</label><input name="name" defaultValue={editItem?.name} className="w-full bg-brand-bg border border-brand-border p-2" required /></div>
                                        <div><label className="block text-xs uppercase text-brand-muted mb-1">Price</label><input name="price" defaultValue={editItem?.price} className="w-full bg-brand-bg border border-brand-border p-2" required /></div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div><label className="block text-xs uppercase text-brand-muted mb-1">Category</label>
                                            <select name="category" defaultValue={editItem?.category} className="w-full bg-brand-bg border border-brand-border p-2">
                                                <option>Starters</option><option>Mains</option><option>Desserts</option><option>Drinks</option>
                                            </select>
                                        </div>
                                        <div><label className="block text-xs uppercase text-brand-muted mb-1">Tag</label><input name="tag" defaultValue={editItem?.tag} className="w-full bg-brand-bg border border-brand-border p-2" /></div>
                                    </div>
                                    <div className="mb-4"><label className="block text-xs uppercase text-brand-muted mb-1">Description</label><textarea name="description" defaultValue={editItem?.description} className="w-full bg-brand-bg border border-brand-border p-2" rows={3} required /></div>
                                    <div className="mb-4"><label className="block text-xs uppercase text-brand-muted mb-1">Image URL</label><input name="image_url" defaultValue={editItem?.imageUrl} className="w-full bg-brand-bg border border-brand-border p-2" /></div>
                                </>
                            )}
                            {modalType === 'testimonials' && (
                                <>
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div><label className="block text-xs uppercase text-brand-muted mb-1">Name</label><input name="name" defaultValue={editItem?.name} className="w-full bg-brand-bg border border-brand-border p-2" required /></div>
                                        <div><label className="block text-xs uppercase text-brand-muted mb-1">Role</label><input name="role" defaultValue={editItem?.role} className="w-full bg-brand-bg border border-brand-border p-2" /></div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div><label className="block text-xs uppercase text-brand-muted mb-1">Rating</label><input name="rating" type="number" min="1" max="5" defaultValue={editItem?.rating || 5} className="w-full bg-brand-bg border border-brand-border p-2" /></div>
                                        <div><label className="block text-xs uppercase text-brand-muted mb-1">Initials</label><input name="initials" defaultValue={editItem?.initials} className="w-full bg-brand-bg border border-brand-border p-2" /></div>
                                    </div>
                                    <div className="mb-4"><label className="block text-xs uppercase text-brand-muted mb-1">Text</label><textarea name="text" defaultValue={editItem?.text} className="w-full bg-brand-bg border border-brand-border p-2" rows={3} required /></div>
                                    {editItem && (
                                        <div className="mb-4"><label className="block text-xs uppercase text-brand-muted mb-1">Active</label>
                                            <select name="active" defaultValue={editItem?.active} className="w-full bg-brand-bg border border-brand-border p-2">
                                                <option value={1}>Yes</option><option value={0}>No</option>
                                            </select>
                                        </div>
                                    )}
                                </>
                            )}
                            {modalType === 'hours' && (
                                <>
                                    <div className="mb-4"><label className="block text-xs uppercase text-brand-muted mb-1">Day Range</label><input name="day_range" defaultValue={editItem?.dayRange} className="w-full bg-brand-bg border border-brand-border p-2" required /></div>
                                    <div className="mb-4"><label className="block text-xs uppercase text-brand-muted mb-1">Time</label><input name="time" defaultValue={editItem?.time} className="w-full bg-brand-bg border border-brand-border p-2" required /></div>
                                    <div className="mb-4"><label className="block text-xs uppercase text-brand-muted mb-1">Note</label><input name="note" defaultValue={editItem?.note} className="w-full bg-brand-bg border border-brand-border p-2" /></div>
                                </>
                            )}
                            <div className="flex gap-4 mt-6">
                                <button type="button" onClick={closeModal} className="flex-1 border border-brand-border py-2 text-brand-muted hover:text-brand-cream">Cancel</button>
                                <button type="submit" className="flex-1 bg-brand-gold text-brand-bg py-2 font-bold">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

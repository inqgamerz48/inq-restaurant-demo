'use client';
import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Save, LogOut } from 'lucide-react';

export default function AdminDashboard() {
    const [token, setToken] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [reservations, setReservations] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchReservations = async (authToken: string) => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/admin/reservations', {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            if (!res.ok) throw new Error('Invalid Admin Token');
            const data = await res.json();
            setReservations(data);
            setIsAuthenticated(true);
            setToken(authToken);
            // Save temp to localStorage
            localStorage.setItem('adminToken', authToken);
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

    const updateStatus = async (id: number, status: string) => {
        try {
            const res = await fetch('/api/admin/reservations', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ id, status })
            });
            if (res.ok) {
                setReservations(prev => prev.map(r => r.id === id ? { ...r, status } : r));
            } else {
                alert('Failed to update status');
            }
        } catch (err) {
            alert('Error updating status');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        setIsAuthenticated(false);
        setToken('');
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

            <main className="p-8 max-w-7xl mx-auto">
                <div className="flex justify-between items-end mb-8">
                    <h2 className="text-2xl font-light tracking-wide">Reservation Requests</h2>
                    <div className="text-sm text-brand-muted bg-brand-surface px-4 py-2 border border-brand-border">
                        Total Pending: <span className="text-brand-gold font-bold ml-1">{reservations.filter(r => r.status === 'pending').length}</span>
                    </div>
                </div>

                <div className="bg-brand-surface border border-brand-border overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-brand-border bg-brand-bg/50">
                                <th className="py-4 px-6 text-xs uppercase tracking-widest text-brand-muted font-normal">Guest</th>
                                <th className="py-4 px-6 text-xs uppercase tracking-widest text-brand-muted font-normal">Contact</th>
                                <th className="py-4 px-6 text-xs uppercase tracking-widest text-brand-muted font-normal">Date & Time</th>
                                <th className="py-4 px-6 text-xs uppercase tracking-widest text-brand-muted font-normal">Party</th>
                                <th className="py-4 px-6 text-xs uppercase tracking-widest text-brand-muted font-normal">Requests</th>
                                <th className="py-4 px-6 text-xs uppercase tracking-widest text-brand-muted font-normal">Status</th>
                                <th className="py-4 px-6 text-xs uppercase tracking-widest text-brand-muted font-normal text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reservations.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-12 text-center text-brand-muted italic">No reservations in the system yet.</td>
                                </tr>
                            ) : (
                                reservations.map((res: any) => (
                                    <tr key={res.id} className="border-b border-brand-border/50 hover:bg-brand-bg/30 transition-colors">
                                        <td className="py-4 px-6 font-medium text-sm">{res.name}</td>
                                        <td className="py-4 px-6 text-sm text-brand-muted">{res.email}</td>
                                        <td className="py-4 px-6 text-sm">
                                            <div className="flex flex-col gap-1">
                                                <span>{res.date}</span>
                                                <span className="text-brand-gold">{res.time}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-center">{res.guests}</td>
                                        <td className="py-4 px-6 text-xs text-brand-muted max-w-[200px] truncate" title={res.specialRequests}>
                                            {res.specialRequests || '—'}
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border
                        ${res.status === 'confirmed' ? 'bg-green-900/20 text-green-400 border-green-900/50' :
                                                    res.status === 'rejected' ? 'bg-red-900/20 text-brand-red border-brand-red/30' :
                                                        'bg-yellow-900/20 text-brand-gold border-brand-gold/30'}`}>
                                                {res.status === 'confirmed' && <CheckCircle size={12} />}
                                                {res.status === 'rejected' && <XCircle size={12} />}
                                                {res.status === 'pending' && <Clock size={12} />}
                                                {res.status.charAt(0).toUpperCase() + res.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-right space-x-2">
                                            <button
                                                onClick={() => updateStatus(res.id, 'confirmed')}
                                                disabled={res.status === 'confirmed'}
                                                className="p-2 border border-brand-border text-brand-muted hover:text-green-400 hover:border-green-400/50 transition-colors disabled:opacity-30"
                                                title="Confirm"
                                            >
                                                <CheckCircle size={16} />
                                            </button>
                                            <button
                                                onClick={() => updateStatus(res.id, 'rejected')}
                                                disabled={res.status === 'rejected'}
                                                className="p-2 border border-brand-border text-brand-muted hover:text-brand-red hover:border-brand-red/50 transition-colors disabled:opacity-30"
                                                title="Reject"
                                            >
                                                <XCircle size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}

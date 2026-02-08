import React, { useEffect, useState } from 'react';
import { User, Charge, UserRole } from '../types'; // Adjust path as needed
import { dataService } from '../services/dataService';

interface BillingViewProps {
    user: User; // Assuming we pass the full user object
}

const BillingView: React.FC<BillingViewProps> = ({ user }) => {
    const [charges, setCharges] = useState<Charge[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'PAID' | 'OVERDUE'>('ALL');

    useEffect(() => {
        loadCharges();
    }, [user]);

    const loadCharges = async () => {
        setLoading(true);
        try {
            // If user is resident, filter by their unit. If Syndic/Admin, fetch all (or all for the client)
            const unitFilter = user.role === UserRole.MORADOR ? user.unit : undefined;
            const data = await dataService.getCharges(user.clientId, unitFilter);
            setCharges(data);
        } catch (error) {
            console.error("Failed to load charges", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredCharges = charges.filter(charge => {
        if (filter === 'ALL') return true;
        if (filter === 'PENDING') return charge.status === 'PENDING';
        if (filter === 'PAID') return charge.status === 'CONFIRMED' || charge.status === 'RECEIVED';
        if (filter === 'OVERDUE') return charge.status === 'OVERDUE';
        return true;
    });

    const formatCurrency = (cents: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'CONFIRMED':
            case 'RECEIVED': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';
            case 'OVERDUE': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
            default: return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'PENDING': return 'Pendente';
            case 'CONFIRMED': return 'Pago';
            case 'RECEIVED': return 'Recebido';
            case 'OVERDUE': return 'Vencido';
            case 'REFUNDED': return 'Estornado';
            case 'CANCELED': return 'Cancelado';
            default: return status;
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-brand-1 dark:text-white tracking-tight">Financeiro</h1>
                    <p className="text-slate-500 dark:text-brand-4 font-medium">Boleto Digital e Prestação de Contas</p>
                </div>

                {/* Actions Toolbar */}
                <div className="flex gap-2 bg-white dark:bg-white/5 p-1 rounded-xl shadow-sm border border-slate-200 dark:border-white/10">
                    <button
                        onClick={() => setFilter('ALL')}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filter === 'ALL' ? 'bg-brand-1 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5'}`}
                    >
                        Todos
                    </button>
                    <button
                        onClick={() => setFilter('PENDING')}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filter === 'PENDING' ? 'bg-yellow-500 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5'}`}
                    >
                        Pendentes
                    </button>
                    <button
                        onClick={() => setFilter('PAID')}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filter === 'PAID' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5'}`}
                    >
                        Pagos
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/10 shadow-sm overflow-hidden min-h-[400px]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-64 gap-4 text-brand-3">
                        <i className="fa-solid fa-circle-notch fa-spin text-3xl"></i>
                        <p className="text-sm font-medium animate-pulse">Carregando cobranças...</p>
                    </div>
                ) : filteredCharges.length > 0 ? (
                    <div className="divide-y divide-slate-50 dark:divide-white/10">
                        {filteredCharges.map(charge => (
                            <div key={charge.id} className="p-6 hover:bg-neutral-surface dark:hover:bg-white/5 transition-colors group flex flex-col md:flex-row items-center gap-6">
                                {/* Icon / Date */}
                                <div className="flex flex-col items-center shrink-0 w-16">
                                    <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">VCTO</div>
                                    <div className="text-xl font-bold text-brand-1 dark:text-white">
                                        {new Date(charge.dueDate).getDate()}
                                    </div>
                                    <div className="text-xs font-bold text-brand-3 uppercase">
                                        {new Date(charge.dueDate).toLocaleString('default', { month: 'short' }).replace('.', '')}
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="flex-1 text-center md:text-left">
                                    <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${getStatusColor(charge.status)}`}>
                                            {getStatusLabel(charge.status)}
                                        </span>
                                        {/* Only show unit name if admin/syndic view */}
                                        {(user.role !== UserRole.MORADOR) && (
                                            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-white/10 px-2 py-0.5 rounded">
                                                {charge.unitName}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="font-bold text-lg text-brand-1 dark:text-slate-100">{charge.description}</h3>
                                    <p className="text-xs text-slate-400 mt-1">
                                        Emissão: {new Date(charge.createdAt).toLocaleDateString('pt-BR')}  •  Método: {charge.paymentMethod || 'Não definido'}
                                    </p>
                                </div>

                                {/* Value & Action */}
                                <div className="flex flex-col items-center md:items-end gap-3 shrink-0">
                                    <div className="text-right">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Valor</p>
                                        <p className="text-2xl font-black text-brand-1 dark:text-brand-3">{formatCurrency(charge.value)}</p>
                                    </div>

                                    {charge.status === 'PENDING' && (
                                        <div className="flex gap-2">
                                            <button className="px-4 py-2 bg-brand-1 text-white rounded-xl text-xs font-bold hover:bg-brand-2 transition-all shadow-lg shadow-brand-1/20 flex items-center gap-2">
                                                <i className="fa-solid fa-barcode"></i>
                                                Copiar Código
                                            </button>
                                            <button className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-xs font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2">
                                                <i className="fa-brands fa-pix"></i>
                                                Pagar com Pix
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                        <div className="w-16 h-16 bg-slate-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-4 text-slate-300">
                            <i className="fa-solid fa-file-invoice-dollar text-2xl"></i>
                        </div>
                        <p className="font-medium">Nenhuma cobrança encontrada com este filtro.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BillingView;

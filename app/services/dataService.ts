import { supabase } from '../lib/supabase';
import { Charge, PaymentStatus } from '../types';
import { MOCK_CLIENTS } from '../constants'; // Fallback

// Placeholder for Mock Charges until we fetch from DB
const MOCK_CHARGES: Charge[] = [
    {
        id: 'c1',
        clientId: 'client-1',
        unitId: '101A',
        unitName: 'Unidade 101A',
        description: 'Taxa Condominial - Fevereiro/2026',
        value: 55000,
        dueDate: new Date('2026-02-15'),
        status: 'PENDING',
        paymentMethod: 'BOLETO',
        createdAt: new Date('2026-02-01'),
        updatedAt: new Date('2026-02-01'),
        createdBy: 'admin'
    },
    {
        id: 'c2',
        clientId: 'client-1',
        unitId: '101A',
        unitName: 'Unidade 101A',
        description: 'Reserva Salão de Festas',
        value: 15000,
        dueDate: new Date('2026-02-20'),
        status: 'PENDING',
        paymentMethod: 'PIX',
        createdAt: new Date('2026-02-05'),
        updatedAt: new Date('2026-02-05'),
        createdBy: 'admin'
    },
    {
        id: 'c3',
        clientId: 'client-1',
        unitId: '101A',
        unitName: 'Unidade 101A',
        description: 'Taxa Condominial - Janeiro/2026',
        value: 55000,
        dueDate: new Date('2026-01-15'),
        status: 'CONFIRMED',
        paymentMethod: 'BOLETO',
        paidAt: new Date('2026-01-14'),
        paidValue: 55000,
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-14'),
        createdBy: 'admin'
    }
];

export const dataService = {
    // FINANCIAL / BILLING
    async getCharges(clientId: string, unitId?: string): Promise<Charge[]> {
        // TODO: Replace with Supabase fetch
        // const { data, error } = await supabase.from('charges').select('*').eq('client_id', clientId);

        // Returning Mock data for now
        let charges = MOCK_CHARGES.filter(c => c.clientId === clientId);
        if (unitId) {
            charges = charges.filter(c => c.unitId === unitId);
        }
        return new Promise(resolve => setTimeout(() => resolve(charges), 800)); // Simulate network delay
    },

    async createCharge(charge: Omit<Charge, 'id' | 'createdAt' | 'updatedAt'>): Promise<Charge> {
        // TODO: Supabase insert
        const newCharge: Charge = {
            ...charge,
            id: Math.random().toString(36).substring(7),
            createdAt: new Date(),
            updatedAt: new Date()
        };
        MOCK_CHARGES.push(newCharge); // Update local mock
        return new Promise(resolve => setTimeout(() => resolve(newCharge), 1000));
    }
};

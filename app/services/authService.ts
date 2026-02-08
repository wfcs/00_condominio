import { supabase } from '../lib/supabase';
import { User } from '../types';

export const authService = {
    async signIn(email: string, password: string) {
        return await supabase.auth.signInWithPassword({ email, password });
    },

    async signOut() {
        return await supabase.auth.signOut();
    },

    async getCurrentUser() {
        const { data: { user } } = await supabase.auth.getUser();
        return user;
    },

    // Helper to map Supabase User to our App User type if needed
    mapUser(supabaseUser: any): User | null {
        if (!supabaseUser) return null;
        return {
            id: supabaseUser.id,
            name: supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || 'User',
            email: supabaseUser.email || '',
            unit: supabaseUser.user_metadata?.unit || 'N/A',
            role: supabaseUser.user_metadata?.role || 'Morador',
            clientId: supabaseUser.user_metadata?.clientId || 'client-1',
        };
    }
};


export enum UserRole {
  MORADOR = 'Morador',
  SINDICO = 'Síndico',
  PORTARIA = 'Portaria',
  MANUTENCAO = 'Manutenção'
}

export interface CondoClient {
  id: string; // id_cliente incremental ou uuid
  name: string; // NomeCliente
}

export interface User {
  id: string; // id_usuario
  name: string;
  email: string;
  unit: string;
  role: UserRole;
  clientId: string; // fk_id_cliente
}

export interface Notification {
  id: string;
  unitId: string;
  clientId: string;
  type: 'entrega' | 'visitante';
  description: string;
  timestamp: Date;
  photoUrl?: string;
  status: 'pendente' | 'recebido';
}

export interface Poll {
  id: string;
  clientId: string;
  title: string;
  description: string;
  options: { id: string; text: string; votes: number }[];
  votedUnits: string[];
  endDate: Date;
  active: boolean;
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  date: Date;
}

export interface Announcement {
  id: string;
  clientId: string;
  title: string;
  content: string;
  category: 'Assembleia' | 'Comunicado' | 'Evento' | 'Brechó' | 'Social';
  author: string;
  authorId: string;
  date: Date;
  likes: string[];
  comments: Comment[];
  attachments?: string[];
}

export interface OperationalTask {
  id: string;
  clientId: string;
  type: 'Compra' | 'Manutenção';
  priority: 'Baixa' | 'Média' | 'Alta' | 'Crítica';
  description: string;
  status: 'Aberto' | 'Em Andamento' | 'Resolvido';
  assignedTo?: string;
  createdAt: Date;
}

// ============================================
// DOCUMENT MANAGEMENT TYPES
// ============================================

export type DocumentCategory =
  | 'Ata de Assembleia'
  | 'Balancete'
  | 'Contrato'
  | 'Regulamento'
  | 'Comprovante'
  | 'Outros';

export interface Document {
  id: string;
  clientId: string;
  title: string;
  category: DocumentCategory;
  description?: string;
  fileUrl: string;
  fileName: string;
  fileSize: number; // em bytes
  uploadedBy: string; // userId do síndico
  uploadedByName: string;
  uploadedAt: Date;
  tags?: string[];
}

// ============================================
// BILLING TYPES (Asaas Integration)
// ============================================

export type PaymentStatus =
  | 'PENDING'      // Aguardando pagamento
  | 'CONFIRMED'    // Pago
  | 'RECEIVED'     // Confirmado pelo Asaas
  | 'OVERDUE'      // Vencido
  | 'REFUNDED'     // Estornado
  | 'CANCELED';    // Cancelado

export type PaymentMethod =
  | 'PIX'
  | 'BOLETO'
  | 'CREDIT_CARD'
  | 'UNDEFINED';

export interface Charge {
  id: string;
  clientId: string;
  unitId: string; // Unidade que deve pagar
  unitName: string;
  description: string;
  value: number; // Valor em centavos (ex: 50000 = R$ 500,00)
  dueDate: Date;
  status: PaymentStatus;
  paymentMethod?: PaymentMethod;
  asaasChargeId?: string; // ID da cobrança no Asaas
  asaasPaymentUrl?: string; // URL para pagamento
  boletoUrl?: string;
  pixQrCode?: string;
  pixCopyPaste?: string;
  paidAt?: Date;
  paidValue?: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UnitBillingSummary {
  unitId: string;
  unitName: string;
  totalCharges: number;
  paidCharges: number;
  pendingCharges: number;
  overdueCharges: number;
  totalValue: number;
  paidValue: number;
  pendingValue: number;
}


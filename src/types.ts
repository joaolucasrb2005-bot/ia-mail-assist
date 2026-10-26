export type EmailCategory =
  | 'Atendimento'
  | 'Vendas'
  | 'Suporte Técnico'
  | 'Pedido'
  | 'Dúvidas Gerais';

export type ReviewStatus = 'Aguardando revisão' | 'Revisado';

export interface AIResponseData {
  categoriaIdentificada: string;
  resumo: string;
  intencaoPrincipal: string;
  respostaSugerida: string;
  informacoesFaltantes: string[];
  notasParaRevisor: string;
  tomUtilizado: string;
}

export interface EmailRecord {
  id: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  content: string;
  category: EmailCategory;
  timestamp: string;
  aiResponse: AIResponseData;
  editedResponse?: string;
  status: ReviewStatus;
}

export interface QuickExample {
  title: string;
  badge: string;
  category: EmailCategory;
  senderName: string;
  senderEmail: string;
  subject: string;
  content: string;
}

export interface CompanySettings {
  companyName: string;
  departmentName: string;
  agentName: string;
}

export interface SessionMetrics {
  total: number;
  reviewed: number;
  pending: number;
  approvalRate: number;
  topCategory: string;
}

export type UserRole = 'admin' | 'editor' | 'viewer';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt?: any;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  duration: number; // in hours
  level: 'Básico' | 'Intermedio' | 'Avanzado';
  price: number;
  imageUrl: string;
  status: 'Activo' | 'Inactivo';
  materials: string[]; // strings referencing Book IDs or file references
}

export interface Book {
  id: string;
  title: string;
  author: string;
  category: string; // e.g. "ISO 9001", "ISO 27001", "Coaching", "Excelencia"
  year: number;
  coverUrl: string;
  pdfUrl: string;
  downloadsCount: number;
}

export interface Visit {
  id: string;
  clientName: string;
  company: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  address: string;
  status: 'pending' | 'completed' | 'cancelled';
  notes: string;
  createdAt?: any;
}

export interface Tutorial {
  id: string;
  studentName: string;
  email: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  duration: number; // in minutes
  platform: 'Zoom' | 'Meet' | 'Teams';
  link: string;
  topic: string;
  subtype?: 'Técnica' | 'Coaching' | 'Psicopedagogía';
  status: 'pending' | 'confirmed' | 'cancelled';
  sendInvitation: boolean;
  createdAt?: any;
}

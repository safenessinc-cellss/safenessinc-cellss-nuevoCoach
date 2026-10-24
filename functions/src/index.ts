import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import { defineSecret } from 'firebase-functions/params';
import { onRequest } from 'firebase-functions/v2/https';
import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { createHttpApp } from './httpApp';

initializeApp();
const db = getFirestore();
const geminiApiKey = defineSecret('GEMINI_API_KEY');

function escapeHtml(value: unknown): string {
  return String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character] || character);
}

export const notifyNewConsultation = onDocumentCreated(
  { document: 'consultations/{consultationId}', region: 'us-central1', maxInstances: 5 },
  async event => {
    const data = event.data?.data();
    if (!data) return;
    const name = escapeHtml(data.name);
    const email = escapeHtml(data.email);
    const topic = escapeHtml(data.topic);
    const date = escapeHtml(data.date);
    const company = escapeHtml(data.company || 'No indicada');
    const mail = db.collection('mail');
    const writes = [];
    if (typeof data.email === 'string' && data.email.includes('@')) {
      writes.push(mail.add({
        to: data.email,
        message: {
          subject: 'Recibimos tu solicitud de consultoría',
          html: `<p>Hola ${name},</p><p>Hemos recibido tu solicitud de consultoría.</p><p><strong>Fecha solicitada:</strong> ${date}</p><p><strong>Tema:</strong> ${topic}</p><p>El equipo confirmará la disponibilidad por separado.</p>`,
        },
      }));
    }
    writes.push(mail.add({
      to: 'safeness.c.a@gmail.com',
      message: {
        subject: 'Nueva solicitud de consultoría',
        html: `<p>Nueva solicitud de ${name} (${email}).</p><p><strong>Empresa:</strong> ${company}</p><p><strong>Fecha:</strong> ${date}</p><p><strong>Tema:</strong> ${topic}</p><p><strong>ID:</strong> ${escapeHtml(event.params.consultationId)}</p>`,
      },
    }));
    await Promise.all(writes);
  },
);


export const api = onRequest(
  { region: 'us-central1', secrets: [geminiApiKey], maxInstances: 10, timeoutSeconds: 60 },
  createHttpApp({ db, auth: getAuth(), getGeminiApiKey: () => geminiApiKey.value() }),
);

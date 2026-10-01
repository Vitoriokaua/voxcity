import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const enviarCodigoRecuperacao = async (email: string, nome: string, codigo: string) => {
  await resend.emails.send({
    from: 'VozCity <naoresponda@vozcity.com.br>',
    to: email,
    subject: 'Seu código de recuperação de senha - VozCity',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #dc2626;">VozCity</h2>
        <p>Olá, ${nome}!</p>
        <p>Você solicitou a recuperação da sua senha. Use o código abaixo para continuar:</p>
        <div style="background: #18181b; color: #fff; font-size: 28px; font-weight: bold; letter-spacing: 6px; text-align: center; padding: 16px; border-radius: 12px; margin: 24px 0;">
          ${codigo}
        </div>
        <p>Esse código expira em 15 minutos.</p>
        <p style="color: #71717a; font-size: 12px;">Se você não solicitou isso, pode ignorar este e-mail.</p>
      </div>
    `,
  });
};
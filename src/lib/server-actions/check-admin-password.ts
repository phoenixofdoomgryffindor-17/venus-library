'use server';

export async function checkAdminPassword(password: string) {
  const secret = process.env.ADMIN_SECRET_PASSWORD;
  
  if (!secret) {
    console.error('ADMIN_SECRET_PASSWORD is not set in .env file');
    return false;
  }

  return password === secret;
}

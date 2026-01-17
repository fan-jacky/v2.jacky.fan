/**
 * @deprecated This function is no longer used. Contact form now verifies reCAPTCHA directly.
 * Keeping for backward compatibility only.
 */
export default async function verifyCaptcha(token: string): Promise<boolean> {
    try {
        const response = await fetch('/api/captcha', {
            cache: 'no-store',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token }),
        });
        return response.ok;
    } catch (error) {
        console.error('reCAPTCHA verification failed:', error);
        return false;
    }
}
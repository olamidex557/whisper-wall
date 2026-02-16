// Generate anonymous fingerprint without collecting personal data
// Uses browser characteristics to create a hash, not tracking identity

export async function generateFingerprint(): Promise<string> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (ctx) {
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('fingerprint', 2, 2);
  }
  
  const components = [
    navigator.userAgent,
    navigator.language,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
    canvas.toDataURL(),
    navigator.hardwareConcurrency || 0,
  ];
  
  const str = components.join('|');
  
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

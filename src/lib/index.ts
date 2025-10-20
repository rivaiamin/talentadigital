// place files you want to import through the `$lib` alias in this folder.

export function formatCurrencyIDR(amount: number): string {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
}

export function formatDateID(date: Date | string | number, options?: Intl.DateTimeFormatOptions): string {
    const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
    return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeZone: 'Asia/Jakarta', ...options }).format(d);
}

export function formatNumberID(value: number, options?: Intl.NumberFormatOptions): string {
    return new Intl.NumberFormat('id-ID', { maximumFractionDigits: 2, ...options }).format(value);
}

export function generateUsername(fullName: string): string {
    // Convert to lowercase, remove spaces and special chars, keep only alphanumeric
    let base = fullName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '')
        .substring(0, 20); // Limit length
    
    // Add random suffix if too short
    if (base.length < 3) {
        base += Math.random().toString(36).substring(2, 5);
    }
    
    return base;
}

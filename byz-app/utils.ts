export function formatMoney(amount, locale = 'en-US', currency = 'USD') {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2, // Ensures two decimal places
      maximumFractionDigits: 2, // Ensures two decimal places
    }).format(amount);
  }
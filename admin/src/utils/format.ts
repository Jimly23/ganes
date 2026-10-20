export const formatRupiah = (value: number | string): string => {
  if (value === undefined || value === null || value === '') return '';
  
  let number: number;
  
  if (typeof value === 'string') {
    // Handle raw API values that might have decimals (e.g., "400000.00")
    if (/^\d+(\.\d+)?$/.test(value)) {
      number = Number(value);
    } else {
      // Strip all non-numeric characters for formatted strings
      const numericString = value.replace(/[^0-9]/g, '');
      number = Number(numericString);
    }
  } else {
    number = value;
  }

  if (isNaN(number)) return '';
  
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
};

export const parseRupiah = (value: string): string => {
  if (!value) return '';
  // Only return numeric characters
  return value.replace(/[^0-9]/g, '');
};

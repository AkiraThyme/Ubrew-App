import { dbff, collection, query, getDocs } from './FirebaseConfig';

interface Receipt {
  orderNumber: string;
  deliveryAddress: string;
  description: string;
  total: number;
  paymentMethod: string;
  selectedProducts: { productName: string }[];
  timestamp: { seconds: number };
}

const fetchReceipts = async (filterType: string) => {
  const q = query(collection(dbff, 'receipts'));
  const querySnapshot = await getDocs(q);

  let productsCount: { [key: string]: number } = {};
  let maxTotal = 0; // To dynamically determine the y-axis range

  querySnapshot.forEach((doc) => {
    const data = doc.data() as Receipt;
    const date = new Date(data.timestamp.seconds * 1000);

    // Filter based on filterType
    if (filterType === 'month' && date.getMonth() !== new Date().getMonth()) return;
    if (filterType === 'day' && date.getDate() !== new Date().getDate()) return;
    if (filterType === 'year' && date.getFullYear() !== new Date().getFullYear()) return;

    data.selectedProducts.forEach((product) => {
      if (!productsCount[product.productName]) {
        productsCount[product.productName] = 0;
      }
      productsCount[product.productName] += 1;
    });

    let total = data.total;
    // Add charges based on payment method
    switch (data.paymentMethod) {
      case 'Cash':
        total += 38;
        break;
      case 'Debit Card/Credit Card':
        total += 15;
        break;
      case 'Gcash':
        total += 25;
        break;
    }

    if (total > maxTotal) {
      maxTotal = total;
    }
  });

  // Determine y-axis steps
  const step = 100;
  const yAxisLabels = Array.from({ length: Math.ceil(maxTotal / step) }, (_, i) => `${(i + 1) * step}₱`);

  return { productsCount, yAxisLabels };
};

export default fetchReceipts;

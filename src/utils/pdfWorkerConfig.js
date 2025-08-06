// PDF.js worker configuration for Vite
import { GlobalWorkerOptions } from 'pdfjs-dist';

// Set the worker source for different environments
if (typeof window !== 'undefined') {
  // Browser environment
  if (import.meta.env.DEV) {
    // Development mode
    GlobalWorkerOptions.workerSrc = '/node_modules/pdfjs-dist/build/pdf.worker.mjs';
  } else {
    // Production mode
    GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.mjs',
      import.meta.url
    ).toString();
  }
}

export { GlobalWorkerOptions };

// This is a simplified version that doesn't require the web-vitals package
const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    // Instead of using web-vitals, we just provide a message
    console.log('Web Vitals reporting is disabled. Install web-vitals package to enable.');
  }
};

export default reportWebVitals;

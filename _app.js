// pages/_app.js
import '../styles/globals.css'; // Importe seus estilos globais aqui

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
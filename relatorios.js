import { useState, useEffect } from 'react';
import withAuth from '../utils/authMiddleware';
import relatoriosService from '../services/relatoriosService';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'; // Importe os componentes do react-pdf

// Estilos para o PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCol: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
    padding: 10,
  },
  tableCell: {
    margin: 'auto',
    fontSize: 12,
  },
});

const Relatorios = () => {
  const [relatorios, setRelatorios] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await relatoriosService.getRelatorios();
        setRelatorios(data);
      } catch (error) {
        console.error('Erro ao buscar relatórios:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  },);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>Erro: {error.message}</div>;
  }

  // Componente para gerar o PDF
  const MyDocument = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Relatório de Composições</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Placa</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Setor</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Turno</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Motorista</Text>
            </View>
          </View>
          {relatorios.map((composicao) => (
            <View key={composicao.id} style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{composicao.placa}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{composicao.setor}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{composicao.turno}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{composicao.motorista}</Text>
              </View>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );

  return (
    <div>
      <h1>Relatórios</h1>
      <PDFDownloadLink document={<MyDocument />} fileName="relatorio.pdf">
        {({ loading }) => (loading? 'Gerando PDF...': 'Baixar PDF')}
      </PDFDownloadLink>
    </div>
  );
};

export default withAuth(Relatorios);
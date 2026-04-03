import { FlatList } from 'react-native';
import DespesaItem from './DespesaItem';

function DespesaLista({ despesas }) {
  return (
    <FlatList
      data={despesas}
      renderItem={({ item }) => <DespesaItem item={item} />}
      keyExtractor={(item) => item.id}
    />
  );
}

export default DespesaLista;
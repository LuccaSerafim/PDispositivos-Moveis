import {StyleSheet,View, Image, Text } from 'react-native';
import { useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MetaList from './components/MetaList';
import MetaInput from './components/MetaInput';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context'

export default function App() {

  const [metas, setMetas] = useState([]);

  useEffect(() => {
    async function carregarDados() {
      const dadosSalvos = await AsyncStorage.getItem('@listaMetas');
      if (dadosSalvos) {
        setMetas(JSON.parse(dadosSalvos));
      }
    }
    carregarDados();
  }, []);

  
  useEffect(() => {
    AsyncStorage.setItem('@listaMetas', JSON.stringify(metas));
  }, [metas]);
  
  function adicionarMetaHandler(inputMeta){
    const novaMeta = {id: Math.random().toString(), texto: inputMeta}
    setMetas([...metas, novaMeta])
  }


  function deletarMetaHandler(id){
    console.log(id);
    const novasMetas = metas.filter(meta => meta.id !== id);
    setMetas(novasMetas);
  }
    
  return (
    <SafeAreaProvider>
    <SafeAreaView style={styles.safeArea}>
    <View style={styles.topo}>
    <View style={styles.imageContainer}>
      <Image
        source={require('./assets/favicon.png')}
        style={styles.image}
        resizeMode="contain"
        />
      </View>
      <View>
        <Text style={styles.headerText}>Minhas Metas</Text>
      </View>
      </View>

    <View style={styles.mainContainer}>

        <MetaInput onAddMeta={adicionarMetaHandler} />
     
    <View style={styles.metaContainer}>
        <MetaList array={metas} 
        onDeleteItem={deletarMetaHandler}/>

      </View>
    </View>
  </SafeAreaView>
  </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    padding: 30,
    flex: 1,
    flexDirection: 'column',

  },
  metaContainer: {
    flex:15
  },

  safeArea: {
    flex: 1,
    backgroundColor: '#fff'
  },

  imageContainer: {
    alignItems: 'left',
    marginTop: 10,
    paddingLeft: 30,

  },

  image: {
    width: 50,
    height: 50,
  },

  topo: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  headerText: {
    fontSize: 20,
    marginLeft: 10,
  },

});
 
  

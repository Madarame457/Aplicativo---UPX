/* =========================================================
   EcoQuest — aplicativo (Expo / React Native)
   Este arquivo liga as telas. A navegação é simples:
   - tela "login"     → cadastro
   - tela "abas"      → Aprender, Eventos, Guia, Impacto, Criadores
   - tela "quiz"      → perguntas de uma fase, evento ou teste do guia
   - tela "resultado" → fim da lição
   - tela "semVidas"  → quando as vidas acabam
   ========================================================= */
import { useCallback, useEffect, useState } from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  useFonts,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold
} from '@expo-google-fonts/plus-jakarta-sans';

import { BarraAbas, Cabecalho } from './src/componentes';
import { COR } from './src/tema';
import { GUIDE_DATABASE, LEVELS } from './src/conteudo';
import { buscarEvento, buscarFase, eventoLiberado, faseLiberada } from './src/jogo';
import { useJogo } from './src/useJogo';

import TelaLogin from './src/telas/TelaLogin';
import TelaTrilha from './src/telas/TelaTrilha';
import TelaEventos from './src/telas/TelaEventos';
import TelaGuia from './src/telas/TelaGuia';
import TelaImpacto from './src/telas/TelaImpacto';
import TelaCriadores from './src/telas/TelaCriadores';
import TelaQuiz from './src/telas/TelaQuiz';
import TelaResultado from './src/telas/TelaResultado';
import TelaSemVidas from './src/telas/TelaSemVidas';

SplashScreen.preventAutoHideAsync().catch(() => {});

function Conteudo() {
  const insets = useSafeAreaInsets();
  const { save, agora, atualizar } = useJogo();
  const [tela, setTela] = useState('abas');
  const [aba, setAba] = useState('learn');
  const [licao, setLicao] = useState(null);
  const [resultado, setResultado] = useState(null);

  const irParaAba = useCallback((nova) => {
    setAba(nova);
    setTela('abas');
    setLicao(null);
  }, []);

  function iniciar(tipo, id, perguntas, voltarPara) {
    setAba(voltarPara);
    if (tipo !== 'guide' && save.vidas <= 0) {
      setTela('semVidas');
      return;
    }
    // A chave muda a cada início, para a tela de perguntas começar do zero
    setLicao({ tipo, id, perguntas, voltarPara, chave: Date.now() });
    setTela('quiz');
  }

  function abrirFase(id) {
    const i = LEVELS.findIndex((f) => f.id === id);
    if (i < 0 || !faseLiberada(save, i)) return;
    iniciar('level', id, buscarFase(id).questions, 'learn');
  }

  function abrirEvento(id) {
    const ev = buscarEvento(id);
    if (!ev || !eventoLiberado(save, ev)) return;
    iniciar('event', id, ev.questions, 'events');
  }

  function abrirTesteGuia(chave) {
    const g = GUIDE_DATABASE[chave];
    if (!g || !g.quiz) return;
    iniciar('guide', chave, g.quiz, 'guide');
  }

  // Botão "voltar" do Android
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (!save || !save.logado) return false;
      if (tela !== 'abas') {
        irParaAba(aba);
        return true;
      }
      if (aba !== 'learn') {
        setAba('learn');
        return true;
      }
      return false;  // sai do app
    });
    return () => sub.remove();
  }, [save, tela, aba, irParaAba]);

  // Volta para o início quando o jogador sai ou apaga o progresso
  useEffect(() => {
    if (save && !save.logado) {
      setTela('abas');
      setAba('learn');
      setLicao(null);
    }
  }, [save?.logado]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!save) return <View style={{ flex: 1, backgroundColor: COR.verdeEscuro }} />;

  if (!save.logado) {
    return (
      <>
        <StatusBar style="light" />
        <TelaLogin save={save} atualizar={atualizar} />
      </>
    );
  }

  let corpo;
  if (tela === 'quiz' && licao) {
    corpo = (
      <TelaQuiz
        key={licao.chave}
        licao={licao}
        save={save}
        atualizar={atualizar}
        onSair={() => irParaAba(licao.voltarPara)}
        onFim={(resumo, voltarPara) => { setResultado({ resumo, voltarPara }); setTela('resultado'); setLicao(null); }}
        onSemVidas={(voltarPara) => { setAba(voltarPara); setTela('semVidas'); setLicao(null); }}
      />
    );
  } else if (tela === 'resultado' && resultado) {
    corpo = <TelaResultado resumo={resultado.resumo} voltarPara={resultado.voltarPara} onVoltar={() => irParaAba(resultado.voltarPara)} />;
  } else if (tela === 'semVidas') {
    corpo = <TelaSemVidas save={save} agora={agora} onGuia={() => irParaAba('guide')} onVoltar={() => irParaAba(aba)} />;
  } else if (aba === 'events') {
    corpo = <TelaEventos save={save} onEvento={abrirEvento} />;
  } else if (aba === 'guide') {
    corpo = <TelaGuia onTeste={abrirTesteGuia} />;
  } else if (aba === 'impact') {
    corpo = <TelaImpacto save={save} atualizar={atualizar} />;
  } else if (aba === 'creators') {
    corpo = <TelaCriadores save={save} agora={agora} atualizar={atualizar} />;
  } else {
    corpo = <TelaTrilha save={save} agora={agora} onFase={abrirFase} onAba={irParaAba} />;
  }

  const mostrarAbas = tela === 'abas';

  return (
    <View style={{ flex: 1, backgroundColor: COR.fundo }}>
      <StatusBar style="light" />
      <View style={{ backgroundColor: COR.verdeEscuro, paddingTop: insets.top }}>
        <Cabecalho save={save} agora={agora} />
      </View>
      <View style={[estilos.corpo, { paddingLeft: insets.left, paddingRight: insets.right }]}>
        {corpo}
      </View>
      {mostrarAbas ? (
        <BarraAbas aba={aba} onTrocar={irParaAba} insetBaixo={insets.bottom} />
      ) : (
        <View style={{ height: tela === 'quiz' ? 0 : insets.bottom, backgroundColor: COR.fundo }} />
      )}
    </View>
  );
}

export default function App() {
  const [fontesProntas, erroFontes] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold
  });

  const pronto = fontesProntas || !!erroFontes;

  useEffect(() => {
    if (pronto) SplashScreen.hideAsync().catch(() => {});
  }, [pronto]);

  if (!pronto) return null;

  return (
    <SafeAreaProvider>
      <Conteudo />
    </SafeAreaProvider>
  );
}

const estilos = StyleSheet.create({
  corpo: { flex: 1 }
});

import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Botao, Confete, Texto } from '../componentes';
import { COR, FONTE } from '../tema';
import { lerCores } from '../cores';
import {
  XP_POR_ACERTO, concluirLicao, conferirResposta, ehMultiplaEscolha, perderVida, respostaCerta
} from '../jogo';
import { tocar, vibrar } from '../sons';

// Faz um elemento tremer quando muda o valor de "gatilho"
function useTremor(gatilho) {
  const x = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!gatilho) return;
    Animated.sequence([
      Animated.timing(x, { toValue: -8, duration: 60, useNativeDriver: true }),
      Animated.timing(x, { toValue: 8, duration: 60, useNativeDriver: true }),
      Animated.timing(x, { toValue: -5, duration: 60, useNativeDriver: true }),
      Animated.timing(x, { toValue: 0, duration: 60, useNativeDriver: true })
    ]).start();
  }, [gatilho, x]);
  return x;
}

function Opcao({ texto, letra, estado, onPress, desativada }) {
  const tremor = useTremor(estado === 'errada' ? 1 : 0);
  const visual = {
    normal: { fundo: '#fff', borda: COR.borda, texto: COR.textoMedio, peso: 'bold' },
    escolhida: { fundo: '#ecfdf5', borda: COR.verde, texto: '#022c22', peso: 'extrabold' },
    certa: { fundo: '#d1fae5', borda: '#10b981', texto: '#022c22', peso: 'extrabold' },
    errada: { fundo: '#fff1f2', borda: '#fb7185', texto: '#881337', peso: 'bold' },
    apagada: { fundo: '#fff', borda: COR.borda, texto: COR.textoFraco, peso: 'bold' }
  }[estado];

  return (
    <Animated.View style={{ transform: [{ translateX: tremor }] }}>
      <Pressable
        onPress={onPress}
        disabled={desativada}
        accessibilityRole="button"
        accessibilityState={{ selected: estado === 'escolhida' }}
        style={({ pressed }) => [
          estilos.opcao,
          { backgroundColor: visual.fundo, borderColor: visual.borda },
          pressed && !desativada && { transform: [{ translateY: 2 }], borderBottomWidth: 2 }
        ]}
      >
        <Texto peso={visual.peso} style={{ flex: 1, fontSize: 15, color: visual.texto }}>{texto}</Texto>
        <View style={[estilos.letra, { borderColor: visual.borda }]}>
          <Texto peso="bold" style={{ fontSize: 11, color: COR.textoFraco }}>{letra}</Texto>
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default function TelaQuiz({ licao, save, atualizar, onSair, onFim, onSemVidas }) {
  const insets = useSafeAreaInsets();
  const pratica = licao.tipo === 'guide';

  const [perguntas, setPerguntas] = useState(() => licao.perguntas.map((p) => ({ ...p })));
  const [indice, setIndice] = useState(0);
  const [acertos, setAcertos] = useState(0);
  const [erros, setErros] = useState(0);
  const [xpGanho, setXpGanho] = useState(0);
  const [escolhida, setEscolhida] = useState(null);
  const [digitada, setDigitada] = useState('');
  const [resultado, setResultado] = useState(null);   // null = ainda não respondeu
  const [tempo, setTempo] = useState(0);
  const [confete, setConfete] = useState(0);
  const barraTempo = useRef(new Animated.Value(1)).current;
  const rolagem = useRef(null);

  const q = perguntas[indice];
  const multipla = ehMultiplaEscolha(q);
  const respondida = resultado !== null;
  const podeVerificar = multipla ? escolhida !== null : digitada.trim().length > 0;

  const jaRespondeu = useRef(false);   // evita responder duas vezes a mesma pergunta

  function responder(tempoEsgotado = false) {
    if (respondida || jaRespondeu.current) return;
    if (!tempoEsgotado && !podeVerificar) return;
    jaRespondeu.current = true;
    barraTempo.stopAnimation();

    const certo = conferirResposta(q, { escolhida, digitada, tempoEsgotado });
    if (certo) {
      setAcertos((n) => n + 1);
      setXpGanho((n) => n + XP_POR_ACERTO);
      atualizar((s) => ({ ...s, totalAcertos: s.totalAcertos + 1 }));
      tocar('acerto');
      setConfete(Date.now());
    } else {
      setErros((n) => n + 1);
      if (!pratica) atualizar((s) => perderVida(s));
      tocar('erro');
      // Como no Duolingo: a pergunta errada volta no fim (uma vez)
      if (!q._retry) setPerguntas((lista) => [...lista, { ...q, _retry: true }]);
    }
    setResultado({ certo, tempoEsgotado });
  }

  // Guarda a versão mais nova de responder para o cronômetro usar
  const responderRef = useRef(responder);
  responderRef.current = responder;

  // Cronômetro das perguntas "Pense rápido"
  useEffect(() => {
    if (q.type !== 'timer' || respondida) return undefined;
    let restante = q.timeLimit;
    setTempo(restante);
    barraTempo.setValue(1);
    Animated.timing(barraTempo, { toValue: 0, duration: q.timeLimit * 1000, easing: Easing.linear, useNativeDriver: true }).start();
    const t = setInterval(() => {
      restante -= 1;
      setTempo(Math.max(0, restante));
      if (restante <= 0) {
        clearInterval(t);
        responderRef.current(true);
      }
    }, 1000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indice, respondida]);

  function continuar() {
    if (!pratica && save.vidas <= 0) {
      onSemVidas(licao.voltarPara);
      return;
    }
    if (indice + 1 < perguntas.length) {
      jaRespondeu.current = false;
      setIndice(indice + 1);
      setEscolhida(null);
      setDigitada('');
      setResultado(null);
      rolagem.current?.scrollTo({ y: 0, animated: false });
      return;
    }
    const agora = Date.now();
    const info = { tipo: licao.tipo, id: licao.id, perguntasOriginais: licao.perguntas.length, erros, xpGanho };
    const { resumo } = concluirLicao(save, info, agora);
    atualizar((s) => concluirLicao(s, info, agora).save);
    onFim(resumo, licao.voltarPara);
  }

  function estadoOpcao(i) {
    if (!respondida) return escolhida === i ? 'escolhida' : 'normal';
    if (i === q.correct) return 'certa';
    if (i === escolhida) return 'errada';
    return 'apagada';
  }

  const mascote = lerCores(q.mascot.bg);
  const progresso = (acertos / perguntas.length) * 100;
  const semVidasAgora = !pratica && save.vidas <= 0 && resultado && !resultado.certo;

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: COR.fundo }}>
      <View style={estilos.topo}>
        <Pressable onPress={onSair} hitSlop={12} accessibilityLabel="Sair da lição">
          <Feather name="x" size={26} color={COR.textoFraco} />
        </Pressable>
        <View style={estilos.trilhoProgresso}>
          <View style={[estilos.progresso, { width: `${progresso}%` }]} />
        </View>
        {q.type === 'timer' ? (
          <View style={estilos.chipTempo}>
            <Feather name="clock" size={13} color="#d97706" />
            <Texto peso="extrabold" style={{ fontSize: 12, color: '#92400e' }}>{respondida ? 0 : tempo}s</Texto>
          </View>
        ) : (
          <Texto peso="bold" style={{ fontSize: 12, color: COR.textoSuave }}>{indice + 1}/{perguntas.length}</Texto>
        )}
      </View>
      {q.type === 'timer' ? (
        <View style={estilos.trilhoTempo}>
          <Animated.View style={[estilos.barraTempo, { transform: [{ scaleX: barraTempo }] }]} />
        </View>
      ) : null}

      <ScrollView ref={rolagem} contentContainerStyle={[estilos.conteudo, { paddingBottom: respondida ? 260 : 32 }]} keyboardShouldPersistTaps="handled">
        <View style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>
          <View style={[estilos.mascote, { backgroundColor: mascote.bg, borderColor: mascote.border }]}>
            <Texto style={{ fontSize: 24 }}>{q.mascot.avatar}</Texto>
          </View>
          <View style={estilos.fala}>
            <Texto peso="extrabold" style={{ fontSize: 10, color: COR.verde, letterSpacing: 0.6, marginBottom: 2 }}>{q.mascot.name.toUpperCase()}:</Texto>
            <Texto peso="semibold" style={{ fontSize: 13, color: COR.textoMedio, fontStyle: 'italic', lineHeight: 19 }}>"{q.mascot.quote}"</Texto>
          </View>
        </View>

        <View style={{ gap: 6 }}>
          {q._retry ? (
            <View style={estilos.tagErro}>
              <Texto peso="extrabold" style={{ fontSize: 10, color: '#92400e' }}>🔁 ERRO ANTERIOR</Texto>
            </View>
          ) : null}
          <Texto peso="extrabold" style={{ fontSize: 18, lineHeight: 25 }}>{q.question}</Texto>
        </View>

        {multipla ? (
          <View style={{ gap: 10 }}>
            {q.options.map((opcao, i) => (
              <Opcao
                key={`${indice}-${i}`}
                texto={opcao}
                letra={String.fromCharCode(65 + i)}
                estado={estadoOpcao(i)}
                desativada={respondida}
                onPress={() => { vibrar('toque'); setEscolhida(i); }}
              />
            ))}
          </View>
        ) : (
          <View style={{ gap: 6 }}>
            <TextInput
              key={indice}
              value={digitada}
              onChangeText={setDigitada}
              editable={!respondida}
              autoFocus
              autoCorrect={false}
              autoCapitalize="none"
              returnKeyType="done"
              onSubmitEditing={() => responder()}
              placeholder="Digite sua resposta..."
              placeholderTextColor={COR.textoFraco}
              style={[
                estilos.campo,
                respondida && { borderColor: resultado.certo ? '#10b981' : '#fb7185' }
              ]}
              accessibilityLabel="Sua resposta"
            />
            <Texto peso="semibold" style={{ fontSize: 11, color: COR.textoFraco }}>Acentos e letras maiúsculas não importam.</Texto>
          </View>
        )}

        {!respondida ? (
          <Botao titulo="Verificar resposta" desativado={!podeVerificar} onPress={() => responder()} style={{ marginTop: 6 }} />
        ) : null}
      </ScrollView>

      {respondida ? (
        <View style={[
          estilos.retorno,
          { paddingBottom: insets.bottom + 16 },
          resultado.certo
            ? { backgroundColor: COR.acertoFundo, borderTopColor: COR.acertoBorda }
            : { backgroundColor: COR.erroFundo, borderTopColor: COR.erroBorda }
        ]}>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <Texto style={{ fontSize: 30 }}>{resultado.certo ? '🎉' : resultado.tempoEsgotado ? '⏰' : '😅'}</Texto>
            <View style={{ flex: 1, gap: 4 }}>
              <Texto peso="extrabold" style={{ fontSize: 17, color: resultado.certo ? COR.acertoTexto : COR.erroTexto }}>
                {resultado.certo ? 'Acertou em cheio!' : resultado.tempoEsgotado ? 'Tempo esgotado!' : 'Resposta incorreta'}
              </Texto>
              <Texto style={{ fontSize: 13, lineHeight: 19, color: resultado.certo ? COR.acertoTexto : COR.erroTexto }}>
                {resultado.certo ? q.explanation : `Resposta certa: ${respostaCerta(q)}. ${q.explanation}`}
              </Texto>
              {q.impact ? (
                <View style={estilos.impacto}>
                  <Texto peso="bold" style={{ fontSize: 12, lineHeight: 17, color: resultado.certo ? COR.acertoTexto : COR.erroTexto }}>
                    🌍 Por que importa: {q.impact}
                  </Texto>
                </View>
              ) : null}
            </View>
          </View>
          <Botao
            titulo={semVidasAgora ? 'Ver resultado' : 'Continuar'}
            icone="arrow-right"
            onPress={continuar}
            cor={resultado.certo ? COR.verde : '#e11d48'}
            corDegrau={resultado.certo ? COR.verdeEscuro : '#9f1239'}
            style={{ marginTop: 14 }}
          />
        </View>
      ) : null}

      <Confete disparo={confete} quantidade={30} />
    </KeyboardAvoidingView>
  );
}

const estilos = StyleSheet.create({
  topo: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 18, paddingTop: 14, paddingBottom: 8 },
  trilhoProgresso: { flex: 1, height: 14, backgroundColor: COR.borda, borderRadius: 7, overflow: 'hidden' },
  progresso: { height: '100%', backgroundColor: COR.esmeralda, borderRadius: 7 },
  chipTempo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#fef3c7',
    borderColor: '#fcd34d',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3
  },
  trilhoTempo: { height: 6, marginHorizontal: 18, backgroundColor: '#fef3c7', borderRadius: 3, overflow: 'hidden' },
  barraTempo: { height: '100%', backgroundColor: '#f59e0b', transformOrigin: 'left' },
  conteudo: { padding: 18, gap: 18 },
  mascote: { width: 56, height: 56, borderRadius: 18, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  fala: { flex: 1, backgroundColor: '#fff', borderColor: COR.borda, borderWidth: 2, borderRadius: 18, padding: 12 },
  tagErro: {
    alignSelf: 'flex-start',
    backgroundColor: '#fef3c7',
    borderColor: '#fcd34d',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2
  },
  opcao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 2,
    borderBottomWidth: 4,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14
  },
  letra: { width: 26, height: 26, borderRadius: 8, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  campo: {
    backgroundColor: '#fff',
    borderColor: '#cbd5e1',
    borderWidth: 2,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: FONTE.extrabold,
    fontSize: 17,
    color: COR.texto
  },
  retorno: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: 2,
    paddingHorizontal: 18,
    paddingTop: 16
  },
  impacto: { backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 6, marginTop: 4 }
});

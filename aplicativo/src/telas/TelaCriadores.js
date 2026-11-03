import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Gradiente, Selo, Texto, TituloSecao, Tocavel } from '../componentes';
import { COR } from '../tema';
import { lerCores } from '../cores';
import { AVATARES, AVATAR_CORES, CRIADORES, INSPIRACOES, LEVELS } from '../conteudo';
import { ofensivaAtual, saveInicial, titulo } from '../jogo';
import { vibrar } from '../sons';

function sortear(lista, diferenteDe) {
  if (lista.length < 2) return lista[0];
  let item = lista[Math.floor(Math.random() * lista.length)];
  while (item === diferenteDe) item = lista[Math.floor(Math.random() * lista.length)];
  return item;
}

function embaralhar(lista) {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

// Avatar sorteado; tocar sorteia outro
function Avatar({ inicial }) {
  const [avatar, setAvatar] = useState(inicial);
  const escala = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    escala.setValue(0.4);
    Animated.spring(escala, { toValue: 1, friction: 4, tension: 120, useNativeDriver: true }).start();
  }, [avatar, escala]);

  const cores = lerCores(avatar.cor);
  return (
    <Pressable
      onPress={() => { vibrar('toque'); setAvatar({ emoji: sortear(AVATARES, avatar.emoji), cor: sortear(AVATAR_CORES, avatar.cor) }); }}
      accessibilityLabel="Trocar avatar"
    >
      <Animated.View style={{ transform: [{ scale: escala }] }}>
        <Gradiente cores={[cores.from, cores.to]} style={estilos.avatar}>
          <Texto style={{ fontSize: 30 }}>{avatar.emoji}</Texto>
        </Gradiente>
      </Animated.View>
    </Pressable>
  );
}

export default function TelaCriadores({ save, agora, atualizar }) {
  const [sorteio] = useState(() => {
    const emojis = embaralhar(AVATARES);
    const cores = embaralhar(AVATAR_CORES);
    return CRIADORES.map((_, i) => ({ emoji: emojis[i % emojis.length], cor: cores[i % cores.length] }));
  });
  const [confirmarApagar, setConfirmarApagar] = useState(false);

  useEffect(() => {
    if (!confirmarApagar) return undefined;
    const t = setTimeout(() => setConfirmarApagar(false), 4000);
    return () => clearTimeout(t);
  }, [confirmarApagar]);

  const { atual: rank } = titulo(save.xp);

  function apagar() {
    if (!confirmarApagar) {
      vibrar('erro');
      setConfirmarApagar(true);
      return;
    }
    atualizar(() => saveInicial());
  }

  return (
    <ScrollView contentContainerStyle={estilos.conteudo}>
      <View style={{ gap: 6, alignItems: 'center' }}>
        <Selo texto="Projeto acadêmico" />
        <Texto peso="extrabold" style={{ fontSize: 21, textAlign: 'center' }}>Criadores e Inspirações 🚀</Texto>
        <Texto style={{ fontSize: 13, color: COR.textoSuave, textAlign: 'center' }}>Conheça quem fez o EcoQuest e as referências do projeto!</Texto>
      </View>

      <View style={{ gap: 10 }}>
        <TituloSecao>👥 Integrantes do grupo</TituloSecao>
        {CRIADORES.map((p, i) => (
          <View key={p.nome} style={estilos.pessoa}>
            <Avatar inicial={sorteio[i]} />
            <View style={{ flex: 1 }}>
              <Texto peso="extrabold" style={{ fontSize: 15 }}>{p.nome}</Texto>
              <Texto style={{ fontSize: 12, color: COR.textoSuave }}>{p.funcao}</Texto>
            </View>
          </View>
        ))}
        <Texto style={{ fontSize: 11, color: COR.textoFraco, textAlign: 'center' }}>🎲 Toque num avatar para sortear outro.</Texto>
      </View>

      <View style={{ gap: 10 }}>
        <TituloSecao>💡 Inspirações do projeto</TituloSecao>
        {INSPIRACOES.map((insp, i) => (i === 0 ? (
          <Gradiente key={insp.titulo} cores={[COR.verdeEscuro, COR.verde]} style={estilos.inspiracao}>
            <Texto peso="extrabold" style={{ fontSize: 13, color: '#6ee7b7' }}>{insp.icone} {insp.titulo}</Texto>
            <Texto style={{ fontSize: 12, color: '#e2e8f0', lineHeight: 18 }}>{insp.texto}</Texto>
          </Gradiente>
        ) : (
          <View key={insp.titulo} style={[estilos.inspiracao, estilos.inspiracaoClara]}>
            <Texto peso="extrabold" style={{ fontSize: 13 }}>{insp.icone} {insp.titulo}</Texto>
            <Texto style={{ fontSize: 12, color: COR.textoSuave, lineHeight: 18 }}>{insp.texto}</Texto>
          </View>
        )))}
      </View>

      <View style={{ gap: 10 }}>
        <TituloSecao>🙋 Sua conta</TituloSecao>
        <View style={estilos.conta}>
          <View>
            <Texto peso="extrabold" style={{ fontSize: 14 }}>
              {save.usuario.nome}
              {save.usuario.email ? <Texto style={{ fontSize: 13, color: COR.textoSuave }}> · {save.usuario.email}</Texto> : null}
            </Texto>
            <Texto style={{ fontSize: 12, color: COR.textoSuave, marginTop: 4, lineHeight: 18 }}>
              {rank.icone} {rank.titulo} · {save.xp} XP · {save.fasesConcluidas.length}/{LEVELS.length} fases · ofensiva de {ofensivaAtual(save, agora)} dia(s)
            </Texto>
          </View>

          <Tocavel onPress={() => atualizar((s) => ({ ...s, som: !s.som }))} style={estilos.botaoLinha} accessibilityRole="switch" accessibilityState={{ checked: save.som }}>
            <Feather name={save.som ? 'volume-2' : 'volume-x'} size={18} color={COR.textoMedio} />
            <Texto peso="bold" style={{ fontSize: 13, color: COR.textoMedio, flex: 1 }}>Sons</Texto>
            <Texto peso="extrabold" style={{ fontSize: 12, color: save.som ? '#047857' : COR.textoFraco }}>{save.som ? 'LIGADOS' : 'DESLIGADOS'}</Texto>
          </Tocavel>

          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Tocavel onPress={() => atualizar((s) => ({ ...s, logado: false }))} style={[estilos.botaoMetade]}>
              <Feather name="log-out" size={16} color={COR.textoMedio} />
              <Texto peso="bold" style={{ fontSize: 12, color: COR.textoMedio }}>Sair</Texto>
            </Tocavel>
            <Tocavel
              onPress={apagar}
              style={[estilos.botaoMetade, { borderColor: '#fecdd3' }, confirmarApagar && { backgroundColor: '#e11d48', borderColor: '#e11d48' }]}
            >
              <Feather name="rotate-ccw" size={16} color={confirmarApagar ? '#fff' : '#be123c'} />
              <Texto peso="bold" style={{ fontSize: 12, color: confirmarApagar ? '#fff' : '#be123c' }}>
                {confirmarApagar ? 'Toque de novo' : 'Apagar progresso'}
              </Texto>
            </Tocavel>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  conteudo: { padding: 18, gap: 22, paddingBottom: 32 },
  pessoa: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#fff',
    borderColor: COR.borda,
    borderWidth: 2,
    borderRadius: 18,
    padding: 12
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    boxShadow: '0 3px 8px rgba(0,0,0,0.15)'
  },
  inspiracao: { borderRadius: 18, padding: 16, gap: 4 },
  inspiracaoClara: { backgroundColor: '#fff', borderColor: COR.borda, borderWidth: 1 },
  conta: { backgroundColor: '#fff', borderColor: COR.borda, borderWidth: 2, borderRadius: 18, padding: 16, gap: 12 },
  botaoLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderColor: COR.borda,
    borderWidth: 2,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10
  },
  botaoMetade: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderColor: COR.borda,
    borderWidth: 2,
    borderRadius: 14,
    paddingVertical: 10
  }
});

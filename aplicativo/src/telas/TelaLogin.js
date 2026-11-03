import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Botao, Gradiente, SimboloGirando, Texto } from '../componentes';
import { COR, FONTE } from '../tema';
import { tocar } from '../sons';

const LIXOS = ['🥤', '📄', '🍾', '🥫', '🍎', '🔋', '♻️', '🌱'];

// Lixos subindo devagar no fundo
function Flutuante({ emoji, indice }) {
  const { height } = useWindowDimensions();
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(Animated.timing(v, {
      toValue: 1, duration: 9000 + (indice % 3) * 2000, delay: indice * 900, easing: Easing.linear, useNativeDriver: true
    }));
    loop.start();
    return () => loop.stop();
  }, [v, indice]);
  return (
    <Animated.Text
      style={{
        position: 'absolute', bottom: -40, left: `${6 + indice * 12}%`, fontSize: 28,
        opacity: v.interpolate({ inputRange: [0, 0.1, 0.9, 1], outputRange: [0, 0.22, 0.22, 0] }),
        transform: [
          { translateY: v.interpolate({ inputRange: [0, 1], outputRange: [0, -(height + 80)] }) },
          { rotate: v.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '200deg'] }) }
        ]
      }}
    >
      {emoji}
    </Animated.Text>
  );
}

export default function TelaLogin({ save, atualizar }) {
  const insets = useSafeAreaInsets();
  const [nome, setNome] = useState(save.usuario.nome);
  const [email, setEmail] = useState(save.usuario.email);
  const [erro, setErro] = useState('');
  const flutuantes = useMemo(() => LIXOS.map((e, i) => <Flutuante key={i} emoji={e} indice={i} />), []);

  function entrar() {
    const n = nome.trim();
    const e = email.trim();
    if (!n) {
      setErro('Digite seu nome ou apelido para continuar.');
      return;
    }
    if (e && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) {
      setErro('Esse e-mail não parece válido. Corrija ou deixe em branco.');
      return;
    }
    tocar('acerto');
    atualizar((s) => ({ ...s, usuario: { nome: n, email: e }, logado: true }));
  }

  return (
    <Gradiente cores={[COR.verdeEscuro, COR.verde, '#0b2a20']} diagonal={false} style={{ flex: 1 }}>
      <View style={[StyleSheet.absoluteFill, { pointerEvents: 'none' }]}>{flutuantes}</View>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={[estilos.conteudo, { paddingTop: insets.top + 32, paddingBottom: insets.bottom + 24 }]}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ alignItems: 'center', gap: 12 }}>
            <View style={estilos.logo}>
              <SimboloGirando tamanho={60} />
            </View>
            <Texto peso="extrabold" style={{ fontSize: 40, color: '#fff', letterSpacing: -1 }}>
              Eco<Texto peso="extrabold" style={{ fontSize: 40, color: '#34d399' }}>Quest</Texto>
            </Texto>
            <Texto peso="semibold" style={{ fontSize: 15, color: '#d1fae5', textAlign: 'center', paddingHorizontal: 12 }}>
              Aprenda a reciclar jogando, com fases, eventos e memes virais!
            </Texto>
          </View>

          <View style={estilos.alerta}>
            <Texto style={{ fontSize: 28 }}>⚠️</Texto>
            <Texto style={{ flex: 1, fontSize: 12, color: '#fff1f2', lineHeight: 18 }}>
              <Texto peso="extrabold" style={{ color: '#fff', fontSize: 12 }}>O Brasil recicla só 8,7% do seu lixo. </Texto>
              Cada pessoa que aprende a separar certo muda esse número. Bora?
            </Texto>
          </View>

          <View style={estilos.formulario}>
            <Texto peso="extrabold" style={estilos.formTitulo}>CRIE SUA ECOCONTA</Texto>

            <View style={{ gap: 6 }}>
              <Texto peso="bold" style={estilos.rotulo}>SEU NOME / APELIDO</Texto>
              <TextInput
                value={nome}
                onChangeText={(t) => { setNome(t); setErro(''); }}
                placeholder="Ex: EcoJogador"
                placeholderTextColor="#64748b"
                maxLength={30}
                autoComplete="nickname"
                returnKeyType="next"
                style={estilos.campo}
                accessibilityLabel="Seu nome ou apelido"
              />
            </View>

            <View style={{ gap: 6 }}>
              <Texto peso="bold" style={estilos.rotulo}>E-MAIL (OPCIONAL)</Texto>
              <TextInput
                value={email}
                onChangeText={(t) => { setEmail(t); setErro(''); }}
                placeholder="seu@email.com"
                placeholderTextColor="#64748b"
                maxLength={80}
                autoComplete="email"
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="done"
                onSubmitEditing={entrar}
                style={estilos.campo}
                accessibilityLabel="E-mail, opcional"
              />
            </View>

            {erro ? <Texto peso="bold" style={{ color: '#fda4af', fontSize: 12 }}>{erro}</Texto> : null}

            <Botao titulo="COMEÇAR A JOGAR 🚀" onPress={entrar} cor="#34d399" corDegrau="#1b7a52" corTexto={COR.verdeEscuro} style={{ marginTop: 6 }} />

            <Texto style={{ fontSize: 11, color: 'rgba(209,250,229,0.6)', textAlign: 'center' }}>
              Seu progresso fica salvo neste celular.
            </Texto>
          </View>

          <Texto style={{ fontSize: 11, color: 'rgba(110,231,183,0.6)', textAlign: 'center' }}>
            EcoQuest © Projeto Educacional Sustentável
          </Texto>
        </ScrollView>
      </KeyboardAvoidingView>
    </Gradiente>
  );
}

const estilos = StyleSheet.create({
  conteudo: { flexGrow: 1, justifyContent: 'space-between', paddingHorizontal: 22, gap: 22 },
  logo: {
    backgroundColor: 'rgba(52,211,153,0.15)',
    borderColor: 'rgba(110,231,183,0.3)',
    borderWidth: 1,
    borderRadius: 30,
    padding: 16,
    boxShadow: '0 0 40px rgba(82,183,136,0.35)'
  },
  alerta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(244,63,94,0.15)',
    borderColor: 'rgba(253,164,175,0.3)',
    borderWidth: 1,
    borderRadius: 18,
    padding: 12
  },
  formulario: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderRadius: 26,
    padding: 20,
    gap: 14
  },
  formTitulo: { fontSize: 14, color: '#6ee7b7', textAlign: 'center', letterSpacing: 1.2 },
  rotulo: { fontSize: 11, color: '#cbd5e1', letterSpacing: 0.5 },
  campo: {
    backgroundColor: 'rgba(15,23,42,0.6)',
    borderColor: 'rgba(16,185,129,0.3)',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#fff',
    fontFamily: FONTE.bold,
    fontSize: 15
  }
});

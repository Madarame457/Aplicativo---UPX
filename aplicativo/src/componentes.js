/* =========================================================
   Componentes usados em várias telas
   ========================================================= */
import { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, Ionicons } from '@expo/vector-icons';
import { COR, FONTE } from './tema';
import { lerCores } from './cores';
import { MAX_VIDAS, formatarTempo, msAteProximaVida, ofensivaAtual } from './jogo';
import { vibrar } from './sons';


/* ---------- Texto com a fonte do app ---------- */
export function Texto({ peso = 'regular', style, ...props }) {
  return <Text {...props} style={[{ fontFamily: FONTE[peso], color: COR.texto }, style]} />;
}


/* ---------- Gradiente a partir das classes do dados.js ---------- */
// classes: "from-sky-600 to-indigo-700"
export function Gradiente({ classes, cores, style, children, diagonal = true }) {
  const c = cores || [lerCores(classes).from, lerCores(classes).to];
  return (
    <LinearGradient
      colors={c}
      start={{ x: 0, y: 0 }}
      end={diagonal ? { x: 1, y: 1 } : { x: 1, y: 0 }}
      style={style}
    >
      {children}
    </LinearGradient>
  );
}


/* ---------- Botão com "degrau" estilo Duolingo ---------- */
export function Botao({ titulo, onPress, cor = COR.verde, corDegrau = COR.verdeEscuro, corTexto = '#fff', desativado = false, icone, style, pequeno = false }) {
  const corFundo = desativado ? '#cbd5e1' : cor;
  const degrau = desativado ? '#94a3b8' : corDegrau;
  return (
    <Pressable
      onPress={() => { if (!desativado) { vibrar('toque'); onPress && onPress(); } }}
      disabled={desativado}
      accessibilityRole="button"
      accessibilityState={{ disabled: desativado }}
      style={[{ borderRadius: 16, backgroundColor: degrau, paddingBottom: 4 }, style]}
    >
      {({ pressed }) => (
        <View style={[
          estilos.botao,
          pequeno && { paddingVertical: 10 },
          { backgroundColor: corFundo, transform: [{ translateY: pressed && !desativado ? 3 : 0 }] }
        ]}>
          <Texto peso="extrabold" style={{ color: desativado ? '#64748b' : corTexto, fontSize: pequeno ? 13 : 15, letterSpacing: 0.3 }}>
            {titulo}
          </Texto>
          {icone ? <Feather name={icone} size={18} color={desativado ? '#64748b' : corTexto} /> : null}
        </View>
      )}
    </Pressable>
  );
}


/* ---------- Toque com leve encolhimento ---------- */
export function Tocavel({ onPress, style, children, desativado, ...props }) {
  return (
    <Pressable
      onPress={desativado ? undefined : onPress}
      disabled={desativado}
      accessibilityRole="button"
      style={({ pressed }) => [style, pressed && !desativado && { transform: [{ scale: 0.98 }], opacity: 0.92 }]}
      {...props}
    >
      {children}
    </Pressable>
  );
}


/* ---------- Símbolo de reciclagem girando ---------- */
export function SimboloGirando({ tamanho = 22 }) {
  const giro = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(Animated.timing(giro, { toValue: 1, duration: 8000, easing: Easing.linear, useNativeDriver: true }));
    loop.start();
    return () => loop.stop();
  }, [giro]);
  const rotate = giro.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  return <Animated.Text style={{ fontSize: tamanho, transform: [{ rotate }] }}>♻️</Animated.Text>;
}


/* ---------- Cabeçalho: ofensiva, XP, vidas e símbolo ---------- */
export function Cabecalho({ save, agora }) {
  const ofensiva = ofensivaAtual(save, agora);
  const faltaVida = save.vidas < MAX_VIDAS;
  return (
    <View style={estilos.cabecalho}>
      <View style={estilos.linha}>
        <View style={[estilos.pilula, { backgroundColor: COR.verde }]} accessibilityLabel={`Ofensiva de ${ofensiva} dias`}>
          <Ionicons name="flame" size={15} color={COR.ouro} />
          <Texto peso="extrabold" style={{ color: COR.ouro, fontSize: 12 }}>{ofensiva}d</Texto>
        </View>
        <View style={[estilos.pilula, { backgroundColor: COR.verde }]} accessibilityLabel={`${save.xp} XP`}>
          <Feather name="zap" size={14} color="#fcd34d" />
          <Texto peso="extrabold" style={{ color: '#6ee7b7', fontSize: 12 }}>{save.xp} XP</Texto>
        </View>
      </View>
      <View style={estilos.linha}>
        <View style={[estilos.pilula, { backgroundColor: 'rgba(69,10,10,0.7)' }]} accessibilityLabel={`${save.vidas} vidas`}>
          <Ionicons name="heart" size={15} color={COR.perigo} />
          <Texto peso="extrabold" style={{ color: '#f87171', fontSize: 12 }}>
            {save.vidas}{faltaVida ? ` · ${formatarTempo(msAteProximaVida(save, agora))}` : ''}
          </Texto>
        </View>
        <View style={estilos.simbolo}>
          <SimboloGirando tamanho={20} />
        </View>
      </View>
    </View>
  );
}


/* ---------- Barra de abas ---------- */
const ABAS = [
  { id: 'learn', nome: 'Aprender', icone: 'map' },
  { id: 'events', nome: 'Eventos', icone: 'award' },
  { id: 'guide', nome: 'Guia Lixo', icone: 'book-open' },
  { id: 'impact', nome: 'Impacto', icone: 'globe' },
  { id: 'creators', nome: 'Criadores', icone: 'users' }
];

export function BarraAbas({ aba, onTrocar, insetBaixo = 0 }) {
  return (
    <View style={[estilos.barraAbas, { paddingBottom: Math.max(insetBaixo, 8) }]}>
      {ABAS.map((a) => {
        const ativa = a.id === aba;
        return (
          <Pressable
            key={a.id}
            onPress={() => { vibrar('toque'); onTrocar(a.id); }}
            style={estilos.aba}
            accessibilityRole="tab"
            accessibilityState={{ selected: ativa }}
            accessibilityLabel={a.nome}
          >
            <View style={[estilos.abaIcone, ativa && { backgroundColor: '#d1fae5' }]}>
              <Feather name={a.icone} size={20} color={ativa ? COR.verde : COR.textoFraco} />
            </View>
            <Texto peso={ativa ? 'extrabold' : 'semibold'} style={{ fontSize: 10, color: ativa ? COR.verde : COR.textoFraco }}>
              {a.nome}
            </Texto>
          </Pressable>
        );
      })}
    </View>
  );
}


/* ---------- "Você sabia?" ---------- */
export function CartaoFato({ fato }) {
  return (
    <Gradiente cores={['#ecfdf5', '#f7fee7']} style={estilos.fato}>
      <Texto style={{ fontSize: 28 }}>🌍</Texto>
      <View style={{ flex: 1 }}>
        <Texto peso="extrabold" style={{ fontSize: 10, color: '#047857', letterSpacing: 1, marginBottom: 2 }}>VOCÊ SABIA?</Texto>
        <Texto style={{ fontSize: 13, color: '#022c22', lineHeight: 19 }}>{fato}</Texto>
      </View>
    </Gradiente>
  );
}


/* ---------- Barra de progresso ---------- */
export function BarraProgresso({ porcento, cor = COR.esmeralda, fundo = 'rgba(2,44,34,0.55)', altura = 10 }) {
  return (
    <View style={{ height: altura, backgroundColor: fundo, borderRadius: altura, overflow: 'hidden' }}>
      <View style={{ width: `${Math.max(0, Math.min(100, porcento))}%`, height: '100%', backgroundColor: cor, borderRadius: altura }} />
    </View>
  );
}


/* ---------- Título de seção ---------- */
export function TituloSecao({ children }) {
  return (
    <Texto peso="extrabold" style={{ fontSize: 11, color: COR.textoFraco, letterSpacing: 1.2, textTransform: 'uppercase' }}>
      {children}
    </Texto>
  );
}

export function Selo({ texto, cor = '#065f46', fundo = '#d1fae5', borda = '#6ee7b7' }) {
  return (
    <View style={{ alignSelf: 'center', backgroundColor: fundo, borderColor: borda, borderWidth: 1, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 4 }}>
      <Texto peso="extrabold" style={{ fontSize: 10, color: cor, letterSpacing: 0.8, textTransform: 'uppercase' }}>{texto}</Texto>
    </View>
  );
}


/* ---------- Confete ---------- */
const CORES_CONFETE = ['#10b981', '#fbbf24', '#f43f5e', '#38bdf8', '#a78bfa', '#84cc16', '#ffffff'];

// Muda o valor de "disparo" (ex.: um número novo) para soltar confete
export function Confete({ disparo, quantidade = 40 }) {
  const { width, height } = useWindowDimensions();
  const pecas = useMemo(() => Array.from({ length: quantidade }, () => ({
    x: Math.random() * width,
    cor: CORES_CONFETE[Math.floor(Math.random() * CORES_CONFETE.length)],
    tam: 6 + Math.random() * 6,
    atraso: Math.random() * 250,
    giro: Math.random() * 720 - 360,
    deriva: (Math.random() - 0.5) * 140,
    duracao: 1600 + Math.random() * 1200,
    valor: new Animated.Value(0)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  })), [disparo, quantidade]);

  useEffect(() => {
    if (!disparo) return;
    const anim = Animated.parallel(pecas.map((p) => Animated.timing(p.valor, {
      toValue: 1, duration: p.duracao, delay: p.atraso, easing: Easing.out(Easing.quad), useNativeDriver: true
    })));
    anim.start();
    return () => anim.stop();
  }, [pecas, disparo]);

  if (!disparo) return null;
  return (
    <View style={[StyleSheet.absoluteFill, { pointerEvents: 'none', zIndex: 100 }]}>
      {pecas.map((p, i) => (
        <Animated.View
          key={i}
          style={{
            position: 'absolute', left: p.x, top: -20,
            width: p.tam, height: p.tam * 1.6, borderRadius: 2, backgroundColor: p.cor,
            opacity: p.valor.interpolate({ inputRange: [0, 0.8, 1], outputRange: [1, 1, 0] }),
            transform: [
              { translateY: p.valor.interpolate({ inputRange: [0, 1], outputRange: [0, height + 40] }) },
              { translateX: p.valor.interpolate({ inputRange: [0, 1], outputRange: [0, p.deriva] }) },
              { rotate: p.valor.interpolate({ inputRange: [0, 1], outputRange: ['0deg', `${p.giro}deg`] }) }
            ]
          }}
        />
      ))}
    </View>
  );
}


/* ---------- Pulo suave (fase atual, troféu) ---------- */
export function Pulando({ children, distancia = 8, duracao = 1250, style }) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(v, { toValue: 1, duration: duracao, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(v, { toValue: 0, duration: duracao, easing: Easing.inOut(Easing.sin), useNativeDriver: true })
    ]));
    loop.start();
    return () => loop.stop();
  }, [v, duracao]);
  const translateY = v.interpolate({ inputRange: [0, 1], outputRange: [0, -distancia] });
  return <Animated.View style={[style, { transform: [{ translateY }] }]}>{children}</Animated.View>;
}


const estilos = StyleSheet.create({
  botao: {
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8
  },
  cabecalho: {
    backgroundColor: COR.verdeEscuro,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: COR.verde
  },
  linha: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  pilula: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.3)'
  },
  simbolo: {
    backgroundColor: 'rgba(16,185,129,0.2)',
    borderColor: 'rgba(16,185,129,0.4)',
    borderWidth: 1,
    borderRadius: 12,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center'
  },
  barraAbas: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: COR.borda,
    paddingTop: 6,
    paddingHorizontal: 4
  },
  aba: { flex: 1, alignItems: 'center', gap: 2 },
  abaIcone: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  fato: {
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#a7f3d0'
  }
});

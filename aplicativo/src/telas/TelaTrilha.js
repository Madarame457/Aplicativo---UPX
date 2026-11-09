import { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { BarraProgresso, CartaoFato, Gradiente, Pulando, Texto, Tocavel } from '../componentes';
import { COR } from '../tema';
import { lerCores } from '../cores';
import { FATOS, LEVELS } from '../conteudo';
import {
  MAX_VIDAS, faseConcluida, faseLiberada, formatarTempo, indiceFaseAtual,
  msAteProximaVida, titulo, todasFasesConcluidas
} from '../jogo';

const ZIGUEZAGUE = [0, -56, -28, 28, 56];

function NoFase({ fase, liberada, concluida, atual, deslocamento, onPress }) {
  const cor = lerCores(fase.color).bg;
  const botao = (
    <View style={{ alignItems: 'center' }}>
      {atual ? (
        <View style={estilos.balao}>
          <Texto peso="extrabold" style={{ fontSize: 10, color: COR.verde, letterSpacing: 0.5 }}>COMEÇAR</Texto>
          <View style={estilos.balaoSeta} />
        </View>
      ) : null}
      <View>
        <Tocavel
          onPress={onPress}
          desativado={!liberada}
          accessibilityLabel={`${fase.title}${liberada ? '' : ' (bloqueada)'}`}
          style={[estilos.no, { backgroundColor: liberada ? cor : '#cbd5e1' }, atual && estilos.noAtual]}
        >
          <Texto style={{ fontSize: 30 }}>{liberada ? fase.icon : '🔒'}</Texto>
        </Tocavel>
        {concluida ? (
          <View style={estilos.check}>
            <Feather name="check" size={14} color="#fff" />
          </View>
        ) : null}
      </View>
    </View>
  );

  return (
    <View style={{ alignItems: 'center', transform: [{ translateX: deslocamento }] }}>
      {atual ? <Pulando>{botao}</Pulando> : botao}
      <View style={estilos.rotuloFase}>
        <Texto peso="bold" style={{ fontSize: 11, color: liberada ? COR.texto : COR.textoFraco, textAlign: 'center' }}>
          {fase.title}{concluida ? ' ⭐' : ''}
        </Texto>
      </View>
    </View>
  );
}

export default function TelaTrilha({ save, agora, onFase, onAba }) {
  const fato = useMemo(() => FATOS[Math.floor(Math.random() * FATOS.length)], []);
  const feitas = LEVELS.filter((f) => faseConcluida(save, f.id)).length;
  const atual = indiceFaseAtual(save);
  const { atual: rank, proximo, porcento } = titulo(save.xp);

  let posicaoNaUnidade = 0;
  const trilha = LEVELS.map((fase, i) => {
    const liberada = faseLiberada(save, i);
    let cabecalhoUnidade = null;
    if (fase.unit) {
      posicaoNaUnidade = 0;
      cabecalhoUnidade = liberada ? (
        <Gradiente key={`u${i}`} cores={[COR.verde, '#047857']} diagonal={false} style={[estilos.unidade, i > 0 && { marginTop: 12 }]}>
          <Texto style={{ fontSize: 30 }}>{fase.unit.emoji}</Texto>
          <View style={{ flex: 1 }}>
            <Texto peso="extrabold" style={{ fontSize: 14, color: '#fff' }}>{fase.unit.title}</Texto>
            <Texto style={{ fontSize: 12, color: '#d1fae5' }}>{fase.unit.subtitle}</Texto>
          </View>
        </Gradiente>
      ) : (
        <View key={`u${i}`} style={[estilos.unidade, estilos.unidadeBloqueada, i > 0 && { marginTop: 12 }]}>
          <Texto style={{ fontSize: 30 }}>🔒</Texto>
          <View style={{ flex: 1 }}>
            <Texto peso="extrabold" style={{ fontSize: 14, color: COR.textoSuave }}>{fase.unit.title}</Texto>
            <Texto style={{ fontSize: 12, color: COR.textoSuave }}>{fase.unit.subtitle}</Texto>
          </View>
        </View>
      );
    }
    const deslocamento = ZIGUEZAGUE[posicaoNaUnidade % ZIGUEZAGUE.length];
    posicaoNaUnidade++;
    return (
      <View key={fase.id} style={{ width: '100%', alignItems: 'center', gap: 28 }}>
        {cabecalhoUnidade}
        <NoFase
          fase={fase}
          liberada={liberada}
          concluida={faseConcluida(save, fase.id)}
          atual={i === atual}
          deslocamento={deslocamento}
          onPress={() => onFase(fase.id)}
        />
      </View>
    );
  });

  return (
    <ScrollView contentContainerStyle={estilos.conteudo}>
      <Gradiente cores={[COR.verdeEscuro, COR.verde, '#047857']} style={estilos.heroi}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
          <Texto peso="extrabold" style={{ fontSize: 21, color: '#fff', flexShrink: 1 }} numberOfLines={1}>
            Olá, {save.usuario.nome}! 👋
          </Texto>
          <View style={estilos.chipTitulo}>
            <Texto peso="extrabold" style={{ fontSize: 10, color: '#fff' }}>{rank.icone} {rank.titulo}</Texto>
          </View>
        </View>

        <View style={{ gap: 4 }}>
          <View style={estilos.linhaBarra}>
            <Texto peso="bold" style={estilos.textoBarra}>Trilha</Texto>
            <Texto peso="bold" style={estilos.textoBarra}>{feitas}/{LEVELS.length} fases</Texto>
          </View>
          <BarraProgresso porcento={(feitas / LEVELS.length) * 100} cor="#34d399" />
        </View>

        <View style={{ gap: 4 }}>
          <View style={estilos.linhaBarra}>
            <Texto peso="bold" style={[estilos.textoBarra, { color: '#fef3c7', flexShrink: 1 }]} numberOfLines={1}>
              {proximo ? `Próximo título: ${proximo.titulo}` : 'Título máximo alcançado!'}
            </Texto>
            <Texto peso="bold" style={[estilos.textoBarra, { color: '#fef3c7' }]}>
              {proximo ? `${save.xp}/${proximo.xp} XP` : `${save.xp} XP`}
            </Texto>
          </View>
          <BarraProgresso porcento={porcento} cor={COR.ouro} />
        </View>
        <Texto style={estilos.marcaDagua}>♻️</Texto>
      </Gradiente>

      {save.vidas < MAX_VIDAS ? (
        <View style={estilos.avisoVidas}>
          <Texto style={{ fontSize: 24 }}>❤️</Texto>
          <Texto style={{ flex: 1, fontSize: 12, color: '#881337', lineHeight: 18 }}>
            <Texto peso="extrabold" style={{ fontSize: 12, color: '#881337' }}>{save.vidas} de {MAX_VIDAS} vidas. </Texto>
            Próxima vida em {formatarTempo(msAteProximaVida(save, agora))}.{'\n'}
            <Texto style={{ fontSize: 11, color: '#be123c' }}>Dica: acertar tudo num teste do Guia Lixo devolve 1 vida!</Texto>
          </Texto>
        </View>
      ) : null}

      {todasFasesConcluidas(save) ? (
        <Tocavel onPress={() => onAba('events')}>
          <Gradiente cores={['#7e22ce', '#312e81']} style={estilos.cartaoMestre}>
            <Texto style={{ fontSize: 34 }}>👑</Texto>
            <View style={{ flex: 1 }}>
              <Texto peso="extrabold" style={{ fontSize: 14, color: '#fff' }}>Você é Mestre da Reciclagem!</Texto>
              <Texto style={{ fontSize: 12, color: '#f3e8ff' }}>O Desafio Final foi liberado na aba Eventos.</Texto>
            </View>
            <Feather name="chevron-right" size={20} color="#fff" />
          </Gradiente>
        </Tocavel>
      ) : null}

      <CartaoFato fato={fato} />

      <View style={estilos.trilha}>
        <View style={estilos.linhaTrilha} />
        {trilha}
      </View>

      <Tocavel onPress={() => onAba('impact')} style={estilos.cartaoImpacto}>
        <Texto style={{ fontSize: 30 }}>🌎</Texto>
        <View style={{ flex: 1 }}>
          <Texto peso="extrabold" style={{ fontSize: 14 }}>Por que tudo isso importa?</Texto>
          <Texto style={{ fontSize: 12, color: COR.textoMedio }}>Veja os números do lixo no Brasil e assuma seus compromissos.</Texto>
        </View>
        <Feather name="chevron-right" size={20} color="#047857" />
      </Tocavel>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  conteudo: { padding: 18, gap: 18, paddingBottom: 32 },
  heroi: { borderRadius: 26, padding: 20, gap: 12, overflow: 'hidden' },
  chipTitulo: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4
  },
  linhaBarra: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  textoBarra: { fontSize: 11, color: '#d1fae5' },
  marcaDagua: { position: 'absolute', right: -14, bottom: -26, fontSize: 110, opacity: 0.1 },
  avisoVidas: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#fff1f2',
    borderColor: '#fecdd3',
    borderWidth: 1,
    borderRadius: 18,
    padding: 12
  },
  cartaoMestre: { borderRadius: 18, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12 },
  trilha: { alignItems: 'center', gap: 28, paddingVertical: 8 },
  linhaTrilha: { position: 'absolute', top: 40, bottom: 40, width: 8, backgroundColor: COR.borda, borderRadius: 8 },
  unidade: {
    width: '100%',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderBottomWidth: 4,
    borderBottomColor: COR.verdeEscuro
  },
  unidadeBloqueada: { backgroundColor: COR.borda, borderBottomColor: '#cbd5e1' },
  no: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#fff',
    boxShadow: '0 6px 0 rgba(0,0,0,0.18)'
  },
  noAtual: { boxShadow: '0 6px 0 rgba(0,0,0,0.18), 0 0 0 6px rgba(16,185,129,0.35)' },
  check: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COR.ouro,
    borderWidth: 2,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  rotuloFase: {
    marginTop: 8,
    backgroundColor: '#fff',
    borderColor: COR.borda,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
    maxWidth: 230,
    boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
  },
  balao: {
    marginBottom: 10,
    backgroundColor: '#fff',
    borderColor: COR.verde,
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignItems: 'center'
  },
  balaoSeta: {
    position: 'absolute',
    bottom: -8,
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 7,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: COR.verde
  },
  cartaoImpacto: {
    backgroundColor: '#fff',
    borderColor: '#a7f3d0',
    borderWidth: 2,
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  }
});

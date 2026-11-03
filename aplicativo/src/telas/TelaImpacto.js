import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Confete, Gradiente, Selo, Texto, TituloSecao, Tocavel } from '../componentes';
import { COR } from '../tema';
import { CAMINHO_DO_LIXO, CINCO_RS, COMPROMISSOS, IMPACTO_STATS } from '../conteudo';
import { XP_COMPROMISSO, alternarCompromisso } from '../jogo';
import { tocar, vibrar } from '../sons';

const MOTIVOS = [
  ['🌳', 'Poupa a natureza:', 'menos árvores, minério e petróleo tirados do planeta.'],
  ['⚡', 'Economiza energia:', 'reciclar alumínio gasta cerca de 95% menos energia.'],
  ['🌊', 'Protege rios e oceanos:', 'menos plástico chegando aos animais.'],
  ['🦟', 'Cuida da saúde:', 'lixo largado atrai ratos e mosquitos que transmitem doenças.'],
  ['🤝', 'Gera renda:', 'milhares de catadores vivem da reciclagem.']
];

export default function TelaImpacto({ save, atualizar }) {
  const [confete, setConfete] = useState(0);

  function alternar(id) {
    const { premiado } = alternarCompromisso(save, id);
    atualizar((s) => alternarCompromisso(s, id).save);
    if (premiado) {
      tocar('acerto');
      setConfete(Date.now());
    } else {
      vibrar('toque');
    }
  }

  const licoes = save.fasesConcluidas.length + save.eventosConcluidos.length;

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={estilos.conteudo}>
        <View style={{ gap: 6, alignItems: 'center' }}>
          <Selo texto="Por que reciclar?" />
          <Texto peso="extrabold" style={{ fontSize: 21, textAlign: 'center' }}>O lixo e o planeta 🌍</Texto>
          <Texto style={{ fontSize: 13, color: COR.textoSuave, textAlign: 'center' }}>
            Os números mostram o tamanho do problema, e o quanto a sua atitude conta.
          </Texto>
        </View>

        <View style={{ gap: 10 }}>
          <TituloSecao>📊 O lixo no Brasil</TituloSecao>
          <View style={estilos.grade}>
            {IMPACTO_STATS.map((s, i) => (
              <Gradiente key={i} classes={s.cor} style={[estilos.numero, i === 0 ? { width: '100%' } : { width: '48%' }]}>
                <Texto style={{ fontSize: 22 }}>{s.icone}</Texto>
                <Texto style={{ color: '#fff', marginTop: 4 }}>
                  <Texto peso="extrabold" style={{ fontSize: 24, color: '#fff' }}>{s.valor}</Texto>
                  <Texto peso="bold" style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)' }}> {s.unidade}</Texto>
                </Texto>
                <Texto style={{ fontSize: 12, color: 'rgba(255,255,255,0.92)', lineHeight: 17, marginTop: 2 }}>{s.texto}</Texto>
              </Gradiente>
            ))}
          </View>
          <Texto style={{ fontSize: 10, color: COR.textoFraco, lineHeight: 15 }}>
            Fontes: Panorama dos Resíduos Sólidos no Brasil 2025 (Abrema), dados de 2024; Abal e Abralatas (latas, 2024).
          </Texto>
        </View>

        <Gradiente cores={[COR.verdeEscuro, COR.verde]} style={estilos.porque}>
          <Texto peso="extrabold" style={{ fontSize: 15, color: '#fff' }}>Por que isso importa?</Texto>
          {MOTIVOS.map(([icone, titulo, texto]) => (
            <Texto key={titulo} style={{ fontSize: 13, color: '#ecfdf5', lineHeight: 19 }}>
              {icone} <Texto peso="extrabold" style={{ fontSize: 13, color: '#fff' }}>{titulo}</Texto> {texto}
            </Texto>
          ))}
        </Gradiente>

        <View style={{ gap: 10 }}>
          <TituloSecao>🚛 O caminho do reciclável</TituloSecao>
          <View style={estilos.caixaBranca}>
            {CAMINHO_DO_LIXO.map((passo, i) => (
              <View key={passo.titulo} style={{ flexDirection: 'row', gap: 12 }}>
                <View style={{ alignItems: 'center' }}>
                  <View style={estilos.passoIcone}>
                    <Texto style={{ fontSize: 20 }}>{passo.icone}</Texto>
                  </View>
                  {i < CAMINHO_DO_LIXO.length - 1 ? <View style={estilos.passoLinha} /> : null}
                </View>
                <View style={{ flex: 1, paddingTop: 4, paddingBottom: 8 }}>
                  <Texto peso="extrabold" style={{ fontSize: 13 }}>{i + 1}. {passo.titulo}</Texto>
                  <Texto style={{ fontSize: 12, color: COR.textoSuave }}>{passo.texto}</Texto>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={{ gap: 10 }}>
          <TituloSecao>🔁 Os 5 Rs (em ordem de importância)</TituloSecao>
          {CINCO_RS.map((item, i) => (
            <View key={item.r} style={estilos.linhaR}>
              <View style={estilos.iconeR}>
                <Texto style={{ fontSize: 18 }}>{item.icone}</Texto>
              </View>
              <View style={{ flex: 1 }}>
                <Texto peso="extrabold" style={{ fontSize: 13 }}>{i + 1}º {item.r}</Texto>
                <Texto style={{ fontSize: 12, color: COR.textoSuave }}>{item.texto}</Texto>
              </View>
            </View>
          ))}
        </View>

        <View style={{ gap: 10 }}>
          <TituloSecao>🤝 Meus compromissos</TituloSecao>
          <Texto style={{ fontSize: 12, color: COR.textoSuave }}>Toque para assumir. Cada compromisso novo vale +{XP_COMPROMISSO} XP.</Texto>
          {COMPROMISSOS.map((c) => {
            const ligado = save.compromissos.includes(c.id);
            return (
              <Tocavel
                key={c.id}
                onPress={() => alternar(c.id)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: ligado }}
                style={[estilos.compromisso, ligado && { backgroundColor: '#ecfdf5', borderColor: '#34d399' }]}
              >
                <Texto style={{ fontSize: 20 }}>{c.icone}</Texto>
                <Texto peso="bold" style={{ flex: 1, fontSize: 13, color: ligado ? '#064e3b' : COR.textoMedio }}>{c.texto}</Texto>
                <View style={[estilos.caixaMarcar, ligado && { backgroundColor: COR.esmeralda, borderColor: COR.esmeralda }]}>
                  {ligado ? <Texto peso="extrabold" style={{ color: '#fff', fontSize: 13 }}>✓</Texto> : null}
                </View>
              </Tocavel>
            );
          })}
        </View>

        <View style={estilos.resumo}>
          <Texto peso="bold" style={{ fontSize: 11, color: '#b45309', textAlign: 'center', letterSpacing: 0.6 }}>SEU IMPACTO NO ECOQUEST</Texto>
          <View style={{ flexDirection: 'row', marginTop: 8 }}>
            {[[save.totalAcertos, 'acertos'], [licoes, 'lições'], [`${save.compromissos.length}/${COMPROMISSOS.length}`, 'compromissos']].map(([n, r]) => (
              <View key={r} style={{ flex: 1, alignItems: 'center' }}>
                <Texto peso="extrabold" style={{ fontSize: 22, color: '#78350f' }}>{n}</Texto>
                <Texto style={{ fontSize: 11, color: '#92400e' }}>{r}</Texto>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      <Confete disparo={confete} quantidade={25} />
    </View>
  );
}

const estilos = StyleSheet.create({
  conteudo: { padding: 18, gap: 22, paddingBottom: 32 },
  grade: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 12 },
  numero: { borderRadius: 18, padding: 14 },
  porque: { borderRadius: 24, padding: 18, gap: 8 },
  caixaBranca: { backgroundColor: '#fff', borderColor: COR.borda, borderWidth: 2, borderRadius: 18, padding: 16 },
  passoIcone: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#d1fae5',
    borderColor: '#6ee7b7',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  passoLinha: { width: 4, flex: 1, minHeight: 14, backgroundColor: '#a7f3d0', borderRadius: 2, marginVertical: 4 },
  linhaR: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#fff',
    borderColor: COR.borda,
    borderWidth: 2,
    borderRadius: 16,
    padding: 12
  },
  iconeR: { width: 38, height: 38, borderRadius: 12, backgroundColor: '#ecfccb', alignItems: 'center', justifyContent: 'center' },
  compromisso: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#fff',
    borderColor: COR.borda,
    borderWidth: 2,
    borderRadius: 16,
    padding: 12
  },
  caixaMarcar: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center'
  },
  resumo: { backgroundColor: '#fffbeb', borderColor: '#fde68a', borderWidth: 1, borderRadius: 18, padding: 16 }
});

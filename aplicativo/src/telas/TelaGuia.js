import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Botao, Texto, Tocavel } from '../componentes';
import { COR } from '../tema';
import { lerCores } from '../cores';
import { GUIDE_DATABASE } from '../conteudo';

function Detalhes({ chave, onFechar, onTeste }) {
  const insets = useSafeAreaInsets();
  const item = GUIDE_DATABASE[chave];
  if (!item) return null;
  const cor = lerCores(item.colorBg).bg;

  return (
    <View style={estilos.fundoModal}>
      <Pressable style={StyleSheet.absoluteFill} onPress={onFechar} accessibilityLabel="Fechar" />
      <View style={[estilos.folha, { paddingBottom: insets.bottom + 16 }]}>
        <View style={estilos.alca} />
        <View style={estilos.topoFolha}>
          <Texto style={{ fontSize: 34 }}>{item.icon}</Texto>
          <View style={{ flex: 1, gap: 4 }}>
            <Texto peso="extrabold" style={{ fontSize: 18 }}>{item.title}</Texto>
            <View style={[estilos.tagCor, { backgroundColor: cor }]}>
              <Texto peso="extrabold" style={{ fontSize: 10, color: '#fff' }}>LIXEIRA {item.colorName.toUpperCase()}</Texto>
            </View>
          </View>
          <Pressable onPress={onFechar} hitSlop={12} accessibilityLabel="Fechar">
            <Feather name="x" size={24} color={COR.textoFraco} />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={{ gap: 12, paddingBottom: 8 }}>
          <View style={estilos.caixaCinza}>
            <Texto peso="bold" style={{ fontSize: 10, color: COR.textoSuave }}>TEMPO DE DECOMPOSIÇÃO</Texto>
            <Texto peso="extrabold" style={{ fontSize: 14 }}>{item.degradation}</Texto>
          </View>

          <View style={{ gap: 6 }}>
            <Texto peso="extrabold" style={{ fontSize: 13 }}>🧼 Como preparar para o descarte</Texto>
            <View style={estilos.caixaVerde}>
              <Texto style={{ fontSize: 13, color: '#022c22', lineHeight: 19 }}>{item.prep}</Texto>
            </View>
          </View>

          <View style={{ gap: 6 }}>
            <Texto peso="extrabold" style={{ fontSize: 13 }}>📋 O que pode e o que não pode</Texto>
            {item.rules.map((r, i) => (
              <View key={i} style={estilos.regra}>
                <Texto style={{ fontSize: 13, color: COR.textoMedio, lineHeight: 19 }}>{r}</Texto>
              </View>
            ))}
          </View>

          <View style={estilos.caixaAmarela}>
            <Texto style={{ fontSize: 13, color: '#78350f', lineHeight: 19 }}>
              <Texto peso="extrabold" style={{ fontSize: 13, color: '#78350f' }}>💡 Atenção: </Texto>
              {item.tip}
            </Texto>
          </View>
        </ScrollView>

        <Botao titulo="Fazer teste rápido deste lixo" icone="target" onPress={onTeste} style={{ marginTop: 8 }} />
        <Texto style={{ fontSize: 11, color: COR.textoSuave, textAlign: 'center', marginTop: 6 }}>
          Os testes do guia são treino: não gastam vidas.
        </Texto>
      </View>
    </View>
  );
}

export default function TelaGuia({ onTeste }) {
  const [aberto, setAberto] = useState(null);

  return (
    <>
      <ScrollView contentContainerStyle={estilos.conteudo}>
        <View style={{ gap: 4, alignItems: 'center' }}>
          <Texto peso="extrabold" style={{ fontSize: 21, textAlign: 'center' }}>Guia do Lixo Interativo 🎨</Texto>
          <Texto style={{ fontSize: 13, color: COR.textoSuave, textAlign: 'center' }}>
            Toque numa categoria para ver as regras e fazer um teste rápido!
          </Texto>
        </View>

        {Object.entries(GUIDE_DATABASE).map(([chave, item]) => (
          <Tocavel key={chave} onPress={() => setAberto(chave)} style={estilos.item} accessibilityLabel={item.title}>
            <View style={[estilos.iconeItem, { backgroundColor: lerCores(item.colorBg).bg }]}>
              <Texto style={{ fontSize: 24 }}>{item.icon}</Texto>
            </View>
            <View style={{ flex: 1, gap: 4 }}>
              <Texto peso="extrabold" style={{ fontSize: 14 }}>{item.title}</Texto>
              <View style={estilos.tagLixeira}>
                <Texto peso="extrabold" style={{ fontSize: 10, color: COR.textoSuave }}>LIXEIRA {item.colorName.toUpperCase()}</Texto>
              </View>
            </View>
            <Feather name="chevron-right" size={20} color={COR.verde} />
          </Tocavel>
        ))}

        <Texto style={{ fontSize: 11, color: COR.textoFraco, textAlign: 'center', lineHeight: 16 }}>
          Cores conforme a Resolução CONAMA nº 275/2001. Algumas cidades usam a coleta "seco x úmido": confira as regras da sua prefeitura.
        </Texto>
      </ScrollView>

      <Modal visible={!!aberto} transparent animationType="slide" onRequestClose={() => setAberto(null)} statusBarTranslucent>
        {aberto ? (
          <Detalhes
            chave={aberto}
            onFechar={() => setAberto(null)}
            onTeste={() => { const c = aberto; setAberto(null); onTeste(c); }}
          />
        ) : null}
      </Modal>
    </>
  );
}

const estilos = StyleSheet.create({
  conteudo: { padding: 18, gap: 12, paddingBottom: 32 },
  item: {
    backgroundColor: '#fff',
    borderColor: COR.borda,
    borderWidth: 2,
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  iconeItem: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  tagLixeira: { alignSelf: 'flex-start', backgroundColor: '#f1f5f9', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 },
  fundoModal: { flex: 1, backgroundColor: 'rgba(15,23,42,0.6)', justifyContent: 'flex-end' },
  folha: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 4,
    borderTopColor: COR.verde,
    paddingHorizontal: 20,
    paddingTop: 10,
    maxHeight: '88%'
  },
  alca: { alignSelf: 'center', width: 44, height: 5, borderRadius: 3, backgroundColor: COR.borda, marginBottom: 10 },
  topoFolha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingBottom: 12,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COR.borda
  },
  tagCor: { alignSelf: 'flex-start', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3 },
  caixaCinza: { backgroundColor: COR.fundo, borderColor: COR.borda, borderWidth: 1, borderRadius: 14, padding: 12, gap: 2 },
  caixaVerde: { backgroundColor: '#ecfdf5', borderColor: '#a7f3d0', borderWidth: 1, borderRadius: 14, padding: 12 },
  regra: { backgroundColor: '#f1f5f9', borderRadius: 12, padding: 10 },
  caixaAmarela: { backgroundColor: '#fffbeb', borderColor: '#fde68a', borderWidth: 1, borderRadius: 14, padding: 12 }
});

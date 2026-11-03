import { ScrollView, StyleSheet, View } from 'react-native';
import { Botao, Texto } from '../componentes';
import { COR } from '../tema';
import { MINUTOS_POR_VIDA, formatarTempo, msAteProximaVida } from '../jogo';

export default function TelaSemVidas({ save, agora, onGuia, onVoltar }) {
  return (
    <ScrollView contentContainerStyle={estilos.conteudo}>
      <Texto style={{ fontSize: 76 }}>💔</Texto>
      <View style={{ alignItems: 'center', gap: 4 }}>
        <Texto peso="extrabold" style={{ fontSize: 24, textAlign: 'center' }}>Suas vidas acabaram!</Texto>
        <Texto style={{ fontSize: 13, color: COR.textoSuave }}>Uma vida volta a cada {MINUTOS_POR_VIDA} minutos.</Texto>
      </View>

      <View style={estilos.contador}>
        <Texto peso="bold" style={{ fontSize: 11, color: '#be123c' }}>Próxima vida em</Texto>
        <Texto peso="extrabold" style={{ fontSize: 30, color: '#881337' }}>{formatarTempo(msAteProximaVida(save, agora))}</Texto>
      </View>

      <Texto style={{ fontSize: 13, color: COR.textoMedio, textAlign: 'center', lineHeight: 19, maxWidth: 320 }}>
        Enquanto isso, treine no <Texto peso="extrabold" style={{ fontSize: 13 }}>Guia Lixo</Texto>: os testes de lá não gastam vidas, e acertar tudo de primeira devolve 1 vida.
      </Texto>

      <View style={{ width: '100%', gap: 10 }}>
        <Botao titulo="Abrir o Guia Lixo" onPress={onGuia} />
        <Botao titulo="Voltar" onPress={onVoltar} cor="#fff" corDegrau={COR.borda} corTexto={COR.textoMedio} />
      </View>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  conteudo: { flexGrow: 1, padding: 22, gap: 18, alignItems: 'center', justifyContent: 'center' },
  contador: { backgroundColor: '#fff1f2', borderColor: '#fecdd3', borderWidth: 1, borderRadius: 18, paddingHorizontal: 22, paddingVertical: 12, alignItems: 'center' }
});

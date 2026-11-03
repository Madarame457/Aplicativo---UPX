import { ScrollView, StyleSheet, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Gradiente, Selo, Texto, Tocavel } from '../componentes';
import { COR } from '../tema';
import { EVENTS, LEVELS } from '../conteudo';
import { eventoLiberado, faseConcluida } from '../jogo';

export default function TelaEventos({ save, onEvento }) {
  const fasesFeitas = LEVELS.filter((f) => faseConcluida(save, f.id)).length;

  return (
    <ScrollView contentContainerStyle={estilos.conteudo}>
      <View style={{ gap: 6, alignItems: 'center' }}>
        <Selo texto="Desafios especiais" cor="#92400e" fundo="#fef3c7" borda="#fcd34d" />
        <Texto peso="extrabold" style={estilos.titulo}>Eventos e Desafios Virais 🏆</Texto>
        <Texto style={estilos.subtitulo}>Enfrente perguntas com os maiores memes da internet!</Texto>
      </View>

      {EVENTS.map((ev) => {
        const liberado = eventoLiberado(save, ev);
        const concluido = save.eventosConcluidos.includes(ev.id);

        if (!liberado) {
          return (
            <View key={ev.id} style={estilos.bloqueado}>
              <Texto style={{ fontSize: 34, opacity: 0.6 }}>🔒</Texto>
              <View style={{ flex: 1, gap: 2 }}>
                <Texto peso="extrabold" style={{ fontSize: 10, color: COR.textoSuave, letterSpacing: 0.6 }}>{ev.badge}</Texto>
                <Texto peso="bold" style={{ fontSize: 14, color: COR.textoSuave }}>{ev.title}</Texto>
                <Texto style={{ fontSize: 12, color: COR.textoSuave }}>{ev.subtitle} ({fasesFeitas}/{LEVELS.length})</Texto>
              </View>
            </View>
          );
        }

        return (
          <Tocavel key={ev.id} onPress={() => onEvento(ev.id)} accessibilityLabel={ev.title}>
            <Gradiente classes={ev.style} diagonal={false} style={estilos.cartao}>
              <Texto style={{ fontSize: 36 }}>{ev.icon}</Texto>
              <View style={{ flex: 1, gap: 3 }}>
                <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
                  <View style={estilos.etiqueta}>
                    <Texto peso="extrabold" style={{ fontSize: 10, color: '#fff' }}>{ev.badge}</Texto>
                  </View>
                  {concluido ? (
                    <View style={[estilos.etiqueta, { backgroundColor: COR.ouro }]}>
                      <Texto peso="extrabold" style={{ fontSize: 10, color: '#451a03' }}>✓ CONCLUÍDO</Texto>
                    </View>
                  ) : null}
                </View>
                <Texto peso="bold" style={{ fontSize: 15, color: '#fff' }}>{ev.title}</Texto>
                <Texto style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)' }}>{ev.subtitle}</Texto>
              </View>
              <Feather name="chevron-right" size={20} color="#fff" />
            </Gradiente>
          </Tocavel>
        );
      })}
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  conteudo: { padding: 18, gap: 14, paddingBottom: 32 },
  titulo: { fontSize: 21, textAlign: 'center' },
  subtitulo: { fontSize: 13, color: COR.textoSuave, textAlign: 'center' },
  cartao: { borderRadius: 20, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12 },
  etiqueta: { backgroundColor: 'rgba(255,255,255,0.22)', borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2 },
  bloqueado: {
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: COR.borda,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#cbd5e1'
  }
});

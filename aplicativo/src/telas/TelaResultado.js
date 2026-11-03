import { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Botao, CartaoFato, Confete, Pulando, Texto } from '../componentes';
import { COR } from '../tema';
import { FATOS } from '../conteudo';
import { tocar } from '../sons';

const VOLTAR = { learn: 'Voltar para a trilha', events: 'Voltar para os eventos', guide: 'Voltar para o guia' };

export default function TelaResultado({ resumo, voltarPara, onVoltar }) {
  const [confete, setConfete] = useState(0);
  const fato = useMemo(() => FATOS[Math.floor(Math.random() * FATOS.length)], []);

  useEffect(() => {
    tocar('vitoria');
    setConfete(Date.now());
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: COR.fundo }}>
      <ScrollView contentContainerStyle={estilos.conteudo}>
        <Pulando distancia={12} duracao={500}>
          <Texto style={{ fontSize: 76 }}>🏆</Texto>
        </Pulando>
        <View style={{ alignItems: 'center', gap: 4 }}>
          <Texto peso="extrabold" style={{ fontSize: 26 }}>{resumo.titulo}</Texto>
          <Texto style={{ fontSize: 13, color: COR.textoSuave }}>Você é um verdadeiro campeão da sustentabilidade!</Texto>
        </View>

        <View style={estilos.linha}>
          <View style={[estilos.caixa, { backgroundColor: '#fffbeb', borderColor: '#fde68a' }]}>
            <Texto peso="bold" style={[estilos.rotulo, { color: '#b45309' }]}>XP ganho</Texto>
            <Texto peso="extrabold" style={[estilos.valor, { color: '#78350f' }]}>+{resumo.xpTotal}</Texto>
          </View>
          <View style={[estilos.caixa, { backgroundColor: '#ecfdf5', borderColor: '#a7f3d0' }]}>
            <Texto peso="bold" style={[estilos.rotulo, { color: '#047857' }]}>Precisão</Texto>
            <Texto peso="extrabold" style={[estilos.valor, { color: '#064e3b' }]}>{resumo.precisao}%</Texto>
          </View>
          <View style={[estilos.caixa, { backgroundColor: '#fff7ed', borderColor: '#fed7aa' }]}>
            <Texto peso="bold" style={[estilos.rotulo, { color: '#c2410c' }]}>Ofensiva</Texto>
            <Texto peso="extrabold" style={[estilos.valor, { color: '#7c2d12' }]}>{resumo.ofensiva}d{resumo.ofensivaSubiu ? ' 🔥' : ''}</Texto>
          </View>
        </View>

        {resumo.mensagemExtra ? (
          <View style={estilos.mensagem}>
            <Texto peso="bold" style={{ fontSize: 13, color: COR.verde, textAlign: 'center' }}>{resumo.mensagemExtra}</Texto>
          </View>
        ) : null}

        {resumo.novoTitulo ? (
          <View style={[estilos.mensagem, { backgroundColor: '#fef3c7', borderColor: '#fcd34d' }]}>
            <Texto peso="extrabold" style={{ fontSize: 13, color: '#78350f', textAlign: 'center' }}>
              🎖️ Novo título: {resumo.novoTitulo.icone} {resumo.novoTitulo.titulo}!
            </Texto>
          </View>
        ) : null}

        <View style={{ width: '100%' }}>
          <CartaoFato fato={fato} />
        </View>

        <Botao titulo={VOLTAR[voltarPara] || 'Continuar'} onPress={onVoltar} style={{ width: '100%' }} />
      </ScrollView>
      <Confete disparo={confete} quantidade={70} />
    </View>
  );
}

const estilos = StyleSheet.create({
  conteudo: { flexGrow: 1, padding: 22, gap: 18, alignItems: 'center', justifyContent: 'center' },
  linha: { flexDirection: 'row', gap: 8, width: '100%' },
  caixa: { flex: 1, borderWidth: 1, borderRadius: 18, paddingVertical: 12, alignItems: 'center' },
  rotulo: { fontSize: 11 },
  valor: { fontSize: 20 },
  mensagem: { width: '100%', backgroundColor: '#ecfdf5', borderColor: '#a7f3d0', borderWidth: 1, borderRadius: 14, padding: 10 }
});

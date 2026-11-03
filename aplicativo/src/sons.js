/* =========================================================
   Sons e vibração
   ========================================================= */
import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';
import * as Haptics from 'expo-haptics';

const ARQUIVOS = {
  acerto: require('../assets/sons/acerto.wav'),
  erro: require('../assets/sons/erro.wav'),
  vitoria: require('../assets/sons/vitoria.wav')
};

let tocadores = null;
let somLigado = true;

function preparar() {
  if (tocadores) return;
  tocadores = {};
  try {
    setAudioModeAsync({ playsInSilentMode: true, interruptionMode: 'mixWithOthers' }).catch(() => {});
    Object.entries(ARQUIVOS).forEach(([nome, arquivo]) => {
      tocadores[nome] = createAudioPlayer(arquivo);
    });
  } catch (e) {
    // Sem áudio neste aparelho: o jogo continua sem som
  }
}

export function definirSom(ligado) {
  somLigado = ligado;
}

export function tocar(nome) {
  vibrar(nome);
  if (!somLigado) return;
  preparar();
  const tocador = tocadores[nome];
  if (!tocador) return;
  try {
    tocador.seekTo(0);
    tocador.play();
  } catch (e) {
    // ignora falhas de áudio
  }
}

export function vibrar(tipo) {
  try {
    if (tipo === 'acerto' || tipo === 'vitoria') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    } else if (tipo === 'erro') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
    } else {
      Haptics.selectionAsync().catch(() => {});
    }
  } catch (e) {
    // aparelho sem vibração
  }
}

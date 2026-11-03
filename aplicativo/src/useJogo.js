/* =========================================================
   Guarda o progresso do jogador no celular (AsyncStorage)
   e atualiza as vidas com o passar do tempo.
   ========================================================= */
import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { completarSave, recarregarVidas, saveInicial, MAX_VIDAS } from './jogo';
import { definirSom } from './sons';

const CHAVE = 'ecoquest_save_v1';

export function useJogo() {
  const [save, setSave] = useState(null);     // null = ainda carregando
  const [agora, setAgora] = useState(Date.now());
  const saveRef = useRef(null);
  saveRef.current = save;

  // Carrega o progresso salvo
  useEffect(() => {
    AsyncStorage.getItem(CHAVE)
      .then((texto) => {
        let salvo = null;
        try { salvo = JSON.parse(texto); } catch (e) { salvo = null; }
        setSave(recarregarVidas(completarSave(salvo)));
      })
      .catch(() => setSave(saveInicial()));
  }, []);

  // Salva sempre que algo muda
  useEffect(() => {
    if (!save) return;
    definirSom(save.som);
    AsyncStorage.setItem(CHAVE, JSON.stringify(save)).catch(() => {});
  }, [save]);

  // Relógio: só atualiza a tela quando falta vida (para o contador)
  const tique = useCallback(() => {
    const atual = saveRef.current;
    if (!atual) return;
    const n = Date.now();
    if (atual.vidas < MAX_VIDAS) {
      setAgora(n);
      setSave((s) => (s ? recarregarVidas(s, n) : s));
    }
  }, []);

  useEffect(() => {
    const t = setInterval(tique, 1000);
    const sub = AppState.addEventListener('change', (estado) => {
      if (estado === 'active') tique();
    });
    return () => {
      clearInterval(t);
      sub.remove();
    };
  }, [tique]);

  // atualizar(save => novoSave)
  const atualizar = useCallback((fn) => setSave((s) => (s ? fn(s) : s)), []);

  return { save, agora, atualizar };
}

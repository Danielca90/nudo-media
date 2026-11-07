import React from 'react';
import {aplicarTema, TemaId} from './tema';

// Aplica el tema antes de que rendericen los hijos (cada composición renderiza sola en su página)
export const ConTema: React.FC<{k: TemaId; children: React.ReactNode}> = ({k, children}) => {
  aplicarTema(k);
  return <>{children}</>;
};
export const conTema = (k: TemaId, Comp: React.FC): React.FC => () => (
  <ConTema k={k}>
    <Comp />
  </ConTema>
);

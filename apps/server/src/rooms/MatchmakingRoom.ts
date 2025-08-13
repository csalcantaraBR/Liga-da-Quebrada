import { Room, Client } from 'colyseus';
import { MatchmakingState, Player } from '../types/rooms';

export class MatchmakingRoom extends Room<MatchmakingState> {
  private matchmakingTimeout: NodeJS.Timeout | null = null;

  onCreate(options: any) {
    console.log('🎯 [MatchmakingRoom] onCreate - Criando sala de matchmaking:', options);
    
    this.setState({
      players: [],
      status: 'waiting',
      createdAt: new Date(),
      maxPlayers: options.maxPlayers || 2
    });

    console.log('📊 [MatchmakingRoom] onCreate - Estado inicial:', {
      status: this.state.status,
      maxPlayers: this.state.maxPlayers
    });

    // Configurar handlers de mensagem
    this.onMessage('ready', (client) => {
      console.log('📨 [MatchmakingRoom] Mensagem "ready" recebida de:', client.sessionId);
      this.handleReady(client);
    });
    this.onMessage('cancel', (client) => {
      console.log('📨 [MatchmakingRoom] Mensagem "cancel" recebida de:', client.sessionId);
      this.handleCancel(client);
    });
    this.onMessage('find-match', (client) => {
      console.log('📨 [MatchmakingRoom] Mensagem "find-match" recebida de:', client.sessionId);
      this.handleFindMatch();
    });
  }

  onJoin(client: Client, options: any) {
    console.log(client.sessionId, 'joined matchmaking!');

    // Verificar se a sala está cheia
    if (this.state.players.length >= this.state.maxPlayers) {
      throw new Error('Sala cheia');
    }

    // Verificar se o jogador já está na sala (reconexão)
    const existingPlayer = this.state.players.find(p => p.sessionId === client.sessionId);
    if (existingPlayer) {
      return; // Jogador já está na sala
    }

    // Criar jogador
    const player: Player = {
      sessionId: client.sessionId,
      userId: client.userData?.userId || client.sessionId,
      username: client.userData?.username || 'Player',
      faction: options.faction || 'roda-de-ginga',
      status: 'ready',
      joinedAt: new Date()
    };

    // Adicionar jogador à fila
    this.state.players.push(player);

    // Verificar se há jogadores suficientes para matchmaking
    if (this.state.players.length >= 2) {
      this.startMatchmaking();
    }
  }

  onLeave(client: Client) {
    console.log(client.sessionId, 'left matchmaking!');

    // Remover jogador da fila
    this.state.players = this.state.players.filter(
      p => p.sessionId !== client.sessionId
    );

    // Resetar status se não há jogadores suficientes
    if (this.state.players.length < 2) {
      this.state.status = 'waiting';
      if (this.matchmakingTimeout) {
        clearTimeout(this.matchmakingTimeout);
        this.matchmakingTimeout = null;
      }
    }
  }

  onDispose() {
    console.log('MatchmakingRoom disposed!');
    if (this.matchmakingTimeout) {
      clearTimeout(this.matchmakingTimeout);
    }
  }

  private handleReady(client: Client) {
    const player = this.state.players.find(p => p.sessionId === client.sessionId);
    if (player) {
      player.status = 'ready';
    }
  }

  private handleCancel(client: Client) {
    console.log('🚫 [MatchmakingRoom] handleCancel - Cancelamento de:', client.sessionId);
    console.log('📊 [MatchmakingRoom] handleCancel - Estado antes:', {
      players: this.state.players.length,
      status: this.state.status
    });
    
    // Remover jogador da fila
    this.state.players = this.state.players.filter(
      p => p.sessionId !== client.sessionId
    );

    // Resetar status
    this.state.status = 'waiting';
    if (this.matchmakingTimeout) {
      clearTimeout(this.matchmakingTimeout);
      this.matchmakingTimeout = null;
    }

    console.log('✅ [MatchmakingRoom] handleCancel - Jogador removido:', {
      players: this.state.players.length,
      status: this.state.status
    });
  }

  private handleFindMatch() {
    this.startMatchmaking();
  }

  private startMatchmaking() {
    console.log('🔍 [MatchmakingRoom] startMatchmaking - Iniciando matchmaking');
    console.log('📊 [MatchmakingRoom] startMatchmaking - Estado atual:', {
      players: this.state.players.length,
      status: this.state.status
    });
    
    if (this.state.players.length < 2) {
      console.log('❌ [MatchmakingRoom] startMatchmaking - Jogadores insuficientes');
      return;
    }

    this.state.status = 'matching';
    console.log('✅ [MatchmakingRoom] startMatchmaking - Status alterado para "matching"');

    // Simular processo de matchmaking
    this.matchmakingTimeout = setTimeout(() => {
      console.log('⏰ [MatchmakingRoom] startMatchmaking - Timeout atingido, criando sala de jogo');
      this.createGameRoom();
    }, 1000);
  }

  private createGameRoom() {
    console.log('🎮 [MatchmakingRoom] createGameRoom - Criando sala de jogo');
    console.log('📊 [MatchmakingRoom] createGameRoom - Estado atual:', {
      players: this.state.players.length,
      status: this.state.status
    });
    
    if (this.state.players.length < 2) {
      console.log('❌ [MatchmakingRoom] createGameRoom - Jogadores insuficientes');
      this.state.status = 'waiting';
      return;
    }

    // Gerar ID da sala de jogo
    const gameRoomId = `game-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    this.state.gameRoomId = gameRoomId;
    this.state.status = 'matched';

    console.log('✅ [MatchmakingRoom] createGameRoom - Sala criada:', {
      gameRoomId,
      status: this.state.status
    });

    // Notificar jogadores sobre o match
    this.broadcast('match-found', {
      gameRoomId,
      players: this.state.players
    });

    // Transferir jogadores para a sala de jogo após um delay
    setTimeout(() => {
      this.state.players.forEach(player => {
        const client = this.clients.find(c => c.sessionId === player.sessionId);
        if (client) {
          client.send('join-game', { gameRoomId });
        }
      });
    }, 2000);
  }

  public handlePlayerTimeout(sessionId: string) {
    this.state.players = this.state.players.filter(p => p.sessionId !== sessionId);
    
    if (this.state.players.length < 2) {
      this.state.status = 'waiting';
      if (this.matchmakingTimeout) {
        clearTimeout(this.matchmakingTimeout);
        this.matchmakingTimeout = null;
      }
    }
  }

  // Método público para testes
  public startMatchmakingForTest() {
    this.startMatchmaking();
  }

  // Método para testes - simular matchmaking imediato
  public simulateMatchmaking() {
    if (this.state.players.length >= 2) {
      this.state.status = 'matching';
      this.createGameRoom();
    }
  }

  // Método para testes - simular cancelamento
  public simulateCancel(sessionId: string) {
    this.handleCancel({ sessionId } as any);
  }

  // Método para testes - simular mensagens
  public simulateMessage(client: Client, message: any) {
    console.log('🧪 [MatchmakingRoom] simulateMessage - Simulando mensagem:', {
      clientId: client.sessionId,
      messageType: message.type
    });
    
    // Chamar o handler apropriado baseado no tipo da mensagem
    switch (message.type) {
      case 'ready':
        this.handleReady(client);
        break;
      case 'cancel':
        this.handleCancel(client);
        break;
      case 'find-match':
        this.handleFindMatch();
        break;
      default:
        console.log('❌ [MatchmakingRoom] simulateMessage - Tipo de mensagem desconhecido:', message.type);
    }
  }
}

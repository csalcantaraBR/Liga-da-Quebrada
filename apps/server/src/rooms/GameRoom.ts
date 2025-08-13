import { Room, Client } from 'colyseus';
import { GameState, GamePlayer, GameMessage, RoundResult } from '../types/rooms';

export class GameRoom extends Room<GameState> {
  private gameTimeout: NodeJS.Timeout | null = null;
  private readyPlayers: Set<string> = new Set();

  onCreate(options: any) {
    console.log('🎮 [GameRoom] onCreate - Iniciando criação da sala:', options);
    
    // Inicializar estado do jogo
    this.setState({
      round: 1,
      maxRounds: 4,
      status: 'preparing',
      players: [],
      currentTurn: '',
      roundHistory: [],
      createdAt: new Date()
    });

    // Se as opções contêm jogadores pré-definidos, criá-los
    if (options.player1 && options.player2) {
      console.log('👥 [GameRoom] onCreate - Criando jogadores pré-definidos');
      
      const player1: GamePlayer = {
        sessionId: options.player1.sessionId,
        userId: options.player1.sessionId,
        username: 'Player 1',
        faction: options.player1.faction,
        respect: 12,
        energy: 8,
        hand: [],
        effects: [],
        isReady: false // Não marcar como pronto automaticamente
      };

      const player2: GamePlayer = {
        sessionId: options.player2.sessionId,
        userId: options.player2.sessionId,
        username: 'Player 2',
        faction: options.player2.faction,
        respect: 12,
        energy: 8,
        hand: [],
        effects: [],
        isReady: false // Não marcar como pronto automaticamente
      };

      this.state.players.push(player1, player2);
      this.state.currentTurn = player1.sessionId;
      
      console.log('✅ [GameRoom] onCreate - Jogadores criados');
      console.log('📊 [GameRoom] onCreate - Estado atual:', {
        players: this.state.players.length,
        readyPlayers: this.readyPlayers.size,
        currentTurn: this.state.currentTurn,
        status: this.state.status
      });
    }

    // Configurar handlers de mensagem
    this.onMessage('ready', (client, message) => {
      console.log('📨 [GameRoom] Mensagem "ready" recebida de:', client.sessionId);
      this.handleReady(client, message);
    });
    this.onMessage('play-card', (client, message) => {
      console.log('📨 [GameRoom] Mensagem "play-card" recebida de:', client.sessionId);
      this.handlePlayCard(client, message);
    });
    this.onMessage('end-turn', (client, message) => {
      console.log('📨 [GameRoom] Mensagem "end-turn" recebida de:', client.sessionId);
      this.handleEndTurn(client, message);
    });
    this.onMessage('concede', (client, message) => {
      console.log('📨 [GameRoom] Mensagem "concede" recebida de:', client.sessionId);
      this.handleConcede(client, message);
    });
    
    console.log('🎮 [GameRoom] onCreate - Sala criada com sucesso');
  }

  onJoin(client: Client, options: any) {
    console.log(client.sessionId, 'joined game!');

    // Se o jogador já existe (criado no onCreate), apenas atualizar dados
    const existingPlayer = this.state.players.find(p => p.sessionId === client.sessionId);
    if (existingPlayer) {
      existingPlayer.userId = client.userData?.userId || client.sessionId;
      existingPlayer.username = client.userData?.username || 'Player';
      return;
    }

    // Criar jogador se não existir
    const player: GamePlayer = {
      sessionId: client.sessionId,
      userId: client.userData?.userId || client.sessionId,
      username: client.userData?.username || 'Player',
      faction: options.faction || 'roda-de-ginga',
      respect: 12,
      energy: 8,
      hand: [],
      effects: [],
      isReady: false
    };

    // Adicionar jogador ao estado
    this.state.players.push(player);

    // Verificar se ambos os jogadores estão presentes
    if (this.state.players.length === 2 && !this.state.currentTurn) {
      this.state.currentTurn = this.state.players[0].sessionId;
    }
  }

  onLeave(client: Client, consented: boolean) {
    console.log(client.sessionId, 'left game!');

    // Se o jogo não terminou, finalizar com vitória do oponente
    if (this.state.status === 'playing' || this.state.status === 'preparing') {
      const remainingPlayer = this.state.players.find(p => p.sessionId !== client.sessionId);
      if (remainingPlayer) {
        this.state.winner = remainingPlayer.sessionId;
        this.state.status = 'finished';
      }
    }

    // Remover jogador do estado
    this.state.players = this.state.players.filter(p => p.sessionId !== client.sessionId);
  }

  onDispose() {
    console.log('GameRoom disposed!');
    if (this.gameTimeout) {
      clearTimeout(this.gameTimeout);
    }
  }

  private handleReady(client: Client, message: GameMessage) {
    console.log('✅ [GameRoom] handleReady - Recebido de:', client.sessionId);
    console.log('📊 [GameRoom] handleReady - Estado atual:', {
      status: this.state.status,
      readyPlayers: this.readyPlayers.size
    });
    
    const player = this.state.players.find(p => p.sessionId === client.sessionId);
    if (player) {
      player.isReady = true;
      this.readyPlayers.add(client.sessionId);

      console.log('✅ [GameRoom] handleReady - Jogador marcado como pronto:', {
        playerId: client.sessionId,
        readyPlayers: this.readyPlayers.size
      });

      // Verificar se ambos os jogadores estão prontos
      if (this.readyPlayers.size === 2) {
        console.log('🚀 [GameRoom] handleReady - Ambos os jogadores prontos, iniciando jogo');
        this.startGame();
      }
    } else {
      console.log('❌ [GameRoom] handleReady - Jogador não encontrado:', client.sessionId);
    }
  }

  private handlePlayCard(client: Client, message: GameMessage) {
    if (this.state.status !== 'playing') return;
    if (this.state.currentTurn !== client.sessionId) return;

    const player = this.state.players.find(p => p.sessionId === client.sessionId);
    const target = this.state.players.find(p => p.sessionId === message.data?.target);

    if (player && target && message.data?.damage) {
      // Aplicar dano
      target.respect = Math.max(0, target.respect - message.data.damage);
      
      // Verificar se o alvo foi derrotado
      if (target.respect <= 0) {
        this.endGame(client.sessionId);
      }
    }
  }

  private handleEndTurn(client: Client, message: GameMessage) {
    console.log('🔄 [GameRoom] handleEndTurn - Recebido de:', client.sessionId);
    console.log('📊 [GameRoom] handleEndTurn - Estado atual:', {
      currentTurn: this.state.currentTurn,
      round: this.state.round,
      status: this.state.status
    });
    
    // Verificar se é o turno do jogador
    if (this.state.currentTurn !== client.sessionId) {
      console.log('❌ [GameRoom] handleEndTurn - Não é o turno do jogador');
      return;
    }

    // Alternar turno
    const currentPlayerIndex = this.state.players.findIndex(p => p.sessionId === client.sessionId);
    const nextPlayerIndex = (currentPlayerIndex + 1) % this.state.players.length;
    const previousTurn = this.state.currentTurn;
    this.state.currentTurn = this.state.players[nextPlayerIndex].sessionId;

    console.log('🔄 [GameRoom] handleEndTurn - Turno alternado:', {
      from: previousTurn,
      to: this.state.currentTurn,
      currentPlayerIndex,
      nextPlayerIndex
    });

    // Se voltou para o primeiro jogador, avançar rodada
    if (nextPlayerIndex === 0) {
      console.log('📈 [GameRoom] handleEndTurn - Avançando rodada');
      this.advanceRound();
    }
  }

  private handleConcede(client: Client, message: GameMessage) {
    console.log('🏳️ [GameRoom] handleConcede - Concessão de:', client.sessionId);
    console.log('📊 [GameRoom] handleConcede - Estado atual:', {
      status: this.state.status,
      winner: this.state.winner
    });
    
    const opponent = this.state.players.find(p => p.sessionId !== client.sessionId);
    if (opponent) {
      console.log('✅ [GameRoom] handleConcede - Oponente encontrado:', opponent.sessionId);
      this.endGame(opponent.sessionId);
    } else {
      console.log('❌ [GameRoom] handleConcede - Oponente não encontrado');
    }
  }

  private startGame() {
    console.log('🚀 [GameRoom] startGame - Iniciando jogo');
    console.log('📊 [GameRoom] startGame - Estado antes:', {
      status: this.state.status,
      players: this.state.players.length,
      readyPlayers: this.readyPlayers.size,
      currentTurn: this.state.currentTurn
    });
    
    this.state.status = 'playing';
    this.state.currentTurn = this.state.players[0].sessionId;
    
    console.log('✅ [GameRoom] startGame - Jogo iniciado:', {
      status: this.state.status,
      currentTurn: this.state.currentTurn
    });
    
    // Configurar timeout do jogo (30 minutos)
    this.gameTimeout = setTimeout(() => {
      this.endGameByTimeout();
    }, 30 * 60 * 1000);
  }

  private advanceRound() {
    console.log('📈 [GameRoom] advanceRound - Avançando rodada');
    console.log('📊 [GameRoom] advanceRound - Estado antes:', {
      round: this.state.round,
      maxRounds: this.state.maxRounds,
      roundHistoryLength: this.state.roundHistory.length
    });
    
    this.state.round++;
    
    // Registrar resultado da rodada
    const roundResult: RoundResult = {
      round: this.state.round - 1,
      player1Action: 'end-turn',
      player2Action: 'end-turn',
      player1Damage: 0,
      player2Damage: 0
    };
    this.state.roundHistory.push(roundResult);
    
    console.log('📝 [GameRoom] advanceRound - Rodada registrada:', roundResult);
    
    // Verificar se o jogo terminou
    if (this.state.round >= this.state.maxRounds) {
      console.log('🏁 [GameRoom] advanceRound - Jogo terminou por rodadas');
      this.endGameByRounds();
    } else {
      console.log('⚡ [GameRoom] advanceRound - Regenerando energia dos jogadores');
      // Regenerar energia dos jogadores
      this.state.players.forEach(player => {
        player.energy = Math.min(8, player.energy + 2);
      });
    }
    
    console.log('📊 [GameRoom] advanceRound - Estado após:', {
      round: this.state.round,
      roundHistoryLength: this.state.roundHistory.length
    });
  }

  private endGameByRounds() {
    // Determinar vencedor por pontos de respeito
    const player1 = this.state.players[0];
    const player2 = this.state.players[1];
    
    if (player1.respect > player2.respect) {
      this.endGame(player1.sessionId);
    } else if (player2.respect > player1.respect) {
      this.endGame(player2.sessionId);
    } else {
      // Empate - vencedor aleatório
      const winner = Math.random() < 0.5 ? player1.sessionId : player2.sessionId;
      this.endGame(winner);
    }
  }

  private endGame(winnerSessionId: string) {
    console.log('🏁 [GameRoom] endGame - Finalizando jogo');
    console.log('📊 [GameRoom] endGame - Estado antes:', {
      status: this.state.status,
      winner: this.state.winner
    });
    
    this.state.winner = winnerSessionId;
    this.state.status = 'finished';
    
    console.log('✅ [GameRoom] endGame - Jogo finalizado:', {
      status: this.state.status,
      winner: this.state.winner
    });
    
    if (this.gameTimeout) {
      clearTimeout(this.gameTimeout);
    }

    // Notificar jogadores sobre o fim do jogo
    this.broadcast('game-ended', {
      winner: winnerSessionId,
      finalState: this.state
    });
  }

  private endGameByTimeout() {
    // Determinar vencedor por pontos de respeito
    const player1 = this.state.players[0];
    const player2 = this.state.players[1];
    
    if (player1.respect > player2.respect) {
      this.endGame(player1.sessionId);
    } else if (player2.respect > player1.respect) {
      this.endGame(player2.sessionId);
    } else {
      // Empate - vencedor aleatório
      const winner = Math.random() < 0.5 ? player1.sessionId : player2.sessionId;
      this.endGame(winner);
    }
  }

  // Método para testes
  public simulateGameEnd(winnerSessionId: string) {
    this.endGame(winnerSessionId);
  }

  // Método para testes - simular jogo completo
  public simulateCompleteGame() {
    // Simular jogadores prontos
    this.state.players.forEach(player => {
      player.isReady = true;
      this.readyPlayers.add(player.sessionId);
    });
    
    // Iniciar jogo
    this.startGame();
    
    // Simular 4 rodadas completas
    for (let i = 0; i < 4; i++) {
      this.state.players.forEach(player => {
        this.handleEndTurn({ sessionId: player.sessionId } as any, { type: 'end-turn' });
      });
    }
  }

  // Método para testes - simular jogadores prontos
  public simulatePlayersReady() {
    this.state.players.forEach(player => {
      player.isReady = true;
      this.readyPlayers.add(player.sessionId);
    });
    
    if (this.readyPlayers.size === 2) {
      this.startGame();
    }
  }

  // Método para testes - simular dano
  public simulateDamage(targetSessionId: string, damage: number) {
    const target = this.state.players.find(p => p.sessionId === targetSessionId);
    if (target) {
      target.respect = Math.max(0, target.respect - damage);
    }
  }

  // Método para testes - simular mensagens
  public simulateMessage(client: Client, message: any) {
    console.log('🧪 [GameRoom] simulateMessage - Simulando mensagem:', {
      clientId: client.sessionId,
      messageType: message.type
    });
    
    // Chamar o handler apropriado baseado no tipo da mensagem
    switch (message.type) {
      case 'ready':
        this.handleReady(client, message);
        break;
      case 'play-card':
        this.handlePlayCard(client, message);
        break;
      case 'end-turn':
        this.handleEndTurn(client, message);
        break;
      case 'concede':
        this.handleConcede(client, message);
        break;
      default:
        console.log('❌ [GameRoom] simulateMessage - Tipo de mensagem desconhecido:', message.type);
    }
  }
}

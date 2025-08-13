import React, { useState } from 'react';
import { useProfile } from '../hooks/useProfile';
import { Faction, Achievement } from '../game/types';

interface ProfileStatsProps {
  className?: string;
}

const FACTION_NAMES: Record<Faction, string> = {
  'roda-de-ginga': 'Roda de Ginga',
  'motofrete-uniao': 'Motofrete União',
  'crew-do-graffiti': 'Crew do Graffiti',
  'bateria-central': 'Bateria Central',
  'guardioes-do-verde': 'Guardioes do Verde',
  'vaqueiros-do-sertao': 'Vaqueiros do Sertão'
};

const FACTION_COLORS: Record<Faction, string> = {
  'roda-de-ginga': 'bg-yellow-600',
  'motofrete-uniao': 'bg-blue-600',
  'crew-do-graffiti': 'bg-purple-600',
  'bateria-central': 'bg-red-600',
  'guardioes-do-verde': 'bg-green-600',
  'vaqueiros-do-sertao': 'bg-orange-600'
};

const ACHIEVEMENT_CATEGORIES = [
  { id: 'combat', name: 'Combate', icon: '⚔️' },
  { id: 'progression', name: 'Progressão', icon: '📈' },
  { id: 'collection', name: 'Coleção', icon: '🃏' },
  { id: 'social', name: 'Social', icon: '👥' }
] as const;

export function ProfileStats({ className = '' }: ProfileStatsProps) {
  const {
    profile,
    isLoading,
    error,
    updateUsername,
    updateFavoriteFaction,
    saveProfile,
    getXPNeededForNextLevel,
    getLevelProgress,
    getRankRequirements,
    getAchievementsByCategory,
    getAchievementProgress,
    getFactionStatistics,
    getRecentGames,
    resetProfile
  } = useProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [editUsername, setEditUsername] = useState(profile.username);
  const [selectedAchievementCategory, setSelectedAchievementCategory] = useState<Achievement['category']>('combat');
  const [showResetConfirmation, setShowResetConfirmation] = useState(false);

  const handleSaveProfile = () => {
    updateUsername(editUsername);
    saveProfile();
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditUsername(profile.username);
    setIsEditing(false);
  };

  const handleResetProfile = () => {
    resetProfile();
    setShowResetConfirmation(false);
  };

  const formatXP = (xp: number) => {
    return xp.toLocaleString();
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center min-h-64 ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-300">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-red-600 text-white p-4 rounded-lg text-center ${className}`}>
        {error}
      </div>
    );
  }

  return (
    <div className={`max-w-6xl mx-auto p-6 ${className}`}>
      {/* Título */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Perfil do Jogador</h1>
        <p className="text-gray-300">Gerencie suas estatísticas e conquistas</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Coluna da Esquerda - Informações Básicas */}
        <div className="space-y-6">
          {/* Informações do Jogador */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-white">Informações</h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition duration-300"
                >
                  Editar Perfil
                </button>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Nome de Usuário</label>
                  <input
                    type="text"
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value)}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm mb-2">Facção Favorita</label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(FACTION_NAMES).map(([faction, name]) => (
                      <button
                        key={faction}
                        onClick={() => updateFavoriteFaction(faction as Faction)}
                        className={`p-2 rounded text-sm font-medium transition duration-300 ${
                          profile.favoriteFaction === faction
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleSaveProfile}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition duration-300"
                  >
                    Salvar
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition duration-300"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <span className="text-gray-300">Nome:</span>
                  <span className="text-white font-semibold ml-2">{profile.username}</span>
                </div>
                <div>
                  <span className="text-gray-300">Facção Favorita:</span>
                  <span className="text-white font-semibold ml-2">
                    {profile.favoriteFaction ? FACTION_NAMES[profile.favoriteFaction] : 'Nenhuma'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-300">Membro desde:</span>
                  <span className="text-white font-semibold ml-2">{formatDate(profile.createdAt)}</span>
                </div>
                <div>
                  <span className="text-gray-300">Última atividade:</span>
                  <span className="text-white font-semibold ml-2">{formatDate(profile.lastActive)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Nível e Ranking */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-white mb-4">Nível e Ranking</h2>
            
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">Nível {profile.level}</div>
                <div className="text-2xl font-bold text-yellow-400 mb-2">{profile.rank}</div>
                <div className="text-gray-300">{formatXP(profile.xp)} XP</div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Progresso do Nível</span>
                  <span className="text-white">{getLevelProgress()}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getLevelProgress()}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-400 text-center">
                  {getXPNeededForNextLevel()} XP restantes
                </div>
              </div>

              <div className="bg-gray-700 p-3 rounded">
                <div className="text-sm text-gray-300">Próximo Rank: {getRankRequirements().next}</div>
                <div className="text-sm text-gray-300">Nível Necessário: {getRankRequirements().levelNeeded}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Coluna do Meio - Estatísticas */}
        <div className="space-y-6">
          {/* Estatísticas de Jogo */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-white mb-4">Estatísticas de Jogo</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-700 p-4 rounded text-center">
                <div className="text-2xl font-bold text-white">{profile.totalGames}</div>
                <div className="text-gray-300 text-sm">Total de Jogos</div>
              </div>
              <div className="bg-gray-700 p-4 rounded text-center">
                <div className="text-2xl font-bold text-green-400">{profile.wins}</div>
                <div className="text-gray-300 text-sm">Vitórias</div>
              </div>
              <div className="bg-gray-700 p-4 rounded text-center">
                <div className="text-2xl font-bold text-red-400">{profile.losses}</div>
                <div className="text-gray-300 text-sm">Derrotas</div>
              </div>
              <div className="bg-gray-700 p-4 rounded text-center">
                <div className="text-2xl font-bold text-yellow-400">{profile.draws}</div>
                <div className="text-gray-300 text-sm">Empates</div>
              </div>
            </div>

            <div className="mt-4 bg-gray-700 p-4 rounded text-center">
              <div className="text-3xl font-bold text-white">{profile.winRate}%</div>
              <div className="text-gray-300 text-sm">Taxa de Vitória</div>
            </div>
          </div>

          {/* Estatísticas por Facção */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-white mb-4">Estatísticas por Facção</h2>
            
            <div className="space-y-3">
              {Object.entries(getFactionStatistics()).map(([faction, stats]) => (
                <div key={faction} className="bg-gray-700 p-3 rounded">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-semibold">{FACTION_NAMES[faction as Faction]}</span>
                    <span className="text-gray-300 text-sm">{stats.games} jogos</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-green-400">{stats.wins} vitórias</span>
                    <span className="text-red-400">{stats.losses} derrotas</span>
                    <span className="text-yellow-400">{stats.draws} empates</span>
                    <span className="text-white font-semibold">{stats.winRate}% vitórias</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Coluna da Direita - Conquistas e Histórico */}
        <div className="space-y-6">
          {/* Conquistas */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-white mb-4">Conquistas</h2>
            
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-300">Progresso</span>
                <span className="text-white font-semibold">
                  {getAchievementProgress().unlocked}/{getAchievementProgress().total}
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getAchievementProgress().percentage}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-400 text-center mt-1">
                {getAchievementProgress().percentage}% completo
              </div>
            </div>

            <div className="flex space-x-1 mb-4">
              {ACHIEVEMENT_CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedAchievementCategory(category.id)}
                  className={`flex-1 p-2 rounded text-sm font-medium transition duration-300 ${
                    selectedAchievementCategory === category.id
                      ? 'bg-yellow-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-lg">{category.icon}</div>
                    <div className="text-xs">{category.name}</div>
                  </div>
                </button>
              ))}
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {getAchievementsByCategory(selectedAchievementCategory).map((achievement) => (
                <div key={achievement.id} className="bg-gray-700 p-3 rounded flex items-center">
                  <div className="text-2xl mr-3">{achievement.icon}</div>
                  <div className="flex-1">
                    <div className="text-white font-semibold">{achievement.name}</div>
                    <div className="text-gray-300 text-sm">{achievement.description}</div>
                    <div className="text-gray-400 text-xs">
                      Desbloqueado em {formatDate(achievement.unlockedAt)}
                    </div>
                  </div>
                </div>
              ))}
              
              {getAchievementsByCategory(selectedAchievementCategory).length === 0 && (
                <div className="text-center text-gray-400 py-4">
                  Nenhuma conquista desbloqueada nesta categoria
                </div>
              )}
            </div>
          </div>

          {/* Jogos Recentes */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-white mb-4">Jogos Recentes</h2>
            
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {getRecentGames(5).map((game) => (
                <div key={game.id} className="bg-gray-700 p-3 rounded">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-white font-semibold">{game.opponent}</span>
                    <span className={`text-sm font-medium ${
                      game.result === 'win' ? 'text-green-400' :
                      game.result === 'loss' ? 'text-red-400' : 'text-yellow-400'
                    }`}>
                      {game.result === 'win' ? 'Vitória' : game.result === 'loss' ? 'Derrota' : 'Empate'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-300">
                    <span>{FACTION_NAMES[game.faction]} vs {FACTION_NAMES[game.opponentFaction]}</span>
                    <span>{Math.floor(game.duration / 60)}:{(game.duration % 60).toString().padStart(2, '0')}</span>
                  </div>
                  <div className="text-xs text-gray-400">
                    {formatDate(game.date)}
                  </div>
                </div>
              ))}
              
              {getRecentGames(5).length === 0 && (
                <div className="text-center text-gray-400 py-4">
                  Nenhum jogo recente
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Ações do Perfil */}
      <div className="text-center mt-8">
        <button
          onClick={() => setShowResetConfirmation(true)}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition duration-300"
        >
          Resetar Perfil
        </button>
      </div>

      {/* Modal de Confirmação de Reset */}
      {showResetConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg max-w-md mx-4">
            <h3 className="text-xl font-bold text-white mb-4">Tem certeza?</h3>
            <p className="text-gray-300 mb-6">
              Esta ação irá resetar completamente seu perfil, incluindo nível, XP, estatísticas e conquistas. 
              Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleResetProfile}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition duration-300"
              >
                Confirmar Reset
              </button>
              <button
                onClick={() => setShowResetConfirmation(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition duration-300"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

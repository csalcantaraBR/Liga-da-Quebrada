#!/bin/bash

# Script para verificar se mudanças em código crítico têm documentação atualizada
# Implementa o gate de CI de documentação conforme SSOT

set -e

echo "🔍 Verificando documentação SSOT..."

# Verificar se há mudanças em pacotes críticos
CRITICAL_CHANGES=false

if git diff --name-only HEAD~1 | grep -q "packages/@lq/game/"; then
    echo "⚠️  Mudanças detectadas em @lq/game (regras de jogo)"
    CRITICAL_CHANGES=true
fi

if git diff --name-only HEAD~1 | grep -q "packages/@lq/server/"; then
    echo "⚠️  Mudanças detectadas em @lq/server (DTOs/contratos)"
    CRITICAL_CHANGES=true
fi

if git diff --name-only HEAD~1 | grep -q "packages/@lq/web/"; then
    echo "⚠️  Mudanças detectadas em @lq/web (fluxos críticos)"
    CRITICAL_CHANGES=true
fi

if git diff --name-only HEAD~1 | grep -q "packages/@lq/mobile/"; then
    echo "⚠️  Mudanças detectadas em @lq/mobile (fluxos críticos)"
    CRITICAL_CHANGES=true
fi

# Se há mudanças críticas, verificar se há documentação atualizada
if [ "$CRITICAL_CHANGES" = true ]; then
    echo "📋 Verificando se há documentação atualizada..."
    
    DOC_CHANGES=false
    
    if git diff --name-only HEAD~1 | grep -q "docs/"; then
        echo "✅ Documentação atualizada detectada"
        DOC_CHANGES=true
    fi
    
    if git diff --name-only HEAD~1 | grep -q "Instruçoes/"; then
        echo "✅ Instruções funcionais atualizadas"
        DOC_CHANGES=true
    fi
    
    if [ "$DOC_CHANGES" = false ]; then
        echo "❌ ERRO: Mudanças críticas detectadas sem documentação atualizada"
        echo "📝 Por favor, atualize a documentação correspondente:"
        echo "   - docs/README.md"
        echo "   - docs/adr/ (se decisão arquitetural)"
        echo "   - docs/mocks/mocks.md (se novos mocks)"
        echo "   - Instruçoes/ (se regras/APIs/fluxos)"
        exit 1
    fi
fi

echo "✅ Verificação de documentação SSOT concluída"

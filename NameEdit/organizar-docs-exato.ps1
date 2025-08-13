# organizar-docs-exato.ps1  (ASCII-safe, Windows PowerShell friendly)
$ErrorActionPreference = 'Stop'

# Base do projeto (ajuste se precisar)
$base = 'C:\dev\Liga da Quebrada'

Write-Host "Base: $base"

# Descobrir a pasta "Instru*" sem usar acentos no script
$srcInstr = Get-ChildItem -LiteralPath $base -Directory -ErrorAction SilentlyContinue |
            Where-Object { $_.Name -like 'Instr*' -or $_.Name -like 'Instru*' } |
            Select-Object -First 1 -ExpandProperty FullName

if (-not $srcInstr) {
  Write-Warning "Pasta de origem tipo 'Instru*' nao encontrada sob $base"
  # seguimos mesmo assim, pois o Status_Report vem de docs\
}

# Pastas de destino
$destDocs  = Join-Path $base 'docs'
$destGuide = Join-Path $base 'docs\guide'

# Garantir pastas destino
if (-not (Test-Path -LiteralPath $destDocs)) {
  New-Item -ItemType Directory -Path $destDocs -Force | Out-Null
  Write-Host "Criada pasta: $destDocs"
} else {
  Write-Host "OK: pasta 'docs' existe."
}

if (-not (Test-Path -LiteralPath $destGuide)) {
  New-Item -ItemType Directory -Path $destGuide -Force | Out-Null
  Write-Host "Criada pasta: $destGuide"
} else {
  Write-Host "OK: pasta 'docs\guide' existe."
}

function Backup-IfExists {
  param([string]$path)
  if (Test-Path -LiteralPath $path) {
    $stamp = Get-Date -Format 'yyyyMMddHHmmss'
    $backup = "$path.bak.$stamp"
    Move-Item -LiteralPath $path -Destination $backup -Force
    Write-Host "Backup criado: $backup"
  }
}

function Move-To {
  param([string]$src, [string]$dst)
  Backup-IfExists -path $dst
  Move-Item -LiteralPath $src -Destination $dst -Force
  Write-Host "OK: '$src' -> '$dst'"
}

function Find-One {
  param([string]$dir, [string[]]$patterns)
  if (-not $dir -or -not (Test-Path -LiteralPath $dir)) { return $null }
  foreach ($p in $patterns) {
    $hit = Get-ChildItem -LiteralPath $dir -File -Recurse -ErrorAction SilentlyContinue |
           Where-Object { $_.Name -like $p } |
           Sort-Object FullName | Select-Object -First 1
    if ($hit) { return $hit }
  }
  return $null
}

# 1) [SYSTEM e INSTRUCOES FUNCIONAIS - TDD PRIMEIRO] -> 01-System-TDD-First.md
$sys = Find-One -dir $srcInstr -patterns @('*SYSTEM*INSTRU*FUNCION*PRIMEIRO*','*TDD*PRIMEIRO*','*SYSTEM*TDD*')
if ($sys) {
  Move-To -src $sys.FullName -dst (Join-Path $destGuide '01-System-TDD-First.md')
} else {
  Write-Warning "Nao localizado: SYSTEM/INSTRU/FUNCION/PRIMEIRO sob $srcInstr"
}

# 2) Instrucoes funcionais -> 02-Functional-Spec-MVP.md
$func = Find-One -dir $srcInstr -patterns @('*Instru*funcion*')
if ($func) {
  Move-To -src $func.FullName -dst (Join-Path $destGuide '02-Functional-Spec-MVP.md')
} else {
  Write-Warning "Nao localizado: Instrucoes funcionais sob $srcInstr"
}

# 3) Instrucoes do Projeto -> 03-Project-Brief-and-Standards.md
$proj = Find-One -dir $srcInstr -patterns @('*Instru*Projeto*')
if ($proj) {
  Move-To -src $proj.FullName -dst (Join-Path $destGuide '03-Project-Brief-and-Standards.md')
} else {
  Write-Warning "Nao localizado: Instrucoes do Projeto sob $srcInstr"
}

# 4) Instrucoes de UX UI e Animacoes -> 04-UX-UI-and-Animations-Guidelines.md
$ux = Find-One -dir $srcInstr -patterns @('*Instru*UX*UI*Anima*','*UX*UI*Anima*')
if ($ux) {
  Move-To -src $ux.FullName -dst (Join-Path $destGuide '04-UX-UI-and-Animations-Guidelines.md')
} else {
  Write-Warning "Nao localizado: Instrucoes de UX/UI e Animacoes sob $srcInstr"
}

# 5) Status_Report.md em docs\* (exceto docs\guide) -> 05-Status-Report.md
$status = Get-ChildItem -LiteralPath $destDocs -File -Recurse -ErrorAction SilentlyContinue |
          Where-Object { $_.Name -like 'Status*Report*.md' -and $_.FullName -notlike ($destGuide + '\*') } |
          Sort-Object FullName | Select-Object -First 1
if ($status) {
  Move-To -src $status.FullName -dst (Join-Path $destGuide '05-Status-Report.md')
} else {
  Write-Warning "Nao localizado: Status_Report.md sob $destDocs (fora de docs\guide)"
}

Write-Host ""
Write-Host "Concluido."
